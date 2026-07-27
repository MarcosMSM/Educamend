alter table public.academic_years
  add column if not exists grade_level text,
  add column if not exists curriculum_base text,
  add column if not exists curriculum_base_other text,
  add column if not exists cc_level text;

alter table public.academic_years
  drop constraint if exists academic_years_curriculum_base_check;

alter table public.academic_years
  add constraint academic_years_curriculum_base_check check (
    curriculum_base is null or curriculum_base in ('cc', 'regular', 'outro')
  );
