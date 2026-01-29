-- Criar schemas necessários para Supabase
-- Schema auth (necessário para GoTrue)
CREATE SCHEMA IF NOT EXISTS auth;

-- Schema storage (necessário para Supabase Storage)
CREATE SCHEMA IF NOT EXISTS storage;

-- Garantir que os schemas existem antes das migrações
-- O GoTrue criará as tabelas necessárias no schema auth
-- O Supabase Storage criará as tabelas necessárias no schema storage
