-- Perfil de prestador: etapa separada e opcional que qualquer usuário
-- autenticado pode ativar antes de poder publicar anúncios no marketplace.
-- Sem isso, o cadastro único (família) não distinguia "responsável" de
-- "professor/tutor/empresa oferecendo serviço".

create table public.provider_profiles (
  profile_id uuid primary key references public.profiles (id) on delete cascade,
  headline text,
  bio text,
  formation text,
  experience_years integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
