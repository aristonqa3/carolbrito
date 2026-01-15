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
- Verifique as portas: 54321 (API), 54322 (DB), 54323 (Studio)
- Tente resetar: `npm run docker:reset`

### Erro: "Permission denied" no banco

- Verifique as policies RLS no Supabase
- Certifique-se de estar autenticado para operações que requerem auth

### Imagens não aparecem

- Verifique se o bucket `project-images` existe
- Verifique as policies do storage
- Verifique se as URLs das imagens estão corretas

## 📚 Próximos Passos

1. ✅ Setup completo
2. ✅ Migrations executadas
3. ✅ Usuário admin criado
4. ⏭️ Criar primeiro projeto via admin
5. ⏭️ Personalizar conteúdo
6. ⏭️ Deploy em produção
