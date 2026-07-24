alter table public.courses enable row level security;

create policy "family can read courses"
  on public.courses for select
  using (public.user_can_access_student(student_id));

create policy "family can write courses"
  on public.courses for all
  using (public.user_can_access_student(student_id))
  with check (public.user_can_access_student(student_id));
