# Prompt 01 — Executar Ciclo 0 e curar requisitos

Execute somente depois do Prompt 00.

---

Execute o Ciclo 0 do WebFit Desktop conforme `docs/project/development-lifecycle.md`.

Use `docs/project/functional-candidates.md` como fonte funcional primária e `docs/project/legacy-import-manifest.md` como regra de curadoria. Consulte o repositório WebFit Web original apenas quando precisar conferir uma origem ou resolver uma ambiguidade; não copie a implementação técnica antiga.

Objetivos:

1. extrair visão, público, glossário, jornadas, funcionalidades e regras candidatas;
2. remover referências a Supabase, PostgreSQL, RLS, Storage, Realtime, `localStorage`, APIs e estado da implementação web;
3. marcar tudo inicialmente como `proposto`, mantendo fonte e seção de origem;
4. identificar duplicidades, contradições e comportamentos simulados;
5. criar um registro de decisões que eu preciso responder;
6. propor MVP e não escopo sem aprová-los em meu nome;
7. criar requisitos com IDs somente para itens suficientemente claros;
8. criar critérios de aceite verificáveis, sem inventar regra clínica ou financeira;
9. atualizar a matriz de rastreabilidade;
10. entregar um relatório do Gate G1 e do que falta para G2.

Não crie código. Não transforme telas antigas automaticamente em requisitos. Não trate “existe no WebFit Web” como aprovação.

---
