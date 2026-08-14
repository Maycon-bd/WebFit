# WebFit Desktop — pacote inicial

Esta pasta é autocontida. Copie **todo o conteúdo dela** para a raiz do novo repositório WebFit Desktop.

Depois da cópia, a raiz deve ficar assim:

```text
WebFit-Desktop/
├── AGENTS.md
├── README.md
└── docs/
    ├── project/
    │   ├── context.md
    │   ├── development-lifecycle.md
    │   ├── functional-candidates.md
    │   ├── legacy-import-manifest.md
    │   └── legacy-migration.md
    └── prompts/
        ├── 00-iniciar-repositorio.md
        ├── 01-curar-requisitos.md
        ├── 02-spike-tauri-sqlite.md
        └── 03-primeira-fatia-vertical.md
```

## Como começar

1. Crie a pasta do novo projeto e inicialize o Git.
2. Copie o conteúdo desta pasta para a raiz dele.
3. Abra o novo repositório no Codex.
4. Envie o conteúdo de `docs/prompts/00-iniciar-repositorio.md`.
5. Revise o resultado e aprove o Gate G1 antes do prompt seguinte.
6. Execute os prompts em ordem; não envie todos de uma vez.

## Ordem dos prompts

| Ordem | Arquivo | Resultado |
|---|---|---|
| 00 | `docs/prompts/00-iniciar-repositorio.md` | estrutura documental, riscos e ADR inicial |
| 01 | `docs/prompts/01-curar-requisitos.md` | visão, requisitos candidatos, conflitos e gates G1/G2 |
| 02 | `docs/prompts/02-spike-tauri-sqlite.md` | prova de Tauri, SQLite, segurança, backup e instalador |
| 03 | `docs/prompts/03-primeira-fatia-vertical.md` | primeiro fluxo funcional ponta a ponta |

## Importante

- Não copie agora o `src/`, `components/`, `supabase/`, `node_modules/` ou `dist/` do WebFit Web.
- Não copie `.env`, chaves ou dados reais.
- Mantenha o repositório WebFit Web disponível como fonte histórica para o Prompt 01.
- O catálogo `docs/project/functional-candidates.md` permite executar a primeira curadoria sem copiar os documentos mistos da versão web.
- O novo repositório começa pela engenharia de requisitos, não pela importação das telas.
- O código visual antigo será levado seletivamente quando houver requisito aprovado para ele.

## Pré-requisitos técnicos posteriores

O Prompt 02 verificará e instalará a fundação Tauri. No Windows serão necessários Node.js LTS, Rust com toolchain MSVC, Microsoft C++ Build Tools e WebView2.

Até o Prompt 02, não é necessário executar `npm create tauri-app@latest`.
