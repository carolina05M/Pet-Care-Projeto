-- =====================================================================
-- Fase 9 — Dados de demonstração (rode no SQL Editor do Supabase)
--
-- ANTES: crie as duas contas PELO SITE (/entrar -> "Criar conta"), uma para o
-- cliente e outra para o administrador de demonstração.
-- Depois troque os dois e-mails logo abaixo e execute.
--
-- O script:
--   1) promove a conta admin (o papel nunca vem do formulário);
--   2) cria 2 pets para o cliente;
--   3) cria agendamentos de exemplo: 2 concluídos, 1 cancelado, 2 pendentes e 1 confirmado;
--   4) cria 2 mensagens de contato (uma não lida).
-- Pode rodar de novo: apaga e recria só os itens marcados como "[demo]".
-- Se aparecer erro "agendamentos_sem_sobreposicao", já existe um agendamento seu (de teste)
-- nesses horários: cancele-o no painel (ou apague) e rode de novo.
-- RODE DE NOVO NA VÉSPERA DA APRESENTAÇÃO: os agendamentos "futuros" são calculados a
-- partir de hoje (próxima semana); depois de alguns dias eles passam a ser antigos.
-- =====================================================================

do $$
declare
  v_email_cliente constant text := 'cliente.demo@exemplo.com';   -- << ALTERE
  v_email_admin   constant text := 'admin.demo@exemplo.com';     -- << ALTERE

  v_cliente uuid;
  v_admin   uuid;
  v_segunda date := (date_trunc('week', now() at time zone 'America/Porto_Velho'))::date;  -- segunda desta semana (horário da loja)
begin
  select id into v_cliente from auth.users where lower(email) = lower(v_email_cliente);
  select id into v_admin   from auth.users where lower(email) = lower(v_email_admin);

  if v_cliente is null then
    raise exception 'Conta de cliente não encontrada: %. Crie-a pelo site (/entrar) e confira o e-mail acima.', v_email_cliente;
  end if;
  if v_admin is null then
    raise exception 'Conta de administrador não encontrada: %. Crie-a pelo site (/entrar) e confira o e-mail acima.', v_email_admin;
  end if;

  if (select count(*) from public.servicos where ativo) < 4 then
    raise exception 'São necessários ao menos 4 serviços ativos para criar os agendamentos de exemplo.';
  end if;

  -- 1) Admin (o SQL Editor tem auth.uid() nulo, então o gatilho proteger_role permite)
  update public.profiles set role = 'admin', ativo = true where id = v_admin;
  update public.profiles set ativo = true where id = v_cliente;

  -- 2) Pets do cliente (só cria se ainda não existirem)
  insert into public.pets (tutor_id, nome, especie, raca, data_nascimento, observacoes)
  select v_cliente, 'Thor', 'cachorro', 'Golden Retriever', date '2021-03-15', 'Muito dócil. Gosta de banho morno.'
   where not exists (select 1 from public.pets where tutor_id = v_cliente and nome = 'Thor');

  insert into public.pets (tutor_id, nome, especie, raca, data_nascimento, observacoes)
  select v_cliente, 'Mia', 'gato', 'Siamês', date '2022-08-02', 'Tem medo de secador.'
   where not exists (select 1 from public.pets where tutor_id = v_cliente and nome = 'Mia');

  -- 3) Agendamentos de exemplo (recria só os marcados com [demo])
  delete from public.agendamentos where cliente_id = v_cliente and observacoes like '[demo]%';

  -- semana passada: 2 concluídos e 1 cancelado
  insert into public.agendamentos (cliente_id, pet_id, servico_id, data_hora, status, observacoes)
  values
    (v_cliente,
     (select id from public.pets where tutor_id = v_cliente and nome = 'Thor'),
     (select id from public.servicos where ativo order by nome limit 1 offset 0),
     ((v_segunda - 7)::timestamp + time '09:00') at time zone 'America/Porto_Velho',
     'concluido', '[demo] Atendimento concluído'),
    (v_cliente,
     (select id from public.pets where tutor_id = v_cliente and nome = 'Mia'),
     (select id from public.servicos where ativo order by nome limit 1 offset 1),
     ((v_segunda - 5)::timestamp + time '14:00') at time zone 'America/Porto_Velho',
     'concluido', '[demo] Atendimento concluído'),
    (v_cliente,
     (select id from public.pets where tutor_id = v_cliente and nome = 'Thor'),
     (select id from public.servicos where ativo order by nome limit 1 offset 2),
     ((v_segunda - 4)::timestamp + time '10:00') at time zone 'America/Porto_Velho',
     'cancelado', '[demo] Cancelado pelo cliente');

  -- semana que vem: 2 pendentes e 1 confirmado
  insert into public.agendamentos (cliente_id, pet_id, servico_id, data_hora, status, observacoes)
  values
    (v_cliente,
     (select id from public.pets where tutor_id = v_cliente and nome = 'Thor'),
     (select id from public.servicos where ativo order by nome limit 1 offset 0),
     ((v_segunda + 7)::timestamp + time '09:00') at time zone 'America/Porto_Velho',
     'pendente', '[demo] Aguardando confirmação'),
    (v_cliente,
     (select id from public.pets where tutor_id = v_cliente and nome = 'Mia'),
     (select id from public.servicos where ativo order by nome limit 1 offset 1),
     ((v_segunda + 8)::timestamp + time '15:00') at time zone 'America/Porto_Velho',
     'confirmado', '[demo] Já confirmado pela loja'),
    (v_cliente,
     (select id from public.pets where tutor_id = v_cliente and nome = 'Thor'),
     (select id from public.servicos where ativo order by nome limit 1 offset 3),
     ((v_segunda + 9)::timestamp + time '10:00') at time zone 'America/Porto_Velho',
     'pendente', '[demo] Aguardando confirmação');

  -- 4) Mensagens de contato de exemplo
  delete from public.mensagens where email = 'visitante.demo@exemplo.com';
  insert into public.mensagens (nome, email, telefone, mensagem, lida)
  values
    ('Visitante Demonstração', 'visitante.demo@exemplo.com', '69999990000',
     'Olá! Vocês atendem aos sábados? Gostaria de agendar um banho para o meu cachorro.', false),
    ('Visitante Demonstração', 'visitante.demo@exemplo.com', null,
     'Obrigado pelo atendimento de ontem, o meu gato adorou!', true);

  raise notice 'Dados de demonstração criados. Admin: %, cliente: %', v_email_admin, v_email_cliente;
end;
$$;

-- Conferência
select
  (select count(*) from public.profiles where role = 'admin')                    as admins,
  (select count(*) from public.pets where nome in ('Thor', 'Mia'))               as pets_demo,
  (select count(*) from public.agendamentos where observacoes like '[demo]%')    as agendamentos_demo,
  (select count(*) from public.mensagens where email = 'visitante.demo@exemplo.com') as mensagens_demo;
