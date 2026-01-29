-- Criar roles necessários para Supabase
DO $$
BEGIN
  -- Role supabase_admin (necessário para criar extensões e operações administrativas)
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'supabase_admin') THEN
    CREATE ROLE supabase_admin WITH SUPERUSER BYPASSRLS CREATEDB CREATEROLE LOGIN;
  END IF;

  -- Role anon (necessário para PostgREST - usuários não autenticados)
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'anon') THEN
    CREATE ROLE anon NOLOGIN;
  END IF;

  -- Role authenticated (necessário para usuários autenticados)
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'authenticated') THEN
    CREATE ROLE authenticated NOLOGIN;
  END IF;

  -- Role service_role (necessário para operações administrativas)
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'service_role') THEN
    CREATE ROLE service_role NOLOGIN BYPASSRLS;
  END IF;

  -- Grant anon ao authenticated (hierarquia de roles)
  GRANT anon TO authenticated;
  
  -- Grant authenticated ao service_role
  GRANT authenticated TO service_role;
END
$$;