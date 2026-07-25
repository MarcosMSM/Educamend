-- Substitui o mock em memória de "Experiências" (Jornada) por dados reais.
create type public.journey_status as enum
  ('rascunho', 'autodeclarada', 'aguardando_validacao', 'validada', 'arquivada');

create type public.journey_visibility as enum ('private', 'family', 'public');

create table public.journey_experiences (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students (id) on delete cascade,
  title text not null,
  category text not null,
  organization text,
  description text,
  reflection text,
  start_date date,
  end_date date,
  hours numeric(6, 2),
  skills text[] not null default '{}',
  attachments jsonb not null default '[]',
  status public.journey_status not null default 'rascunho',
  visibility public.journey_visibility not null default 'private',
  validated_by uuid references public.profiles (id),
  validated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index journey_experiences_student_id_idx on public.journey_experiences (student_id);

alter table public.journey_experiences enable row level security;

create policy "family can read journey experiences"
  on public.journey_experiences for select
  using (public.user_can_access_student(student_id));

create policy "family can write journey experiences"
  on public.journey_experiences for all
  using (public.user_can_access_student(student_id))
  with check (public.user_can_access_student(student_id));
