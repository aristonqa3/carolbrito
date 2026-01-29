# Guia de Setup Completo

## 🚀 Setup Inicial

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o `.env` com suas credenciais do Supabase:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon
```

### 3. Setup Supabase Local (Docker)

```bash
# Iniciar containers
npm run docker:up

# Ver logs
npm run docker:logs

# Parar containers
npm run docker:down

# Reset completo (apaga dados)
npm run docker:reset
```

### 4. Executar Migrations

As migrations são executadas automaticamente quando o container do banco inicia.

Para executar manualmente:

```bash
# Se tiver Supabase CLI instalado
supabase migration up
```

### 5. Iniciar Desenvolvimento

```bash
npm run dev
```

Acesse: `http://localhost:3000`

## 🔐 Configurar Autenticação

### Criar Usuário Admin no Supabase

1. Acesse o Supabase Studio: `http://localhost:54323`
2. Vá em Authentication > Users
3. Clique em "Add User"
4. Crie um usuário com email e senha
5. Use essas credenciais para fazer login no admin

**Nota**: Em produção, configure autenticação adequada no Supabase Dashboard.

## 📦 Estrutura de Pastas

```py
carolbrito/
├── public/              # Assets públicos (servidos diretamente)
│   └── assets/         # Imagens, logos, etc
├── src/
│   ├── components/     # Componentes reutilizáveis
│   ├── lib/            # Bibliotecas (Supabase client, utils)
│   ├── services/       # Camada de serviços (business logic)
│   ├── pages/          # Páginas HTML
│   └── styles/         # CSS (tokens, base, components, layouts)
├── supabase/
│   └── migrations/     # SQL migrations
├── docker/             # Dockerfiles
├── tests/              # Testes
└── vercel.json         # Config Vercel
```

## 🧪 Testes

```bash
# Executar testes unitários
npm test

# Executar testes em modo watch
npm test -- --watch
```

## 🚢 Deploy

### Vercel

1. Conecte seu repositório GitHub ao Vercel
2. Configure variáveis de ambiente no dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Deploy automático a cada push

### Supabase Cloud

1. Crie projeto em [supabase.com](https://supabase.com)
2. Execute migrations:

```sql
   -- Copie e execute cada migration em ordem
```

3. Configure Storage:
   - Crie bucket `project-images`
   - Configure policies públicas

4. Configure Auth:
   - Habilite email/password
   - Configure redirect URLs

## 🐛 Troubleshooting

### Erro: "Missing Supabase environment variables"

- Verifique se o arquivo `.env` existe
- Verifique se as variáveis estão corretas
- Reinicie o servidor de desenvolvimento

### Erro: "Cannot connect to Supabase"

- Verifique se os containers Docker estão rodando: `docker ps`
- Verifique as portas: 54322 (DB), 54323 (Studio)
- **Nota**: Este projeto usa setup híbrido - Storage e Auth estão no Supabase Cloud, apenas o DB é local
- Tente resetar: `npm run docker:reset`

### Erro: "Permission denied" no banco

- Verifique as policies RLS no Supabase
- Certifique-se de estar autenticado para operações que requerem auth

### Erro: "Bucket 'project-images' não existe"

Este erro ocorre quando o bucket de storage não foi criado no Supabase Cloud. Siga estes passos:

**Nota**: Este projeto usa Storage no Supabase Cloud (não local). O bucket deve ser criado no dashboard do Supabase.

#### Verificar se o bucket existe no Supabase Cloud

1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. Selecione seu projeto
3. Vá em **Storage** > **Buckets**
4. Verifique se o bucket `project-images` está listado

#### Criar o bucket no Supabase Cloud (se não existir)

1. No Supabase Dashboard, vá em **Storage** > **Buckets**
2. Clique em **New bucket**
3. Configure:
   - **Name**: `project-images`
   - **Public bucket**: ✅ Sim
   - **File size limit**: `52428800` (50MB)
   - **Allowed MIME types**: `image/jpeg, image/png, image/webp, image/gif`
4. Clique em **Create bucket**

#### Verificar variáveis de ambiente

Certifique-se de que seu arquivo `.env` está configurado com as credenciais do Supabase Cloud:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon
```

#### Verificar se as migrações foram executadas

```bash
# Verificar logs do container do banco
docker logs carolbrito-db

# Resetar e executar todas as migrações novamente
npm run docker:reset
```


#### Criar o bucket via SQL (alternativa)

Se preferir criar via SQL, execute no Supabase Studio (SQL Editor):

```sql
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'project-images', 
    'project-images', 
    true,
    52428800,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE 
SET public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;
```

### Imagens não aparecem

- Verifique se o bucket `project-images` existe (veja seção acima)
- Verifique as policies do storage no Supabase Studio
- Verifique se as URLs das imagens estão corretas
- Verifique os logs do navegador para erros de CORS ou permissão

## 📚 Próximos Passos

1. ✅ Setup completo
2. ✅ Migrations executadas
3. ✅ Usuário admin criado
4. ⏭️ Criar primeiro projeto via admin
5. ⏭️ Personalizar conteúdo
6. ⏭️ Deploy em produção

