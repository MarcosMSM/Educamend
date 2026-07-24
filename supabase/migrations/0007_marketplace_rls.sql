-- RLS do marketplace.
-- Anúncios ativos são visíveis para qualquer usuário autenticado (não só a
-- família dona), diferente de todo o resto do schema que é isolado por
-- família. Reservas seguem a regra usual: só quem pediu ou quem oferece o
-- serviço enxerga.

-- O marketplace precisa exibir o nome de quem oferece o serviço (e a página
-- de família precisa exibir o nome dos demais membros) — a policy anterior
-- só permitia ler o próprio perfil. `profiles` não guarda nada sensível
-- (email/senha ficam em auth.users), então liberamos leitura para qualquer
-- usuário autenticado.
create policy "authenticated users can read profiles"
  on public.profiles for select
  using (auth.uid() is not null);

alter table public.service_listings enable row level security;

create policy "any authenticated user can read active listings"
  on public.service_listings for select
  using (status = 'active' or provider_profile_id = auth.uid());

create policy "provider can create own listings"
  on public.service_listings for insert
  with check (provider_profile_id = auth.uid());

create policy "provider can update own listings"
  on public.service_listings for update
  using (provider_profile_id = auth.uid())
  with check (provider_profile_id = auth.uid());

create policy "provider can delete own listings"
  on public.service_listings for delete
  using (provider_profile_id = auth.uid());

alter table public.service_bookings enable row level security;

create policy "requester or provider can read booking"
  on public.service_bookings for select
  using (
    requested_by_profile_id = auth.uid()
    or exists (
      select 1 from public.service_listings sl
      where sl.id = service_bookings.listing_id
        and sl.provider_profile_id = auth.uid()
    )
  );

create policy "authenticated user can request booking"
  on public.service_bookings for insert
  with check (
    requested_by_profile_id = auth.uid()
    and (
      student_id is null
      or public.user_can_access_student(student_id)
    )
  );

create policy "requester or provider can update booking"
  on public.service_bookings for update
  using (
    requested_by_profile_id = auth.uid()
    or exists (
      select 1 from public.service_listings sl
      where sl.id = service_bookings.listing_id
        and sl.provider_profile_id = auth.uid()
    )
  )
  with check (
    requested_by_profile_id = auth.uid()
    or exists (
      select 1 from public.service_listings sl
      where sl.id = service_bookings.listing_id
        and sl.provider_profile_id = auth.uid()
    )
  );
