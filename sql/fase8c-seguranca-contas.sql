-- ==========================================================
-- PETCARE — CORREÇÃO DE SEGURANÇA DAS CONTAS
-- Impede auto-reativação e bloqueia acesso de contas inativas.
-- Executar após o esquema principal do banco.
-- ==========================================================

-- 1. Verifica se o usuário autenticado está ativo
CREATE OR REPLACE FUNCTION public.is_active_user()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = (SELECT auth.uid())
      AND ativo = true
  );
$$;


-- 2. Atualiza a verificação de administrador
-- Administradores desativados também perdem os privilégios.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = (SELECT auth.uid())
      AND role = 'admin'
      AND ativo = true
  );
$$;


-- 3. Protege os campos role e ativo
CREATE OR REPLACE FUNCTION public.proteger_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NOT NULL
     AND NOT public.is_admin()
     AND (
       NEW.role IS DISTINCT FROM OLD.role
       OR NEW.ativo IS DISTINCT FROM OLD.ativo
     )
  THEN
    RAISE EXCEPTION
      'Apenas administradores podem alterar o papel ou a situação da conta.';
  END IF;

  RETURN NEW;
END;
$$;


-- 4. Restringe as colunas que podem ser atualizadas
-- Clientes e administradores podem atualizar nome, telefone e ativo.
-- O campo role continua sendo administrado pelo SQL.
REVOKE UPDATE ON TABLE public.profiles FROM authenticated;

GRANT UPDATE (nome, telefone, ativo)
ON TABLE public.profiles
TO authenticated;


-- 5. Protege a atualização do próprio perfil
DROP POLICY IF EXISTS profiles_update_proprio
ON public.profiles;

CREATE POLICY profiles_update_proprio
ON public.profiles
FOR UPDATE
TO authenticated
USING (
  id = (SELECT auth.uid())
  AND public.is_active_user()
)
WITH CHECK (
  id = (SELECT auth.uid())
  AND public.is_active_user()
);


-- 6. Mantém a administração dos perfis
DROP POLICY IF EXISTS profiles_update_admin
ON public.profiles;

CREATE POLICY profiles_update_admin
ON public.profiles
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());


-- 7. Pets: somente o tutor ativo ou administrador pode acessar.
DROP POLICY IF EXISTS pets_all ON public.pets;

CREATE POLICY pets_all
ON public.pets
FOR ALL
TO authenticated
USING (
  (
    tutor_id = (SELECT auth.uid())
    AND public.is_active_user()
  )
  OR public.is_admin()
)
WITH CHECK (
  (
    tutor_id = (SELECT auth.uid())
    AND public.is_active_user()
  )
  OR public.is_admin()
);


-- 8. Agendamentos: leitura
DROP POLICY IF EXISTS agend_select
ON public.agendamentos;

CREATE POLICY agend_select
ON public.agendamentos
FOR SELECT
TO authenticated
USING (
  (
    cliente_id = (SELECT auth.uid())
    AND public.is_active_user()
  )
  OR public.is_admin()
);


-- 9. Agendamentos: cadastro
DROP POLICY IF EXISTS agend_insert
ON public.agendamentos;

CREATE POLICY agend_insert
ON public.agendamentos
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_admin()
  OR (
    public.is_active_user()
    AND cliente_id = (SELECT auth.uid())
    AND status = 'pendente'
    AND EXISTS (
      SELECT 1
      FROM public.pets p
      WHERE p.id = pet_id
        AND p.tutor_id = (SELECT auth.uid())
    )
  )
);


-- 10. Agendamentos: cancelamento pelo cliente
DROP POLICY IF EXISTS agend_update_cliente
ON public.agendamentos;

CREATE POLICY agend_update_cliente
ON public.agendamentos
FOR UPDATE
TO authenticated
USING (
  cliente_id = (SELECT auth.uid())
  AND public.is_active_user()
)
WITH CHECK (
  cliente_id = (SELECT auth.uid())
  AND public.is_active_user()
  AND status = 'cancelado'
);


-- As políticas administrativas restantes continuam utilizando
-- public.is_admin(), que agora também verifica se a conta está ativa.

-- ==========================================================
-- FIM DA CORREÇÃO
-- ==========================================================
