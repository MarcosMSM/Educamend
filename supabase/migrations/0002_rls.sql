-- RLS: segurança baseada em pertencimento família <-> aluno, não no role.

-- ============================================================================
-- Funções de apoio (security definer, evitam RLS recursivo)
-- ============================================================================

create or replace function public.is_family_member(target_family_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.family_members
    where family_id = target_family_id
      and profile_id = auth.uid()
  );
$$;

create or replace function public.user_can_access_student(target_student_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.family_students fs
    join public.family_members fm on fm.family_id = fs.family_id
    where fs.student_id = target_student_id
      and fm.profile_id = auth.uid()
  );
$$;

-- ============================================================================
-- profiles / user_roles
-- ============================================================================

alter table public.profiles enable row level security;

create policy "users can read own profile"
  on public.profiles for select
  using (id = auth.uid());

create policy "users can update own profile"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

alter table public.user_roles enable row level security;

create policy "users can read own roles"
  on public.user_roles for select
  using (profile_id = auth.uid());

-- ============================================================================
-- families / family_members
-- ============================================================================

alter table public.families enable row level security;

create policy "members can read their families"
  on public.families for select
  using (public.is_family_member(id));

create policy "authenticated users can create a family"
  on public.families for insert
  with check (created_by = auth.uid());

create policy "family admins can update their family"
  on public.families for update
  using (public.is_family_member(id))
  with check (public.is_family_member(id));

alter table public.family_members enable row level security;

create policy "members can read their family membership"
  on public.family_members for select
  using (public.is_family_member(family_id));

create policy "family admins can add members"
  on public.family_members for insert
  with check (
    -- primeiro membro (criador) ou admin existente da família
    profile_id = auth.uid()
    or exists (
      select 1 from public.family_members fm
      where fm.family_id = family_members.family_id
        and fm.profile_id = auth.uid()
        and fm.is_admin
    )
  );

create policy "family admins can remove members"
  on public.family_members for delete
  using (
    exists (
      select 1 from public.family_members fm
      where fm.family_id = family_members.family_id
        and fm.profile_id = auth.uid()
        and fm.is_admin
    )
  );

-- ============================================================================
-- students / family_students
-- ============================================================================

alter table public.students enable row level security;

create policy "family can read their students"
  on public.students for select
  using (public.user_can_access_student(id));

create policy "family can create students"
  on public.students for insert
  with check (created_by = auth.uid());

create policy "family can update their students"
  on public.students for update
  using (public.user_can_access_student(id))
  with check (public.user_can_access_student(id));

create policy "family can delete their students"
  on public.students for delete
  using (public.user_can_access_student(id));

alter table public.family_students enable row level security;

create policy "family can read their family_students"
  on public.family_students for select
  using (public.is_family_member(family_id));

create policy "family can link students"
  on public.family_students for insert
  with check (public.is_family_member(family_id));

create policy "family can unlink students"
  on public.family_students for delete
  using (public.is_family_member(family_id));

-- ============================================================================
-- subjects / curricula / curriculum_subjects
-- ============================================================================

alter table public.subjects enable row level security;

create policy "read global or family subjects"
  on public.subjects for select
  using (family_id is null or public.is_family_member(family_id));

create policy "family can create own subjects"
  on public.subjects for insert
  with check (family_id is not null and public.is_family_member(family_id));

create policy "family can update own subjects"
  on public.subjects for update
  using (family_id is not null and public.is_family_member(family_id))
  with check (family_id is not null and public.is_family_member(family_id));

create policy "family can delete own subjects"
  on public.subjects for delete
  using (family_id is not null and public.is_family_member(family_id));

alter table public.curricula enable row level security;

create policy "family can read own curricula"
  on public.curricula for select
  using (public.is_family_member(family_id));

create policy "family can write own curricula"
  on public.curricula for all
  using (public.is_family_member(family_id))
  with check (public.is_family_member(family_id));

alter table public.curriculum_subjects enable row level security;

create policy "family can read curriculum_subjects"
  on public.curriculum_subjects for select
  using (
    exists (
      select 1 from public.curricula c
      where c.id = curriculum_subjects.curriculum_id
        and public.is_family_member(c.family_id)
    )
  );

create policy "family can write curriculum_subjects"
  on public.curriculum_subjects for all
  using (
    exists (
      select 1 from public.curricula c
      where c.id = curriculum_subjects.curriculum_id
        and public.is_family_member(c.family_id)
    )
  )
  with check (
    exists (
      select 1 from public.curricula c
      where c.id = curriculum_subjects.curriculum_id
        and public.is_family_member(c.family_id)
    )
  );

-- ============================================================================
-- academic_years / terms / study_plans
-- ============================================================================

alter table public.academic_years enable row level security;

create policy "family can read academic_years"
  on public.academic_years for select
  using (public.user_can_access_student(student_id));

create policy "family can write academic_years"
  on public.academic_years for all
  using (public.user_can_access_student(student_id))
  with check (public.user_can_access_student(student_id));

alter table public.terms enable row level security;

create policy "family can read terms"
  on public.terms for select
  using (public.user_can_access_student(student_id));

create policy "family can write terms"
  on public.terms for all
  using (public.user_can_access_student(student_id))
  with check (public.user_can_access_student(student_id));

alter table public.study_plans enable row level security;

create policy "family can read study_plans"
  on public.study_plans for select
  using (public.user_can_access_student(student_id));

create policy "family can write study_plans"
  on public.study_plans for all
  using (public.user_can_access_student(student_id))
  with check (public.user_can_access_student(student_id));

-- ============================================================================
-- materials / evaluations / projects / project_attachments
-- ============================================================================

alter table public.materials enable row level security;

create policy "family can read materials"
  on public.materials for select
  using (public.user_can_access_student(student_id));

create policy "family can write materials"
  on public.materials for all
  using (public.user_can_access_student(student_id))
  with check (public.user_can_access_student(student_id));

alter table public.evaluations enable row level security;

create policy "family can read evaluations"
  on public.evaluations for select
  using (public.user_can_access_student(student_id));

create policy "family can write evaluations"
  on public.evaluations for all
  using (public.user_can_access_student(student_id))
  with check (public.user_can_access_student(student_id));

alter table public.projects enable row level security;

create policy "family can read projects"
  on public.projects for select
  using (public.user_can_access_student(student_id));

create policy "family can write projects"
  on public.projects for all
  using (public.user_can_access_student(student_id))
  with check (public.user_can_access_student(student_id));

alter table public.project_attachments enable row level security;

create policy "family can read project_attachments"
  on public.project_attachments for select
  using (
    exists (
      select 1 from public.projects p
      where p.id = project_attachments.project_id
        and public.user_can_access_student(p.student_id)
    )
  );

create policy "family can write project_attachments"
  on public.project_attachments for all
  using (
    exists (
      select 1 from public.projects p
      where p.id = project_attachments.project_id
        and public.user_can_access_student(p.student_id)
    )
  )
  with check (
    exists (
      select 1 from public.projects p
      where p.id = project_attachments.project_id
        and public.user_can_access_student(p.student_id)
    )
  );

-- ============================================================================
-- Storage buckets + policies
-- ============================================================================

insert into storage.buckets (id, name, public)
values ('materials', 'materials', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('project-attachments', 'project-attachments', false)
on conflict (id) do nothing;

-- Convenção de path: {student_id}/{filename}
create policy "family can read student storage objects"
  on storage.objects for select
  using (
    bucket_id in ('materials', 'project-attachments')
    and public.user_can_access_student(((storage.foldername(name))[1])::uuid)
  );

create policy "family can upload student storage objects"
  on storage.objects for insert
  with check (
    bucket_id in ('materials', 'project-attachments')
    and public.user_can_access_student(((storage.foldername(name))[1])::uuid)
  );

create policy "family can update student storage objects"
  on storage.objects for update
  using (
    bucket_id in ('materials', 'project-attachments')
    and public.user_can_access_student(((storage.foldername(name))[1])::uuid)
  );

create policy "family can delete student storage objects"
  on storage.objects for delete
  using (
    bucket_id in ('materials', 'project-attachments')
    and public.user_can_access_student(((storage.foldername(name))[1])::uuid)
  );
