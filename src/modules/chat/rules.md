# Regras de Negócio - Módulo Chat e Comunicação

Este documento estabelece as regras de negócio para a ferramenta de comunicação por chat integrado no WebFit.

---

## 1. Organização do Histórico (Threads)
- O chat é segmentado individualmente por paciente.
- O sistema armazena a lista de conversas indexadas pelo ID do paciente.
- Cada mensagem contém o remetente (`sender`: "doctor" ou "patient"), o corpo de texto e a estampa de data e hora formatada em `DD/MM/AAAA - HH:MM`.

---

## 2. Modelos de Mensagem (Templates)
- Para aumentar a produtividade do atendimento, o profissional pode aplicar modelos de mensagens cadastrados em **Marketing**.
- **Chave de Substituição**: O sistema escaneia o modelo selecionado e substitui a variável `{nome}` pelo apelido/nome social do paciente ativo.
- O texto resultante é preenchido na caixa de texto para que o profissional possa editá-lo ou enviá-lo diretamente.

---

## 3. Disparo e Resposta
- Mensagens enviadas pelo nutricionista são alinhadas à direita da tela na cor verde-teal padrão.
- Mensagens recebidas dos pacientes são alinhadas à esquerda na cor cinza de fundo.
- Toda interação atualiza o banco de dados local (`chats`) em tempo real no `localStorage`.
