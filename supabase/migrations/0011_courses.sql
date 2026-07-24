-- Consolida currículo + material + nota em um único registro de "curso" por
-- período, ao estilo de ferramentas de planejamento homeschool (Applecore).
-- Substitui `study_plans` (que só guardava disciplina + objetivo em texto).

drop table if exists public.study_plans;

create table public.courses (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students (id) on delete cascade,
  academic_year_id uuid not null references public.academic_years (id) on delete cascade,
  term_id uuid not null references public.terms (id) on delete cascade,
  subject_id uuid not null references public.subjects (id),
  title text not null,
  resource text,
  special_course text,
  grade text,
  credits numeric(4, 2),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index courses_student_id_idx on public.courses (student_id);
create index courses_academic_year_id_idx on public.courses (academic_year_id);
create index courses_term_id_idx on public.courses (term_id);
create index courses_subject_id_idx on public.courses (subject_id);
