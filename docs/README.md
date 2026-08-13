# Documentação técnica e funcional do WebFit

Esta pasta é a fonte canônica para entender o que o projeto pretende ser, o que está implementado, quais riscos existem e qual sequência de evolução é recomendada.

## Base da análise

- Data do levantamento: **12/08/2026**.
- Commit analisado: `7d9dba5` (`inclusão do backend`).
- Evidências: código em `src/`, migrações em `supabase/migrations/`, testes, configurações e documentos existentes.
- Validações executadas: TypeScript, ESLint, 24 testes Vitest e build de produção, todos aprovados.
- Limitação: não houve acesso a uma instância Supabase remota nem execução do stack local com Docker. Migrações e políticas foram revisadas estaticamente; precisam de testes reais de autorização.

## Como ler

| Documento | Responde a |
|---|---|
| [01 — Estado atual](01-estado-atual.md) | O que existe, o que funciona e o que é simulação? |
| [02 — Arquitetura](02-arquitetura.md) | Como o sistema está estruturado e qual arquitetura é recomendada? |
| [03 — Dados e segurança](03-dados-seguranca.md) | Como é o banco, quais controles existem e quais riscos precisam de ação? |
| [04 — Módulos e fluxos](04-modulos-fluxos.md) | Quais regras e fluxos cada módulo implementa? |
| [05 — Qualidade e operação](05-qualidade-operacao.md) | Como desenvolver, testar, publicar e operar? |
| [06 — Análise e recomendações](06-analise-recomendacoes.md) | Quais são os pontos fortes, fracos e melhorias recomendadas? |
| [07 — Roadmap](07-roadmap.md) | O que fazer primeiro e quais critérios definem conclusão? |
| [08 — Decisões e convenções](08-decisoes-convencoes.md) | Como manter consistência técnica e documental? |
| [09 — Auditoria de qualidade](09-auditoria-qualidade.md) | Quais gates foram adicionados e quais riscos ainda permanecem? |

## Legenda de maturidade

Todos os documentos usam a mesma classificação:

- **Operacional remoto**: interface conectada ao Supabase por repositório e protegida por autenticação/RLS.
- **Operacional local**: funciona no navegador e persiste somente em `localStorage`.
- **Parcial**: parte do fluxo funciona, mas há trechos locais, ausentes ou sem integração.
- **Simulado**: demonstra comportamento visual com estado efêmero, `alert` ou conteúdo estático.
- **Planejado**: há schema, regra ou intenção, mas não há fluxo utilizável de ponta a ponta.

## Documentos legados

Os arquivos `00_Indice.md`, `01_Visao_Geral.md`, guias `02_*`, `03_*`, `04_*`, `05_*` e `doc_stakeholder.md` foram produzidos a partir de telas/referências do WebDiet. Eles ajudam na descoberta de produto, mas contêm:

- nome de produto diferente (`WebDiet` em vez de `WebFit`);
- links absolutos antigos;
- afirmações de nuvem/funcionalidades que não correspondem ao código atual;
- imagens apontando para uma pasta que não existe dentro de `docs/`.

Até que sejam reescritos como manuais do usuário do WebFit, trate-os como **referência de produto**, não como documentação de entrega.

## Regra de atualização

Toda entrega que mudar comportamento, schema, variável de ambiente, integração ou operação deve atualizar, no mesmo pull request:

1. a matriz de estado em `01-estado-atual.md`;
2. o diagrama ou fluxo afetado;
3. o roadmap, se um item mudar de status;
4. o `rules.md` do módulo, quando a regra de negócio mudar;
5. testes e instruções operacionais correspondentes.
