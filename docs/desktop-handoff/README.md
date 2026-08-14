# Kit de handoff — WebFit Desktop

Este diretório é o pacote portátil para iniciar o novo repositório **WebFit Desktop** sem carregar a arquitetura abandonada do WebFit Web.

> A pasta final já consolidada e autocontida para copiar está em [`WEBFIT-DESKTOP-STARTER`](../../WEBFIT-DESKTOP-STARTER/README.md). Prefira copiar o conteúdo dela em vez de montar os destinos manualmente.

## O que copiar para o novo repositório

| Origem neste kit | Destino recomendado | Finalidade |
|---|---|---|
| `AGENTS.template.md` | `AGENTS.md` | regras permanentes para agentes e desenvolvimento |
| `00-contexto-e-decisoes.md` | `docs/project/context.md` | contexto mínimo e decisões vigentes |
| `01-manifesto-importacao.md` | `docs/project/legacy-import-manifest.md` | fontes permitidas e proibidas |
| `../10-plano-migracao-webfit-desktop.md` | `docs/project/legacy-migration.md` | transição, dados e fases |
| `../11-curadoria-documental-e-ciclo-desenvolvimento-desktop.md` | `docs/project/development-lifecycle.md` | curadoria, SDLC, gates e rastreabilidade |
| `prompts/` | `docs/prompts/` | prompts operacionais, executados em ordem |

Copie os arquivos, não os links absolutos. Depois ajuste os links relativos dentro dos documentos do novo repositório.

## O que não copiar inicialmente

- `src/` inteiro;
- `components/` inteiro;
- `supabase/`;
- `node_modules/`;
- `dist/`;
- `.env` ou qualquer segredo;
- documentação técnica da arquitetura web;
- dados reais de Supabase ou `localStorage`;
- imagens e prints sem uma necessidade de UX identificada.

O código visual será importado seletivamente somente depois da baseline de requisitos e do spike técnico.

## Ordem de execução

1. Criar pasta e repositório Git vazio.
2. Copiar este kit conforme a tabela.
3. Renomear `AGENTS.template.md` para `AGENTS.md` na raiz.
4. Executar `prompts/00-iniciar-repositorio.md`.
5. Executar `prompts/01-curar-requisitos.md`.
6. Resolver e aprovar as decisões produzidas no Gate G1/G2.
7. Executar `prompts/02-spike-tauri-sqlite.md`.
8. Executar `prompts/03-primeira-fatia-vertical.md`.
9. Importar componentes visuais apenas quando requisitados pela fatia em andamento.

Não execute todos os prompts em uma única solicitação. Revise o resultado e confirme o gate entre eles.

## Pré-requisitos de desenvolvimento no Windows

Antes do spike Tauri, preparar:

- Node.js LTS;
- Rust estável com toolchain MSVC;
- Microsoft C++ Build Tools com “Desktop development with C++”;
- Microsoft Edge WebView2, normalmente já presente no Windows 10/11;
- Git.

Referências oficiais:

- <https://v2.tauri.app/start/prerequisites/>
- <https://v2.tauri.app/start/create-project/>

## Comando inicial recomendado

Executar somente no momento do prompt de spike, dentro da pasta onde o novo projeto será criado:

```powershell
npm create tauri-app@latest
```

Seleções recomendadas:

```text
Project name: webfit-desktop
Identifier: br.com.webfit.desktop
Frontend language: TypeScript / JavaScript
Package manager: npm
UI template: React
UI flavor: TypeScript
```

Depois:

```powershell
Set-Location webfit-desktop
npm install
npm run tauri dev
```

O comando oficial cria o shell. Ele não aprova arquitetura, não instala automaticamente a estratégia final de SQLite/SQLCipher e não autoriza importar a interface antiga.

## Gate antes de copiar código visual

Só importar componentes quando existirem:

- visão e escopo aprovados;
- requisito com ID e critérios de aceite;
- jornada do fluxo;
- contrato frontend/backend;
- modelo de dados necessário;
- teste planejado;
- resultado aprovado do spike Tauri/SQLite/backup.

## Resultado esperado deste kit

O novo repositório começa pequeno, documentado e rastreável. O WebFit Web permanece intacto como origem histórica, e cada ativo visual é levado apenas quando provar utilidade para um requisito aprovado.
