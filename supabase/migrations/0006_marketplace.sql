-- Módulo 3: Marketplace de serviços
-- Primeira funcionalidade que atravessa famílias: professores, tutores e os
-- próprios alunos podem oferecer aulas/tutoria; qualquer família pode
-- descobrir e solicitar. `provider_profile_id` referencia profiles
-- diretamente (não students/families) porque quem oferece o serviço é uma
-- pessoa com conta própria, não necessariamente vinculada à família que
-- solicita.

create type public.service_category as enum ('aula', 'tutoria', 'mentoria', 'outro');
create type public.service_modality as enum ('online', 'presencial', 'hibrido');
create type public.service_price_unit as enum ('hora', 'sessao', 'pacote');
create type public.listing_status as enum ('active', 'paused', 'archived');
create type public.booking_status as enum ('pending', 'accepted', 'declined', 'cancelled', 'completed');

create table public.service_listings (
  id uuid primary key default gen_random_uuid(),
  provider_profile_id uuid not null references public.profiles (id) on delete cascade,
  subject_id uuid references public.subjects (id),
  title text not null,
  description text,
  category public.service_category not null default 'outro',
  modality public.service_modality not null default 'online',
  price numeric(8, 2),
  price_unit public.service_price_unit not null default 'hora',
  status public.listing_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index service_listings_provider_profile_id_idx on public.service_listings (provider_profile_id);
create index service_listings_status_idx on public.service_listings (status);

create table public.service_bookings (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.service_listings (id) on delete cascade,
  requested_by_profile_id uuid not null references public.profiles (id) on delete cascade,
  student_id uuid references public.students (id),
  message text,
  preferred_date date,
  status public.booking_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index service_bookings_listing_id_idx on public.service_bookings (listing_id);
create index service_bookings_requested_by_idx on public.service_bookings (requested_by_profile_id);
create index service_bookings_student_id_idx on public.service_bookings (student_id);
