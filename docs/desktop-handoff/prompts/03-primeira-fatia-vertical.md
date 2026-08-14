# Prompt 03 — Primeira fatia vertical

Execute somente depois do spike aprovado.

---

Implemente a primeira fatia vertical aprovada do WebFit Desktop, seguindo `AGENTS.md`, requisitos, critérios de aceite, modelo de dados e ADRs vigentes.

A fatia recomendada é:

```text
primeiro administrador -> login local -> cadastrar clínica
-> cadastrar/listar/editar/arquivar paciente -> auditar ações
-> criar backup -> restaurar em instalação de teste
```

Antes de editar, confirme que cada comportamento possui requisito aprovado e teste de aceite relacionado. Se algo não estiver aprovado, pare somente esse item, registre a lacuna e continue nas partes independentes.

Regras de execução:

1. importe do WebFit Web apenas componentes visuais necessários para esta fatia;
2. remova dependências de Supabase e `localStorage` durante a importação;
3. mantenha domínio, persistência e autorização no backend Tauri;
4. use comandos tipados, consultas parametrizadas e transações;
5. implemente estados de loading, vazio, erro e confirmação real;
6. adicione migrações e testes de atualização;
7. cubra critérios de aceite com testes apropriados;
8. atualize rastreabilidade e documentação na mesma entrega;
9. execute todos os gates de qualidade disponíveis;
10. não implemente módulos fora da fatia.

Entregue um relatório com requisitos atendidos, testes, migrações, riscos, pendências e evidência para o Gate G5.

---
