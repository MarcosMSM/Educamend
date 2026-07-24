-- Módulo 2: Portfólio do aluno
-- Reaproveita `projects.visibility` (já existente) como fonte de conteúdo público.
-- `students.portfolio_public` é a chave-mestra: só quando true a página pública
-- fica acessível, mesmo que existam projetos/destaques com visibility='public'.

alter table public.students
  add column headline text,
  add column bio text,
  add column portfolio_public boolean not null default false;

create type public.portfolio_highlight_category as enum (
  'premio',
  'certificado',
  'atividade',
  'voluntariado',
  'curso',
  'outro'
);

create table public.portfolio_highlights (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students (id) on delete cascade,
  title text not null,
  description text,
  category public.portfolio_highlight_category not null default 'outro',
  date date,
  visibility public.project_visibility not null default 'private',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index portfolio_highlights_student_id_idx on public.portfolio_highlights (student_id);
