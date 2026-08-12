# Estado atual e inventário funcional

## Resumo executivo

O WebFit está em uma fase de **MVP técnico híbrido**. A base visual e a cobertura funcional são amplas, enquanto a persistência de produção está concluída apenas para identidade, clínica, pacientes e agendamentos. O banco já antecipa prescrições, antropometria, financeiro, planner, chat, notificações, arquivos e auditoria, mas a maior parte desses recursos ainda não foi ligada à interface.

Não é correto classificar o sistema inteiro como pronto para produção clínica. Ele é utilizável para demonstrar fluxos e evoluir o núcleo clínico, mas ainda precisa remover dados clínicos do navegador, validar autorização real, implementar operação/monitoramento e atender requisitos de privacidade.

## Visão por camada

| Camada | Estado | Evidência |
|---|---|---|
| Interface | Ampla e navegável | React, dez páginas principais e perfil de paciente detalhado |
| Autenticação | Operacional remoto | Supabase Auth por e-mail/senha e restauração de sessão |
| Multi-clínica | Operacional remoto inicial | criação e seleção da primeira clínica do usuário |
| Pacientes | Operacional remoto | listar, criar, editar, arquivar e buscar |
| Agendamentos | Operacional remoto | listar, criar e cancelar |
| Demais domínios | Local, parcial ou simulado | estado React/`localStorage`, conteúdo estático e alerts |
| Banco | Schema avançado, integração parcial | 13 tabelas públicas, RLS, auditoria, soft delete e índices |
| Testes | Baseline saudável | 24 testes; faltam integração e E2E |
| CI/CD e observabilidade | Ausentes | sem workflow, plataforma de deploy ou telemetria configurada |

## Matriz de funcionalidades

| Módulo / capacidade | Maturidade | Persistência atual | Observação |
|---|---|---|---|
| Login e cadastro | Operacional remoto | Supabase Auth | confirmação de e-mail está desabilitada na configuração local |
| Sessão | Operacional remoto | Supabase Auth | listener acompanha alterações de autenticação |
| Perfil profissional | Parcial | estado + escrita local | nome/e-mail vêm da sessão; CRN, WhatsApp, avatar e plano não são salvos no banco |
| Criação de clínica | Operacional remoto | `clinics` | slug gerado no cliente; não há interface para múltiplas clínicas |
| Membros e papéis | Planejado | `clinic_members` | schema possui owner/nutritionist/assistant; UI não gerencia equipe e RLS não diferencia permissões por papel |
| Dashboard | Parcial | agrega remoto + local | pacientes/agendamentos remotos; receita, prescrições e planner locais |
| Pacientes | Operacional remoto | `patients` | filtros de período/login são visuais e não filtram de fato |
| Arquivamento de paciente | Operacional remoto | soft delete | banco arquiva dependências clínicas; financeiro é preservado |
| Perfil do paciente | Parcial | misto | dados cadastrais remotos; várias abas são locais/simuladas |
| Antropometria | Simulado | estado do componente | tabela existe no banco, repositório ainda não |
| Prescrições/cardápios | Operacional local | `localStorage` | tabela existe; conteúdo do cardápio ainda não é modelado na UI |
| Exames bioquímicos | Simulado | estado/valores estáticos | não há tabela nem upload/análise integrada |
| Pré-consulta | Simulado | temporizador + alerta | não envia e-mail/WhatsApp e não registra respostas |
| iMetas | Simulado | estado do componente | bloqueio de plano é apenas estado local |
| Diário alimentar | Parcial/simulado | notificações locais | fotos vêm de simulação; feedback alimenta chat local |
| Impressos/PDF | Simulado | nenhum arquivo | apenas mensagem de sucesso |
| Retorno | Parcial | agenda remota + financeiro local | não há transação atômica entre agendamento e cobrança |
| Agendamentos | Operacional remoto | `appointments` | criação e cancelamento; faltam edição, conflitos e timezone explícito |
| Financeiro | Operacional local | `localStorage` | tabela existe no banco, mas UI não usa repositório remoto |
| Planner | Operacional local | `localStorage` | tabela existe no banco, mas UI não usa repositório remoto |
| Chat | Operacional local | `localStorage` | tabelas e publicação Realtime existem, sem integração no cliente |
| Notificações | Operacional local/simulado | `localStorage` | tabela e Realtime existem; interface usa eventos simulados |
| Receitas/alimentos próprios | Estrutura local | `localStorage` | estado existe, fluxos são limitados/ausentes |
| Estudos | Simulado/estático | memória | cursos, artigos, podcast e downloads são demonstrativos |
| Marketing/content studio | Simulado | memória | preview funciona; exportação PNG é simulada |
| Site builder | Parcial local | settings em `localStorage`; leads em memória | não publica site nem envia lead ao backend |
| Modelos de mensagem | Operacional local | `localStorage` | edição local; lista inicia vazia sem seed |
| Automações de mensagem | Simulado | nenhum backend | checkboxes mostram alerta |
| Teleconsulta | Simulado | estado/cronômetro | não há WebRTC, sala, consentimento ou gravação |
| MoveHealth | Simulado | dados estáticos | sem integração com wearables |
| Suporte | Simulado | memória/alerta | nenhum ticket é enviado |
| Storage clínico | Planejado no banco | bucket privado | cliente não faz upload/download |
| Auditoria | Implementada no schema | `audit_logs` | precisa ser validada em instância real e ganhar interface administrativa |

## O que já está definido

- Produto orientado a nutricionistas e clínicas.
- SPA React com navegação interna sem roteador.
- Tema visual próprio com quatro variações.
- Separação inicial por módulos funcionais.
- Multi-tenancy por `clinic_id` e associação de membros.
- Exclusão lógica e trilha de auditoria no banco.
- Chave publicável no navegador e RLS como fronteira de autorização.
- Nomes de domínios centrais: pacientes, agenda, prescrição, antropometria, financeiro, planner, conversas e notificações.
- Comandos padronizados de build, lint, tipo e teste.

## Dívidas e inconsistências observadas

1. `AppContext` concentra navegação, domínio, persistência e comandos; tende a rerenderizações amplas e acoplamento crescente.
2. O banco modela mais recursos do que os repositórios entregam; existe uma lacuna clara entre schema e produto.
3. `localStorage` guarda informações potencialmente clínicas e financeiras sem criptografia, segregação por usuário ou expiração.
4. O perfil é escrito em `webfit_profile`, mas não é restaurado por essa chave; o comportamento de persistência é inconsistente.
5. Os filtros “data de modificação”, “data de criação” e “login no app” mantêm seleção visual, mas não alteram a lista.
6. O retorno cria agenda remota e lançamento financeiro local em duas operações sem atomicidade.
7. Há muitas confirmações via `alert`, conteúdo estático e botões que simulam sucesso.
8. `PatientProfile.tsx` tem mais de 1.300 linhas e mistura nove subdomínios.
9. Não há roteamento por URL, lazy loading por página, error tracking, métricas ou logs estruturados.
10. `node_modules/` e `dist/` estão rastreados pelo Git. Isso aumenta o repositório, produz ruído e torna o estado da árvore pouco confiável.
11. A documentação legada ainda usa “WebDiet” e descreve recursos não comprovados no WebFit.
12. Textos aparecem com mojibake em algumas leituras/arquivos (`IntegraÃ§Ã£o`), indicando necessidade de padronizar UTF-8 e revisar conteúdo.

## Critério de “pronto para produção”

O sistema só deve tratar dados reais de pacientes quando, no mínimo:

- todos os domínios clínicos usados saírem de `localStorage`;
- políticas RLS forem testadas com dois usuários e duas clínicas;
- integridade cruzada de `clinic_id` for garantida no banco;
- e-mail confirmado, recuperação de senha, MFA administrativo e proteção contra abuso estiverem definidos;
- logs, alertas, backup, restauração e resposta a incidentes forem exercitados;
- base legal, consentimentos, retenção e atendimento aos direitos LGPD estiverem documentados;
- testes E2E cobrirem os fluxos críticos;
- existir ambiente de staging e pipeline de entrega reproduzível.
