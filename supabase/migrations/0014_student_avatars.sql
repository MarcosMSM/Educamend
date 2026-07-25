-- Foto de perfil do aluno.
alter table public.students
  add column avatar_path text;

insert into storage.buckets (id, name, public)
values ('student-avatars', 'student-avatars', true)
on conflict (id) do nothing;

-- Convenção de path: {student_id}/{filename}
create policy "family can read student avatar objects"
  on storage.objects for select
  using (
    bucket_id = 'student-avatars'
    and public.user_can_access_student(((storage.foldername(name))[1])::uuid)
  );

create policy "family can upload student avatar objects"
  on storage.objects for insert
  with check (
    bucket_id = 'student-avatars'
    and public.user_can_access_student(((storage.foldername(name))[1])::uuid)
  );

create policy "family can update student avatar objects"
  on storage.objects for update
  using (
    bucket_id = 'student-avatars'
    and public.user_can_access_student(((storage.foldername(name))[1])::uuid)
  );

create policy "family can delete student avatar objects"
  on storage.objects for delete
  using (
    bucket_id = 'student-avatars'
    and public.user_can_access_student(((storage.foldername(name))[1])::uuid)
  );
