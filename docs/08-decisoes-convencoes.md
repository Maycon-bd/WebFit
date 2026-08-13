# Decisões, convenções e manutenção

## Decisões vigentes observadas

| Tema | Decisão atual | Estado |
|---|---|---|
| Frontend | SPA React + TypeScript + Vite | vigente |
| Estilos | CSS próprio com tokens e temas | vigente |
| Backend | Supabase Auth/Data API/Postgres | vigente para o núcleo |
| Multi-tenancy | `clinic_id` + `clinic_members` + RLS | vigente, precisa endurecimento |
| Exclusão | soft delete no browser; hard delete administrativo | vigente |
| Auditoria | triggers no banco | vigente, pendente teste real |
| Arquivos clínicos | bucket privado `clinical-files` | planejado |
| Tempo | timezone padrão `America/Sao_Paulo` | definido no banco, incompleto no cliente |
| Estado local | `localStorage` para múltiplos domínios | legado a reduzir |
| Testes | Vitest + Testing Library | vigente |

## ADRs recomendados

Criar `docs/adr/NNNN-titulo.md` para decisões que mudem arquitetura, segurança ou operação. Primeiros ADRs:

1. Supabase como backend transacional do MVP.
2. Estratégia de multi-tenancy e FKs compostas.
3. Matriz de papéis e autorização.
4. Limite de uso do `localStorage`.
5. Estratégia de roteamento e cache de servidor.
6. Modelo de prescrição e versionamento.
7. Portal/autenticação do paciente.
8. Retenção, soft delete e hard delete.
9. Provedor de mensagens, vídeo e pagamentos.
10. Observabilidade sem dados sensíveis.

### Template de ADR

```markdown
# NNNN — Título

- Status: proposta | aceita | substituída | rejeitada
- Data: AAAA-MM-DD
- Responsáveis: nomes/papéis

## Contexto
Problema, restrições e evidências.

## Decisão
O que será feito e os limites.

## Alternativas consideradas
Opções e motivos da rejeição.

## Consequências
Benefícios, custos, riscos e plano de reversão.

## Verificação
Como comprovar que a decisão funciona.
```

## Convenções de código

### Domínio e persistência

- Componentes não chamam Supabase diretamente; usam hooks/repositórios do domínio.
- Mapeamento banco ↔ UI fica fora do componente.
- IDs remotos são UUID; não criar IDs de negócio com `Date.now()`.
- Datas trafegam em ISO 8601; formatação `pt-BR` ocorre somente na apresentação.
- Valores monetários persistem como `numeric`/centavos e são formatados no limite da UI.
- Toda query multi-tenant filtra `clinic_id`, mesmo quando RLS já protege.
- Toda relação multi-tenant deve ter constraint que impeça cruzamento de clínica.
- Toda lista potencialmente grande usa paginação.

### Estado

- Dados do servidor pertencem à camada de query/cache.
- Contexto React guarda sessão de UI pequena e estável.
- `localStorage` é permitido para tema e preferências não sensíveis, sempre com versão/migração.
- Estado efêmero não deve exibir confirmação de operação externa inexistente.

### Interface

- Componentes compartilhados devem ter estados loading, empty, error e disabled.
- Forms usam validação declarativa e mensagens junto ao campo.
- Ações destrutivas usam confirmação acessível e explicam reversibilidade.
- Evitar estilos inline novos; usar tokens/classes do design system.
- Toda página deve ser acessível por URL.
- Texto de ação descreve o que realmente acontece; simulações devem ser explicitamente marcadas como demo.

### Erros e logs

- Converter erros de infraestrutura em erros de domínio compreensíveis.
- Não expor detalhes internos do banco ao usuário.
- Não registrar tokens, CPF, prontuário, mensagens ou arquivos.
- Erros inesperados recebem correlation ID e contexto mínimo.

## Convenções SQL/Supabase

- Migrações são imutáveis após aplicadas; correções entram em nova migração.
- RLS em toda tabela exposta e grants mínimos explícitos.
- Políticas de `UPDATE` usam `USING` e `WITH CHECK`.
- Preferir `(select auth.uid())` nas políticas.
- Funções `SECURITY DEFINER` somente quando necessárias, em schema privado, com `search_path = ''`, checagem explícita e `EXECUTE` revogado por padrão.
- Views expostas usam `security_invoker = true` quando aplicável.
- Toda FK recebe índice quando o padrão de acesso/remoção justificar.
- Índices seguem queries medidas; evitar duplicar índice completo e parcial sem evidência.
- Operações compostas críticas usam função/RPC transacional e idempotente.
- Tipos TypeScript do banco são regenerados após migração.
- Rodar advisors e testes de autorização antes de promover schema.

## Convenções de Git

- Não versionar `node_modules`, `.env`, logs, coverage ou builds gerados.
- Versionar `package-lock.json`.
- Uma mudança de schema deve incluir migração, tipos, testes e documentação.
- Commits devem ser pequenos e descrever intenção.
- PR deve separar limpeza mecânica de mudança funcional sempre que possível.
- Não reescrever migração já promovida nem esconder falha de pipeline.

## Checklist de pull request

- [ ] Escopo e comportamento estão claros.
- [ ] Não há dados/segredos reais no diff.
- [ ] Typecheck, lint, testes e build passam.
- [ ] Testes negativos foram adicionados.
- [ ] RLS/grants/constraints foram revisados, se aplicável.
- [ ] Migração foi executada do zero.
- [ ] Tipos do banco foram atualizados.
- [ ] Acessibilidade e responsividade foram verificadas.
- [ ] Logs não contêm dados sensíveis.
- [ ] Rollback/compatibilidade foram considerados.
- [ ] `rules.md`, matriz de estado e roadmap foram atualizados.

## Manutenção da documentação

### Fonte de verdade

- Estado implementado: código + testes + migrações.
- Regras aprovadas: `rules.md` do domínio e ADRs.
- Planejamento: `07-roadmap.md` e sistema oficial de issues.
- Operação: runbooks versionados.
- Material legado/prints: referência de discovery, nunca prova de implementação.

### Revisão

- A cada PR: atualizar documentação afetada.
- A cada release: revisar matriz de maturidade e changelog.
- Mensalmente durante o MVP: revisar riscos P0/P1 e dependências.
- Trimestralmente em produção: revisar RLS, restore, dependências e incidentes.

### Changelog sugerido

Adotar `CHANGELOG.md` com seções “Adicionado”, “Alterado”, “Corrigido”, “Segurança” e “Removido”. Entradas devem falar do impacto para o usuário/operador, não apenas de arquivos modificados.

## Glossário

| Termo | Definição |
|---|---|
| Clínica/tenant | unidade que isola equipe e dados |
| Membership | vínculo de um usuário com uma clínica e papel |
| RLS | política do PostgreSQL que filtra/autoriza linhas |
| Chave publicável | chave segura para identificar o cliente quando RLS protege os dados |
| `service_role` | credencial privilegiada que ignora RLS; nunca vai ao browser |
| Soft delete | arquivamento lógico via `deleted_at` |
| Hard delete | remoção física, restrita à operação administrativa |
| Audit log | trilha imutável de ação, ator, entidade e momento |
| RPO | perda máxima de dados aceitável no tempo |
| RTO | tempo máximo aceitável para restaurar o serviço |
| Signed URL | URL temporária para acessar arquivo privado |
| Entitlement | permissão de produto/plano verificada por backend |
