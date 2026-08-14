# Manifesto de importação do WebFit Web

## Regra central

Importar conhecimento funcional validado, não copiar o projeto antigo.

## Fontes prioritárias para curadoria

No repositório WebFit Web original:

1. `docs/doc_stakeholder.md` — decisões e solicitações do stakeholder.
2. `docs/04-modulos-fluxos.md` — fluxos e perguntas de negócio.
3. `docs/02_Guia_Consultorio.md` — comportamentos candidatos do consultório.
4. `docs/03_Dashboard_Painel_Controle.md` — informações candidatas do dashboard.
5. `docs/05_Guia_Rapido.md` — jornada inicial candidata.
6. `src/modules/*/rules.md` — regras candidatas por domínio.
7. `backlog-webfit.md` — solicitações de UI ainda não validadas.
8. `src/types/index.ts` — entidades e campos candidatos.

## Fontes secundárias

- `docs/01_Visao_Geral.md` para público, navegação e glossário.
- `docs/01-estado-atual.md` apenas para identificar capacidades existentes.
- `docs/03-dados-seguranca.md` apenas para identificar necessidades de segurança, auditoria, retenção e recuperação.
- `docs/06-analise-recomendacoes.md` apenas para dúvidas de produto e riscos ainda pertinentes.

## Não importar

- `docs/02-arquitetura.md`;
- roadmap técnico web;
- auditoria de qualidade do repositório antigo;
- comandos e configuração Supabase;
- schema PostgreSQL como schema SQLite;
- `AuthContext`, `WorkspaceContext` e repositórios Supabase;
- `localStorage` como estratégia de persistência;
- artefatos de build, dependências instaladas e segredos;
- status “implementado” da aplicação antiga;
- dados fictícios como dados do usuário.

## Transformação obrigatória

| Texto de origem | Tratamento |
|---|---|
| “salva no localStorage” | descartar implementação; identificar dado e comportamento |
| “usa Supabase” | descartar implementação; identificar persistência/autorização necessária |
| “recurso Black/Pro” | marcar como decisão comercial não aprovada |
| “simula envio” | não considerar funcionalidade entregue; registrar necessidade candidata |
| “remove o registro” | validar arquivamento, retenção e possibilidade de restauração |
| “gera cobrança paga” | validar regra financeira e estado inicial |
| “chat em tempo real” | adiar por depender de acesso remoto |

## Formato de saída de cada item extraído

```text
Fonte:
Trecho ou resumo:
Domínio:
Necessidade do usuário:
Regra candidata:
Detalhe técnico removido:
Conflito/dúvida:
Status: proposto
```

Depois de validado, o item recebe ID de requisito/regra e critérios de aceite. Antes disso ele não entra em implementação.

## Preservação

- O repositório WebFit Web permanece intacto e legível.
- Arquivos originais não precisam ser copiados para o repositório Desktop.
- A rastreabilidade pode registrar caminho, commit/tag e seção de origem.
- Nenhuma instância ou dado Supabase é apagado durante a curadoria.
- Migração de dados é uma atividade separada da migração documental.
