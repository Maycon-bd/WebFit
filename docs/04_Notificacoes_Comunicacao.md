# Documento 4 — Notificações e Comunicação

O WebDiet oferece diferentes canais para manter o nutricionista informado sobre a atividade dos pacientes e para se comunicar com eles. Este documento detalha o sistema de notificações, a integração com WhatsApp, o chat com pacientes e as mensagens automáticas/modelos.

---

## 4.1 Como funciona o sistema de notificações

O ícone de **sino**, localizado na barra superior, dá acesso ao painel de notificações do sistema.

![Painel de notificações com registros do diário alimentar](imagens/notificacoes_diario_alimentar.png)

**O que aparece no painel:**
- Registros de **fotos no diário alimentar** enviadas pelos pacientes;
- Cada notificação exibe: data e horário do registro, nome do paciente e a ação realizada (por exemplo, *"registrou uma foto no diário alimentar"*);
- Uma **miniatura (thumbnail)** da foto enviada pelo paciente, ao lado do texto da notificação;
- As notificações são organizadas em **ordem cronológica**, com as mais recentes no topo.

**Como acessar:**
1. Clique no ícone de **sino** na barra superior, em qualquer tela do sistema;
2. O painel se abre exibindo a lista de notificações;
3. Clique sobre uma notificação para abrir o registro completo do paciente (quando aplicável).

> 💡 **Dica:** acompanhe as notificações diariamente — responder rapidamente a um registro do diário alimentar (mesmo que só com um elogio ou pergunta) aumenta o engajamento do paciente com o acompanhamento.

> ⚠️ **Observação:** ao lado do sino, há um **badge numerado** (por exemplo, "20") indicando a quantidade de itens pendentes de visualização. Esse contador parece estar associado a um ícone diferente (entre o WhatsApp e o sino) — recomenda-se confirmar, em ambiente de produção, se o número se refere a notificações do sino, a mensagens do chat, ou a ambos.

---

## 4.2 Integração com WhatsApp

Na extremidade direita da barra de navegação, o ícone do **WhatsApp** oferece acesso rápido à integração do sistema com o aplicativo de mensagens.

**Função esperada:**
- Permitir comunicação direta com pacientes via WhatsApp, possivelmente a partir do próprio histórico de atendimento;
- Pode estar relacionado ao envio de mensagens automáticas (lembretes, confirmações) configuradas em **Marketing → Mensagens do sistema** (ver Documento 2).

> 💡 **Dica:** sempre que possível, prefira manter o contato oficial com o paciente registrado dentro do sistema (chat ou WhatsApp integrado), em vez de números pessoais — isso facilita a centralização do histórico de comunicação.

---

## 4.3 Chat com pacientes (Ver chat)

O item **Ver chat**, disponível diretamente na barra de navegação (sem necessidade de abrir um submenu), dá acesso à central de conversas com os pacientes.

**Como acessar:** clique em **Ver chat** na barra de navegação superior.

**Principais ações disponíveis:**
- Visualizar conversas em andamento com pacientes;
- Responder mensagens diretamente pela plataforma;
- Utilizar **modelos de mensagens** (ver item 4.4) para agilizar respostas recorrentes.

> 💡 **Dica:** reserve horários fixos no dia para responder o chat — isso evita que mensagens de pacientes fiquem muito tempo sem retorno, especialmente durante a semana de atendimentos.

---

## 4.4 Mensagens automáticas e modelos

Esses recursos ficam dentro do menu **Marketing** (detalhado no Documento 2), mas estão diretamente relacionados à comunicação com o paciente:

| Recurso | Função |
|---|---|
| **Mensagens do sistema** | Central de mensagens automáticas enviadas pelo próprio WebDiet (lembretes, confirmações) |
| **Modelos de mensagens** | Templates reutilizáveis criados pelo profissional, para respostas rápidas no chat |

**Como usar em conjunto com o chat:**
1. Crie modelos para as situações mais comuns de comunicação (boas-vindas, lembrete de retorno, cobrança) em **Marketing → Modelos de mensagens**;
2. Ao responder um paciente em **Ver chat**, utilize um modelo já pronto em vez de digitar a mensagem do zero;
3. Configure os disparos automáticos relevantes (como lembrete de consulta) em **Marketing → Mensagens do sistema**, reduzindo a necessidade de contato manual para tarefas repetitivas.

> 💡 **Dica:** equilibre automação com toque pessoal — mensagens automáticas são ótimas para lembretes e confirmações, mas o acompanhamento mais próximo (como feedback do diário alimentar) tende a gerar melhores resultados quando é uma resposta pessoal do nutricionista.

---
**Próximo documento:** `05_Guia_Rapido.md` — Guia Rápido (Quick Start).
