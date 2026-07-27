create table if not exists public.areas (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.areas enable row level security;

drop policy if exists "authenticated can read areas" on public.areas;

create policy "authenticated can read areas"
  on public.areas for select
  to authenticated
  using (true);

insert into public.areas (name, sort_order) values
  ('Arte', 1),
  ('Ciências da Natureza', 2),
  ('Ciências Humanas', 3),
  ('Educação Física', 4),
  ('Ensino Religioso', 5),
  ('Finanças Pessoais', 6),
  ('Língua Estrangeira', 7),
  ('Língua Portuguesa', 8),
  ('Matemática', 9),
  ('Tecnologia', 10),
  ('Outro', 11)
on conflict (name) do nothing;

create table if not exists public.disciplines (
  id uuid primary key default gen_random_uuid(),
  area_id uuid not null references public.areas (id) on delete cascade,
  name text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (area_id, name)
);

alter table public.disciplines enable row level security;

drop policy if exists "authenticated can read disciplines" on public.disciplines;

create policy "authenticated can read disciplines"
  on public.disciplines for select
  to authenticated
  using (true);

drop policy if exists "authenticated can create disciplines" on public.disciplines;

create policy "authenticated can create disciplines"
  on public.disciplines for insert
  to authenticated
  with check (true);

insert into public.disciplines (area_id, name, sort_order)
select a.id, d.name, d.sort_order
from (values
  ('Língua Portuguesa', 'Português', 1),
  ('Língua Estrangeira', 'Inglês', 1),
  ('Língua Estrangeira', 'Espanhol', 2),
  ('Língua Estrangeira', 'Italiano', 3),
  ('Língua Estrangeira', 'Francês', 4),
  ('Língua Estrangeira', 'Alemão', 5),
  ('Língua Estrangeira', 'Mandarim', 6),
  ('Língua Estrangeira', 'Japonês', 7),
  ('Língua Estrangeira', 'Hebraico', 8),
  ('Língua Estrangeira', 'Grego', 9),
  ('Língua Estrangeira', 'Latim', 10),
  ('Língua Estrangeira', 'Árabe', 11),
  ('Língua Estrangeira', 'Libras / Língua de Sinais', 12),
  ('Matemática', 'Matemática Geral', 1),
  ('Matemática', 'Álgebra', 2),
  ('Matemática', 'Geometria', 3),
  ('Matemática', 'Estatística', 4),
  ('Matemática', 'Probabilidade', 5),
  ('Ciências da Natureza', 'Ciências', 1),
  ('Ciências da Natureza', 'Biologia', 2),
  ('Ciências da Natureza', 'Química', 3),
  ('Ciências da Natureza', 'Física', 4),
  ('Ciências da Natureza', 'Ciências Ambientais', 5),
  ('Ciências Humanas', 'História', 1),
  ('Ciências Humanas', 'Geografia', 2),
  ('Ciências Humanas', 'Filosofia', 3),
  ('Ciências Humanas', 'Sociologia', 4),
  ('Arte', 'Artes Visuais', 1),
  ('Arte', 'Música', 2),
  ('Arte', 'Teatro', 3),
  ('Arte', 'Dança', 4),
  ('Tecnologia', 'Ciência da Computação', 1),
  ('Tecnologia', 'Programação', 2),
  ('Tecnologia', 'Robótica', 3),
  ('Tecnologia', 'Inteligência Artificial', 4),
  ('Educação Física', 'Educação Física', 1),
  ('Ensino Religioso', 'Bíblia', 1),
  ('Ensino Religioso', 'Teologia', 2),
  ('Ensino Religioso', 'Estudos Religiosos', 3),
  ('Finanças Pessoais', 'Finanças Pessoais', 1),
  ('Outro', 'Outro', 1)
) as d(area_name, name, sort_order)
join public.areas a on a.name = d.area_name
on conflict (area_id, name) do nothing;

alter table public.courses
  add column if not exists area_id uuid references public.areas (id);

alter table public.courses
  add column if not exists discipline_id uuid references public.disciplines (id);

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'courses' and column_name = 'subject_id'
  ) then
    update public.courses c
    set area_id = a.id
    from public.subjects s
    join public.areas a on a.name = case s.name
      when 'Língua Portuguesa' then 'Língua Portuguesa'
      when 'Matemática' then 'Matemática'
      when 'Ciências' then 'Ciências da Natureza'
      when 'Física' then 'Ciências da Natureza'
      when 'Química' then 'Ciências da Natureza'
      when 'Biologia' then 'Ciências da Natureza'
      when 'História' then 'Ciências Humanas'
      when 'Geografia' then 'Ciências Humanas'
      when 'Sociologia' then 'Ciências Humanas'
      when 'Filosofia' then 'Ciências Humanas'
      when 'Artes' then 'Arte'
      when 'Educação Física' then 'Educação Física'
      when 'Inglês' then 'Língua Estrangeira'
      when 'Espanhol' then 'Língua Estrangeira'
      else 'Outro'
    end
    where s.id = c.subject_id
      and c.area_id is null;
  end if;
end $$;

update public.courses
set area_id = (select id from public.areas where name = 'Outro')
where area_id is null;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'courses' and column_name = 'subject_id'
  ) then
    update public.courses c
    set discipline_id = d.id
    from public.subjects s
    join public.disciplines d on d.area_id = c.area_id and d.name = case s.name
      when 'Língua Portuguesa' then 'Português'
      when 'Matemática' then 'Matemática Geral'
      when 'Ciências' then 'Ciências'
      when 'Física' then 'Física'
      when 'Química' then 'Química'
      when 'Biologia' then 'Biologia'
      when 'História' then 'História'
      when 'Geografia' then 'Geografia'
      when 'Sociologia' then 'Sociologia'
      when 'Filosofia' then 'Filosofia'
      when 'Artes' then 'Artes Visuais'
      when 'Educação Física' then 'Educação Física'
      when 'Inglês' then 'Inglês'
      when 'Espanhol' then 'Espanhol'
      else 'Outro'
    end
    where s.id = c.subject_id
      and c.discipline_id is null;
  end if;
end $$;

update public.courses c
set discipline_id = (
  select d.id from public.disciplines d
  where d.area_id = c.area_id
  order by d.sort_order
  limit 1
)
where discipline_id is null;

alter table public.courses
  alter column area_id set not null;

alter table public.courses
  alter column discipline_id set not null;

drop index if exists courses_subject_id_idx;

alter table public.courses
  drop column if exists subject_id;

create index if not exists courses_area_id_idx on public.courses (area_id);
create index if not exists courses_discipline_id_idx on public.courses (discipline_id);
