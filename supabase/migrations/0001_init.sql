-- Módulo 1: Gestão Acadêmica — schema inicial
-- Convenção: student_id é a chave universal que módulos futuros (portfólio,
-- marketplace, trajetórias, empregos, bolsas) vão referenciar. `family` nunca
-- é FK obrigatória em tabelas de conteúdo acadêmico.

create extension if not exists "pgcrypto";

-- ============================================================================
-- Enums
-- ============================================================================

create type public.app_role as enum ('parent', 'student', 'teacher', 'company', 'admin');
create type public.family_relationship as enum ('parent', 'guardian', 'student', 'other');
create type public.academic_year_status as enum ('planning', 'active', 'completed');
create type public.material_type as enum ('livro', 'video', 'apostila', 'link', 'outro');
create type public.evaluation_type as enum ('prova', 'trabalho', 'projeto', 'participacao', 'outro');
create type public.project_status as enum ('planejado', 'em_andamento', 'concluido');
create type public.project_visibility as enum ('private', 'family', 'public');

-- ============================================================================
-- Profiles (espelha auth.users) + roles
-- ============================================================================

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  avatar_url text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_roles (
  profile_id uuid not null references public.profiles (id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  primary key (profile_id, role)
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');

  insert into public.user_roles (profile_id, role)
  values (new.id, 'parent');

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================================
-- Famílias
-- ============================================================================

create table public.families (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_by uuid not null references public.profiles (id),
  created_at timestamptz not null default now()
);

create table public.family_members (
  family_id uuid not null references public.families (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  relationship public.family_relationship not null default 'parent',
  is_admin boolean not null default true,
  created_at timestamptz not null default now(),
  primary key (family_id, profile_id)
);

create index family_members_profile_id_idx on public.family_members (profile_id);

-- ============================================================================
-- Alunos
-- ============================================================================

create table public.students (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles (id),
  full_name text not null,
  birth_date date,
  notes text,
  created_by uuid not null references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.family_students (
  family_id uuid not null references public.families (id) on delete cascade,
  student_id uuid not null references public.students (id) on delete cascade,
  relationship public.family_relationship not null default 'student',
  created_at timestamptz not null default now(),
  primary key (family_id, student_id)
);

create index family_students_student_id_idx on public.family_students (student_id);

-- ============================================================================
-- Currículo / disciplinas
-- ============================================================================

create table public.subjects (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references public.families (id) on delete cascade,
  name text not null,
  description text,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

create index subjects_family_id_idx on public.subjects (family_id);

create table public.curricula (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families (id) on delete cascade,
  name text not null,
  description text,
  created_by uuid not null references public.profiles (id),
  created_at timestamptz not null default now()
);

create index curricula_family_id_idx on public.curricula (family_id);

create table public.curriculum_subjects (
  curriculum_id uuid not null references public.curricula (id) on delete cascade,
  subject_id uuid not null references public.subjects (id) on delete cascade,
  sequence int not null default 0,
  notes text,
  primary key (curriculum_id, subject_id)
);

create index curriculum_subjects_subject_id_idx on public.curriculum_subjects (subject_id);

-- ============================================================================
-- Planejamento anual / semestral
-- ============================================================================

create table public.academic_years (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students (id) on delete cascade,
  name text not null,
  start_date date not null,
  end_date date not null,
  status public.academic_year_status not null default 'planning',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index academic_years_student_id_idx on public.academic_years (student_id);

create table public.terms (
  id uuid primary key default gen_random_uuid(),
  academic_year_id uuid not null references public.academic_years (id) on delete cascade,
  student_id uuid not null references public.students (id) on delete cascade,
  name text not null,
  start_date date not null,
  end_date date not null,
  sequence int not null default 0
);

create index terms_academic_year_id_idx on public.terms (academic_year_id);
create index terms_student_id_idx on public.terms (student_id);

create table public.study_plans (
  id uuid primary key default gen_random_uuid(),
  term_id uuid not null references public.terms (id) on delete cascade,
  student_id uuid not null references public.students (id) on delete cascade,
  subject_id uuid not null references public.subjects (id),
  curriculum_id uuid references public.curricula (id),
  goals text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (term_id, subject_id)
);

create index study_plans_term_id_idx on public.study_plans (term_id);
create index study_plans_student_id_idx on public.study_plans (student_id);
create index study_plans_subject_id_idx on public.study_plans (subject_id);
create index study_plans_curriculum_id_idx on public.study_plans (curriculum_id);

-- ============================================================================
-- Materiais
-- ============================================================================

create table public.materials (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students (id) on delete cascade,
  subject_id uuid not null references public.subjects (id),
  term_id uuid references public.terms (id),
  title text not null,
  type public.material_type not null default 'outro',
  url text,
  storage_path text,
  notes text,
  created_at timestamptz not null default now()
);

create index materials_student_id_idx on public.materials (student_id);
create index materials_subject_id_idx on public.materials (subject_id);
create index materials_term_id_idx on public.materials (term_id);

-- ============================================================================
-- Avaliações / notas
-- ============================================================================

create table public.evaluations (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students (id) on delete cascade,
  subject_id uuid not null references public.subjects (id),
  term_id uuid not null references public.terms (id),
  title text not null,
  type public.evaluation_type not null default 'outro',
  date date not null default current_date,
  max_score numeric(5, 2) not null default 10,
  score numeric(5, 2),
  feedback text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index evaluations_student_id_idx on public.evaluations (student_id);
create index evaluations_subject_id_idx on public.evaluations (subject_id);
create index evaluations_term_id_idx on public.evaluations (term_id);

-- ============================================================================
-- Projetos
-- ============================================================================

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students (id) on delete cascade,
  subject_id uuid references public.subjects (id),
  title text not null,
  description text,
  start_date date,
  end_date date,
  status public.project_status not null default 'planejado',
  visibility public.project_visibility not null default 'private',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index projects_student_id_idx on public.projects (student_id);
create index projects_subject_id_idx on public.projects (subject_id);

create table public.project_attachments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  storage_path text not null,
  file_name text,
  mime_type text,
  created_at timestamptz not null default now()
);

create index project_attachments_project_id_idx on public.project_attachments (project_id);
