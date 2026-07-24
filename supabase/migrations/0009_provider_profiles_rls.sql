alter table public.provider_profiles enable row level security;

create policy "authenticated users can read provider_profiles"
  on public.provider_profiles for select
  using (auth.uid() is not null);

create policy "user can create own provider_profile"
  on public.provider_profiles for insert
  with check (profile_id = auth.uid());

create policy "user can update own provider_profile"
  on public.provider_profiles for update
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

create policy "user can delete own provider_profile"
  on public.provider_profiles for delete
  using (profile_id = auth.uid());

-- Agora só quem tem um provider_profile ativo pode publicar anúncios.
alter policy "provider can create own listings"
  on public.service_listings
  with check (
    provider_profile_id = auth.uid()
    and exists (
      select 1 from public.provider_profiles pp
      where pp.profile_id = auth.uid()
    )
  );
