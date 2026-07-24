-- Espaço do aluno: campos exibidos na tela de boas-vindas da família e no hub do aluno.
alter table public.families
  add column city text;

alter table public.students
  add column grade_level text;
