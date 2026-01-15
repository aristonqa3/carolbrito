# Portfólio Ana Karoline - Arquitetura & Interiores

Portfólio profissional desenvolvido com arquitetura moderna usando Supabase, Vercel e Docker.

## 🚀 Tecnologias

- **Frontend**: Vite, JavaScript ES6+, CSS Modules
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Deploy**: Vercel
- **Desenvolvimento Local**: Docker Compose
- **Testes**: Vitest

## 📁 Estrutura do Projeto

```
carolbrito/
├── public/              # Assets estáticos
├── src/
│   ├── components/      # Componentes reutilizáveis
│   ├── lib/            # Bibliotecas (Supabase, utils)
│   ├── services/       # Camada de serviços
│   ├── pages/          # Páginas HTML
│   └── styles/         # Estilos (tokens, base, components)
├── supabase/
│   └── migrations/     # Migrations SQL
├── docker/             # Configuração Docker
├── tests/              # Testes
└── vercel.json         # Config Vercel
```

## 🛠️ Instalação

### Pré-requisitos

- Node.js 18+
- Docker e Docker Compose
- Conta no Supabase (para produção)

### Setup Local

1. **Clone o repositório**
```bash
git clone <repo-url>
cd carolbrito
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure variáveis de ambiente**
```bash
cp .env.example .env
# Edite .env com suas credenciais do Supabase
```

4. **Inicie Supabase local com Docker**
```bash
npm run docker:up
```

5. **Execute migrations**
```bash
# As migrations serão executadas automaticamente pelo Docker
# Ou manualmente:
supabase migration up
```

6. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

O site estará disponível em `http://localhost:3000`

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run preview` - Preview do build
- `npm run docker:up` - Inicia containers Docker
- `npm run docker:down` - Para containers Docker
- `npm run docker:reset` - Reseta containers e volumes
- `npm test` - Executa testes unitários

## 🔐 Autenticação Admin

Para acessar o painel administrativo:

1. Acesse `/admin/login.html`
2. Use as credenciais configuradas no Supabase Auth
3. Crie um usuário via Supabase Dashboard ou API

**Nota**: Em produção, configure autenticação adequada no Supabase.

## 🗄️ Banco de Dados

O projeto usa Supabase PostgreSQL com as seguintes tabelas:

- `projects` - Projetos do portfólio
- `project_images` - Imagens dos projetos
- `profiles` - Perfis de usuários

Migrations estão em `supabase/migrations/`

## 🚢 Deploy

### Vercel

1. Conecte seu repositório ao Vercel
2. Configure variáveis de ambiente:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Deploy automático a cada push

### Supabase Cloud

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Execute as migrations no projeto
3. Configure storage bucket `project-images`
4. Configure autenticação

## 📖 Documentação

- [Supabase Docs](https://supabase.com/docs)
- [Vite Docs](https://vitejs.dev)
- [Vercel Docs](https://vercel.com/docs)

## 📄 Licença

MIT

## 👤 Autor

Ana Karoline de Brito Pacheco
