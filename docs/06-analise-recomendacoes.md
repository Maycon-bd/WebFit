# Análise geral e recomendações

## Diagnóstico

O projeto tem uma boa base para continuar: domínio reconhecível, interface abrangente, TypeScript estrito, schema multi-clínica, RLS, auditoria e pipeline local de qualidade funcionando. A fraqueza central é a diferença entre **amplitude visual** e **profundidade operacional**. Muitos recursos parecem concluídos na tela, mas ainda são estados locais ou simulações.

A prioridade não deve ser acrescentar mais telas. Deve ser tornar poucos fluxos críticos íntegros, seguros, observáveis e realmente persistentes.

## Pontos fortes

1. **Visão de produto rica**: os principais momentos da rotina do nutricionista já estão representados.
2. **Núcleo remoto funcional**: autenticação, clínica, pacientes e agenda formam um primeiro caminho real.
3. **Fundação de segurança acima da média de um protótipo**: RLS, grants explícitos, bucket privado, soft delete e auditoria foram considerados cedo.
4. **Multi-tenancy explícita**: `clinic_id` aparece no modelo desde o início.
5. **Tipagem consistente**: TypeScript strict e tipos gerados do banco reduzem erros de integração.
6. **Dependências enxutas**: React, Supabase e ferramentas de qualidade; baixa complexidade de framework.
7. **Design próprio**: temas, tokens e identidade visual sem forte dependência externa.
8. **Baseline de qualidade verde**: typecheck, lint, testes e build passam.
9. **Regras por módulo**: os arquivos `rules.md` dão um ponto de partida para alinhar negócio e código.
10. **Migrações versionadas**: o schema é reproduzível e não depende só de configuração manual.

## Pontos fracos

### Produto e escopo

- Muitos módulos são demonstrativos, criando risco de expectativa incorreta.
- Não há definição clara do MVP comercial nem métricas de sucesso.
- Plano Pro/Black é controlado localmente, não por entitlement confiável.
- Regras importantes permanecem implícitas: papéis, retenção, cobrança, publicação de prescrição e portal do paciente.

### Arquitetura

- `AppContext` e `PatientProfile` acumulam responsabilidades.
- Dados remotos e locais usam modelos diferentes e operações híbridas.
- Não há roteamento, cache de servidor, paginação ou transações compostas.
- O schema não garante integridade cruzada do tenant em todas as relações.

### Segurança e conformidade

- Dados sensíveis no `localStorage`.
- Papéis do banco sem diferenciação real de autorização.
- Ausência de testes reais de RLS.
- Configuração de Auth ainda é de desenvolvimento.
- LGPD, incidentes, retenção e restauração não estão operacionalizados.

### Qualidade e operação

- Sem CI/CD, staging, E2E ou observabilidade.
- Testes de schema são textuais, não executam SQL.
- Sem auditoria de dependências concluída no ambiente analisado.
- `node_modules` e `dist` rastreados pelo Git.
- Documentação legada contradiz a implementação atual.

### Experiência

- Uso frequente de `alert`/`prompt` e sucessos simulados.
- Filtros visuais que não funcionam.
- Sem URLs por módulo/paciente.
- Acessibilidade e responsividade não têm validação automatizada.
- Possível problema de codificação UTF-8 em textos.

## Recomendações priorizadas

### P0 — Fazer antes de usar dados reais

| Recomendação | Por quê | Resultado esperado |
|---|---|---|
| Corrigir integridade multi-tenant com FKs compostas | impede relações cruzadas entre clínicas | banco rejeita qualquer referência cross-tenant |
| Migrar dados clínicos/financeiros do `localStorage` | reduz exposição e inconsistência | backend vira fonte única de verdade |
| Criar suíte de testes RLS real | políticas textualmente presentes podem falhar em execução | isolamento comprovado com usuários/tenants distintos |
| Definir LGPD e retenção | dados de saúde exigem governança | política aprovada e fluxos de titular/incidente |
| Definir papéis e reescrever políticas | assistant hoje pode ter poder excessivo | menor privilégio verificável |
| Limpar Git de dependências/builds | reduz risco de supply chain e ruído | clone leve e instalação reproduzível |

### P1 — Consolidar o MVP

| Recomendação | Entrega |
|---|---|
| Escolher MVP: pacientes + agenda + prontuário/antropometria + prescrição básica | escopo comercial coerente |
| Dividir `AppContext` por domínio e adotar cache de servidor | estado previsível e menor acoplamento |
| Migrar planner, prescrições, antropometria e financeiro | dashboard consistente |
| Criar transação para retorno/cobrança | evita meia-operação |
| Implementar roteamento | deep links, histórico e lazy loading |
| Substituir alerts e falsas confirmações | UX honesta e acessível |
| Criar CI, staging e Playwright | entrega repetível |
| Configurar Auth de produção | contas e recuperação seguras |
| Configurar logs/erros/alertas sem PII | suporte operacional |

### P2 — Comunicação e arquivos

- criar domínio de diário alimentar em tabela própria;
- integrar Storage privado e signed URLs;
- persistir chat/notificações e consumir Realtime;
- criar pré-consulta com links/token, respostas e consentimento;
- gerar PDFs reais e versionados;
- implementar templates e automações via fila, com idempotência;
- integrar e-mail/WhatsApp somente via Edge Function e provedor aprovado.

### P3 — Expansão de produto

- teleconsulta;
- wearables/MoveHealth;
- site público e mailing;
- estúdio de conteúdo;
- cursos/biblioteca;
- pagamentos e conciliação avançada;
- IA para apoio, somente com escopo clínico, revisão humana, explicabilidade e governança.

## O que não recomendo agora

- Microserviços: aumentariam custo operacional sem resolver a lacuna atual.
- Redux global para dados remotos: um cache de servidor por domínio atende melhor.
- GraphQL só por preferência técnica: a Data API existente é suficiente para o MVP.
- IA antes de dados, consentimento e fluxos confiáveis: ampliaria risco clínico e de privacidade.
- WebRTC próprio como primeira versão de teleconsulta: um provedor gerenciado reduz complexidade.
- Criptografar indiscriminadamente todas as colunas: pode inviabilizar busca e não substitui menor privilégio, minimização e RLS.

## Decisões que precisam de stakeholders

| Decisão | Donos sugeridos | Prazo |
|---|---|---|
| Escopo exato do MVP e módulos ocultos | Produto + clínica | antes do próximo ciclo |
| Matriz owner/nutritionist/assistant | Produto + segurança + operação | antes de convidar equipes |
| Política de prontuário, retenção e exclusão | Jurídico/DPO + clínica | antes de dados reais |
| Evento que reconhece receita | Financeiro + produto | antes de migrar financeiro |
| Portal/app do paciente | Produto + arquitetura | antes de diário/pré-consulta |
| Provedor de mensagens, vídeo e pagamento | Negócio + segurança + engenharia | antes de integração |
| Requisitos de disponibilidade/RPO/RTO | Negócio + engenharia | antes do piloto |

## Indicadores recomendados

### Produto

- tempo até cadastrar primeiro paciente;
- tempo para agendar consulta;
- percentual de profissionais que concluem o fluxo clínico principal;
- retenção semanal de clínicas ativas;
- falhas/abandono por etapa;
- satisfação do profissional após atendimento.

### Engenharia

- frequência de deploy e lead time;
- taxa de falha de mudança e tempo de recuperação;
- erros por 1.000 operações críticas;
- p95 de listagem/salvamento;
- percentual de fluxos críticos E2E;
- findings de segurança abertos por severidade;
- sucesso de restauração e idade do último teste.

Nunca usar dados clínicos como propriedade de analytics. Eventos devem carregar identificadores pseudonimizados e o mínimo de contexto.

## Resultado esperado após as prioridades P0/P1

O WebFit passa de protótipo híbrido para um MVP confiável quando profissionais conseguem autenticar, operar uma clínica, cadastrar/acompanhar paciente, registrar avaliação/prescrição, agendar e consultar dados em outro dispositivo, com isolamento por clínica, auditoria, testes E2E, backup e suporte operacional comprovados.
