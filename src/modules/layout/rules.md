# Regras de Negócio - Módulo Layout e Notificações

Este documento descreve o funcionamento do cabeçalho de navegação (`Navbar`), painéis suspensos (`DropdownMenu`), sistema de alertas flutuantes (`NotificationPanel`) e as respectivas regras associadas.

---

## 1. Descrição Geral do Módulo
A barra de navegação superior (`Navbar`) é um elemento fixo presente em todas as visualizações do sistema. Ela fornece atalhos de acesso a todos os módulos, monitora interações em tempo real e permite que o usuário gerencie seu perfil e ative recursos do plano **WebDiet Black**.

---

## 2. Estrutura do Menu e Navegação
O menu é dividido em três áreas principais:
1. **Dropdowns de Módulo**:
   - **Consultório**: Reúne links de operações diárias (Pacientes, Agendamentos, Pré-consulta, Respostas, Favoritos, Alimentos, Receitas, Diário Alimentar, Financeiro, Impressos, Lixeira).
   - **Estudos**: Links para atualização (Lâminas, Cursos, Cast, Biblioteca Científica, Casos Clínicos, Pasta Compartilhada, E-books, Blog).
   - **Marketing**: Links para atração e fidelização (Canvas, Mensagens do Sistema, Modelos de Mensagens, Benefícios, NutriLinks, Criador de Site, Mailing).
   - **Ferramentas**: Acessos extras (Videochamada, MoveHealth, Estatísticas, Benefícios Pessoais).
   - **Suporte**: Links de autoajuda e suporte direto (Suporte, Central de Ajuda, Vídeos, Feedback).
2. **Acessos Diretos**:
   - **Ver Chat**: Acessa a central de bate-papo de pacientes.
   - **Extensões & Vouchers**: Alertas e popups informativos de parcerias.
3. **Ícones de Ação**:
   - **WhatsApp**: Abre um canal de atendimento com o número cadastrado no perfil do profissional.
   - **Badge "20" (Simulador)**: Permite simular interações rápidas de pacientes no banco de dados para testes visuais rápidos das notificações e atualizações.
   - **Sino (Notificações)**: Exibe em tempo real postagens de fotos de refeições enviadas pelos pacientes.
   - **Avatar com borda dourada**: Abre o modal de edição de perfil profissional e controle de plano Black.

---

## 3. Regras de Notificação (Diário Alimentar)
O sistema de notificações monitora uploads de refeições feitas pelos pacientes.
- **Formato**: Cada item exibe o nome do paciente, ação executada ("registrou uma foto no diário alimentar"), data/hora da ação e uma miniatura da refeição enviada.
- **Estado de Leitura**: Notificações não lidas são destacadas com uma tonalidade azul-teal sutil e exibem um ponto vermelho indicador ao lado do ícone do sino na barra superior.
- **Interação**: Ao clicar em uma notificação:
  1. A notificação é marcada como lida (o indicador vermelho some).
  2. O sistema altera a página ativa para o **Diário Alimentar**.
  3. O paciente correspondente é automaticamente selecionado para que o nutricionista possa analisar e comentar a refeição.

---

## 4. Persistência de Dados
Todas as configurações de perfil e alterações no painel de notificações são sincronizadas instantaneamente no `localStorage` sob as chaves `webfit_profile` e `webfit_notifications` respectivamente.
