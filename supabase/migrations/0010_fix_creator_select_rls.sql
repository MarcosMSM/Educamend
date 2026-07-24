-- Bug: ao criar uma família (ou aluno), o código faz `.insert(...).select().single()`
-- na mesma chamada. A policy de leitura original exigia já ser membro da
-- família (ou já ter acesso ao aluno via family_students) — vínculo que só é
-- criado no passo seguinte da mesma ação. Isso fazia o SELECT pós-insert
-- falhar (0 linhas visíveis), mesmo com o INSERT tendo funcionado.
-- Fix: quem criou a linha (created_by = auth.uid()) sempre pode vê-la,
-- independente do vínculo de família/aluno já existir ou não.

drop policy if exists "members can read their families" on public.families;
create policy "members can read their families"
  on public.families for select
  using (public.is_family_member(id) or created_by = auth.uid());

drop policy if exists "family can read their students" on public.students;
create policy "family can read their students"
  on public.students for select
  using (public.user_can_access_student(id) or created_by = auth.uid());
