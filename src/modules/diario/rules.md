# Regras de Negócio - Módulo Diário Alimentar

Este documento estabelece as diretrizes de funcionamento do Diário Alimentar do paciente e a moderação do profissional de saúde no WebFit.

---

## 1. Funcionamento Geral
- O Diário Alimentar permite ao paciente registrar fotos de suas refeições ao longo do dia para auditoria e orientação do profissional de saúde.
- Cada refeição armazenada possui o ID do paciente correspondente, o nome descritivo da refeição (ex: "Almoço equilibrado"), imagem fotográfica correspondente e data/hora do registro.

---

## 2. Fluxo de Notificação
- Toda vez que um paciente envia uma foto no diário, o sistema dispara um sinal luminoso (círculo vermelho de notificação) no cabeçalho sobre o ícone do **Sino** (`Navbar`).
- O Sino de Notificações exibe a lista cronológica decrescente dos envios do diário.
- Ao clicar na notificação, o profissional é redirecionado diretamente à linha do tempo do diário daquele paciente.

---

## 3. Avaliação e Feedback
- O nutricionista pode fornecer comentários e notas sobre cada prato postado na linha do tempo.
- **Integração com o Chat**:
  - Assim que o nutricionista insere e envia um comentário sobre a foto da refeição, esse comentário é automaticamente injetado como uma bolha de texto no histórico do **Chat** (`chats`) com o respectivo paciente.
  - Isso garante a centralização da conversa e facilita a visualização do feedback pelo paciente em tempo real no aplicativo móvel.
- **Edição Única**: Uma vez enviado o feedback para um determinado prato, o campo de texto de resposta é travado, exibindo a mensagem enviada de forma estruturada.
