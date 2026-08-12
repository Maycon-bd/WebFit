# WebFit

WebFit é uma aplicação web para gestão de clínicas e acompanhamento nutricional. O projeto combina uma interface React com autenticação, multi-clínica e persistência clínica inicial no Supabase.

> Estado real em 12/08/2026: autenticação, criação/seleção de clínica, pacientes e agendamentos usam Supabase. Os demais módulos ainda são locais, demonstrativos ou parcialmente implementados. Consulte a [documentação técnica](docs/README.md) antes de planejar novas entregas.

## Início rápido

Requisitos: Node.js 22+, npm e, para o ambiente Supabase local, Docker.

```bash
npm install
Copy-Item .env.example .env.local
npm run dev
```

Preencha em `.env.local`:

```dotenv
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_sua_chave
```

Use somente uma chave publicável no frontend. Nunca coloque `service_role`, secret key ou credenciais administrativas em variáveis `VITE_*`.

Sem as variáveis do Supabase, a interface abre em modo de demonstração sem autenticação e sem persistência clínica remota.

## Comandos

```bash
npm run dev        # servidor local em http://localhost:3000
npm run typecheck  # TypeScript
npm run lint       # ESLint
npm test           # Vitest
npm run build      # bundle de produção
npm run preview    # serve o bundle localmente
```

No PowerShell com política de execução restrita, use `npm.cmd` no lugar de `npm`.

## Supabase local

```bash
npx supabase start
npx supabase db reset
npx supabase migration list --local
```

O schema está em `supabase/migrations/`. Não aplique migrações em produção sem validar RLS, advisors, backup e rollback.

## Documentação

- [Índice e mapa de leitura](docs/README.md)
- [Estado atual e inventário funcional](docs/01-estado-atual.md)
- [Arquitetura atual e arquitetura-alvo](docs/02-arquitetura.md)
- [Dados, segurança e privacidade](docs/03-dados-seguranca.md)
- [Módulos e fluxos de negócio](docs/04-modulos-fluxos.md)
- [Qualidade, operação e desenvolvimento](docs/05-qualidade-operacao.md)
- [Análise geral e recomendações](docs/06-analise-recomendacoes.md)
- [Roadmap priorizado](docs/07-roadmap.md)
- [Decisões, convenções e manutenção da documentação](docs/08-decisoes-convencoes.md)

## Estrutura principal

```text
src/
├── components/        # autenticação, setup e componentes globais
├── context/           # sessão, clínica ativa e estado da aplicação
├── lib/               # cliente Supabase
├── modules/           # módulos funcionais da interface
├── services/          # persistência local e repositórios Supabase
├── styles/            # design tokens e CSS global/específico
├── types/             # domínio e tipos gerados do banco
└── utils/             # utilitários testados
supabase/
├── config.toml        # ambiente local
└── migrations/        # schema, RLS, auditoria e índices
docs/                  # documentação funcional e técnica
```

## Situação da qualidade

Na análise de 12/08/2026, `typecheck`, `lint`, 24 testes e `build` passaram. Isso confirma a saúde básica do código, mas não substitui testes de integração com Supabase, testes E2E, acessibilidade, carga, recuperação de backup e segurança.

## Avisos importantes

- Dados sensíveis ainda são persistidos em `localStorage` em vários módulos. Isso não é adequado para produção clínica.
- O repositório atualmente rastreia `node_modules/` e `dist/`, apesar de `node_modules/` estar no `.gitignore`. Corrigir o histórico/índice Git é uma prioridade de higiene do projeto.
- Os documentos antigos `docs/00_Indice.md` a `docs/05_Guia_Rapido.md` descrevem a referência WebDiet e podem divergir do WebFit implementado. Eles são material de referência, não a fonte canônica do estado atual.
