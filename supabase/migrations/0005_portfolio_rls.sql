-- RLS do módulo de portfólio.
-- Além do acesso de família (via user_can_access_student), adicionamos
-- policies de leitura pública para visitantes anônimos: só enxergam um aluno
-- se `portfolio_public = true`, e dentro dele só itens com visibility='public'.

alter table public.portfolio_highlights enable row level security;

create policy "family can read portfolio_highlights"
  on public.portfolio_highlights for select
  using (public.user_can_access_student(student_id));

create policy "family can write portfolio_highlights"
  on public.portfolio_highlights for all
  using (public.user_can_access_student(student_id))
  with check (public.user_can_access_student(student_id));

-- Leitura pública (sem autenticação) do aluno, quando o portfólio está aberto
create policy "anyone can read public student portfolios"
  on public.students for select
  using (portfolio_public = true);

-- Leitura pública de projetos marcados como 'public'
create policy "anyone can read public projects"
  on public.projects for select
  using (
    visibility = 'public'
    and exists (
      select 1 from public.students s
      where s.id = projects.student_id and s.portfolio_public = true
    )
  );

-- Leitura pública de destaques marcados como 'public'
create policy "anyone can read public portfolio_highlights"
  on public.portfolio_highlights for select
  using (
    visibility = 'public'
    and exists (
      select 1 from public.students s
      where s.id = portfolio_highlights.student_id and s.portfolio_public = true
    )
  );
