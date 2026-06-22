# Regras de Negócio - Módulo Marketing

Este documento estabelece as regras de negócio associadas às ferramentas de promoção profissional e fidelização do módulo Marketing do WebFit.

---

## 1. WebDiet Canvas (Criador de Artes)
- O WebDiet Canvas é uma ferramenta simplificada para criar peças promocionais ou informativas.
- **Opções de Template**:
  - Dica de Saúde (cor padrão teal)
  - Receita Culinária (cor padrão dourada)
  - Agendamento de Consultas (cor padrão escura)
- **Modificações**: O profissional pode alterar o título do post, a descrição, a cor de fundo e a cor do texto. O design responde dinamicamente às edições na pré-visualização.
- **Exportação**: Gera uma imagem contendo marca d'água oficial "WebFit Arts" e o nome do profissional.

---

## 2. Criador de Site (Landing Page) & Mailing
- **Landing Page Individual**: Gera um site público básico com base nas configurações informadas pelo profissional (Título, Biografia, Endereço de Atendimento, Telefone e Tema de cores).
- **Mailing de Leads**:
  - O site possui um formulário de contato integrado.
  - **Fluxo de Captura**: Para fins de simulação de tráfego, o painel de controle possui um formulário de envio rápido. Quando o usuário insere dados fictícios, o lead é gerado no banco local (`leads`) e exibido no painel de controle em tempo real sob a lista *Mailing captado*.

---

## 3. Modelos de Mensagem (Templates)
- Modelos pré-configurados de texto para agilizar a rotina de respostas do profissional (ex: boas-vindas ao consultório, lembretes de retorno).
- **Edição e Criação**: Permite alterar o título identificador e o conteúdo de cada modelo. A atualização sincroniza no banco de dados local.

---

## 4. Mensagens e Automações do Sistema
- Regula o disparo de alertas automáticos.
- **Remetente Automatizado**: As mensagens de lembrete de consulta 24h antes e mensagens de parabéns no dia do aniversário do paciente são enviadas automaticamente caso a chave do interruptor correspondente esteja ativada (On).
