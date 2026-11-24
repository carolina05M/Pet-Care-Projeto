-- =====================================================================
-- Fase 8 — Validações no banco (telefone e tamanhos de texto)
-- Rode no SQL Editor do Supabase, DEPOIS do Apêndice A. Pode rodar mais de uma vez.
--
-- Por que no banco? A validação do React é só conforto: qualquer pessoa pode
-- chamar a API do Supabase sem passar pelo site. O banco é quem garante.
-- Por que NÃO trocar o tipo da coluna telefone? O trigger de cadastro grava o
-- telefone como texto; mudar o tipo faz o cadastro falhar
-- ("Database error saving new user"). A regra certa é uma CHECK constraint.
-- =====================================================================

-- 0) Se você mudou o tipo da coluna telefone no Supabase, volte para text
--    (descomente a linha abaixo se for o seu caso):
-- alter table public.profiles alter column telefone type text using telefone::text;

-- 1) Padroniza os telefones já salvos: só dígitos; o que não for celular
--    válido (DDD + 9 + 8 dígitos = 11 números) vira NULL.
--    ATENÇÃO: isso apaga telefones de teste fora do padrão.
update public.profiles
   set telefone = nullif(regexp_replace(telefone, '\D', '', 'g'), '')
 where telefone is not null;

update public.profiles
   set telefone = null
 where telefone is not null and telefone !~ '^[1-9][1-9]9[0-9]{8}$';

update public.mensagens
   set telefone = nullif(regexp_replace(telefone, '\D', '', 'g'), '')
 where telefone is not null;

update public.mensagens
   set telefone = null
 where telefone is not null and telefone !~ '^[1-9][1-9]9[0-9]{8}$';

-- 2) Regra do telefone: nulo ou exatamente 11 dígitos de celular brasileiro
alter table public.profiles drop constraint if exists profiles_telefone_valido;
alter table public.profiles
  add constraint profiles_telefone_valido
  check (telefone is null or telefone ~ '^[1-9][1-9]9[0-9]{8}$');

alter table public.mensagens drop constraint if exists mensagens_telefone_valido;
alter table public.mensagens
  add constraint mensagens_telefone_valido
  check (telefone is null or telefone ~ '^[1-9][1-9]9[0-9]{8}$');

-- 3) Trigger de cadastro: normaliza o telefone e NUNCA derruba o cadastro por causa dele
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  tel text := regexp_replace(coalesce(new.raw_user_meta_data->>'telefone', ''), '\D', '', 'g');
begin
  insert into public.profiles (id, nome, telefone)
  values (
    new.id,
    coalesce(nullif(btrim(new.raw_user_meta_data->>'nome'), ''), split_part(new.email, '@', 1)),
    case when tel ~ '^[1-9][1-9]9[0-9]{8}$' then tel else null end
  );
  return new;
end;
$$;

-- 4) Tamanhos máximos dos textos dos pets. "not valid" = vale para linhas novas e
--    editadas; não reprova registros antigos que já estejam fora do limite.
alter table public.pets drop constraint if exists pets_nome_tamanho;
alter table public.pets
  add constraint pets_nome_tamanho
  check (char_length(btrim(nome)) between 1 and 40) not valid;

alter table public.pets drop constraint if exists pets_raca_tamanho;
alter table public.pets
  add constraint pets_raca_tamanho
  check (raca is null or char_length(raca) <= 40) not valid;

alter table public.pets drop constraint if exists pets_observacoes_tamanho;
alter table public.pets
  add constraint pets_observacoes_tamanho
  check (observacoes is null or char_length(observacoes) <= 500) not valid;

-- Conferência: deve listar as constraints criadas
select conrelid::regclass as tabela, conname, convalidated as validada
  from pg_constraint
 where conname in (
   'profiles_telefone_valido', 'mensagens_telefone_valido',
   'pets_nome_tamanho', 'pets_raca_tamanho', 'pets_observacoes_tamanho'
 )
 order by 1, 2;
