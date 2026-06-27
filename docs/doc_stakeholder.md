Com base na entrevista com a stakeholder (Amanda), o escopo do sistema será significativamente simplificado para focar no que realmente gera valor no dia a dia do atendimento. O objetivo principal da próxima iteração será a remoção de excessos (limpeza de interface) e o detalhamento de fluxos essenciais de consulta.

Abaixo está a estruturação das alterações dividida por módulos, pronta para ser integrada ao seu backlog de desenvolvimento:

---

# 📋 Backlog de Alterações do Sistema

## 1. 🛑 Remoções de Escopo (Simplificação do Sistema)

Para otimizar a usabilidade e focar na rotina do consultório, os seguintes módulos e componentes serão descontinuados e removidos da interface:

* **Módulos Completos a Remover:**
* [ ] **Marketing:** Remover por completo (não utilizado).
* [ ] **Ferramentas (Consulta Online):** Remover por completo.
* [ ] **Suporte:** Remover (não haverá chat interno ou ferramentas de tickets).
* [ ] **Extensões, Vouchers e Cupons/Promoções:** Remover por completo.


* **Componentes da Dashboard (Tela Principal):**
* [ ] Remover atalho/integração com **Comunidade Web Diet**.
* [ ] Remover bloco de **Alertas/Detecção Semanal**.


* **Componentes do Módulo de Consultório:**
* [ ] Remover sub-módulo **Respostas para Consulta**.
* [ ] Remover sub-módulo **Meus Alimentos** (manter apenas favoritos, para evitar duplicidade de conceito).


* **Componentes do Módulo de Estudos:**
* [ ] Remover sub-módulo **Cursos Completos**.
* [ ] Remover sub-módulo **Podcasts**.



---

## 2. 🟢 Funcionalidades a Manter e Refatorar

### 🏠 Dashboard (Tela Principal)

* [ ] **Manter Atalhos Úteis:** Preservar a estrutura de atalhos rápidos, pois facilitam a navegação.
* [ ] **Refatorar Componentes Atuais:**
* Manter botão de **Adicionar Paciente**.
* Manter o **Gráfico de Histórico de Consultas**.
* Manter a seção de **Prescrições Recentes** (apenas para visualização/leitura rápida).


* [ ] **Melhoria de UI/UX:** Refinar o design visual dos gráficos e blocos da Dashboard ("enfeitar mais").

### 🏥 Módulo: Consultório

* [ ] **Pacientes e Agendamento:** Manter o fluxo básico de listagem e marcação de consultas.
* [ ] **Meus Favoritos:** Manter e garantir a função de favoritar refeições estruturadas (ex: almoço padrão) para permitir a cópia rápida para o cardápio de outros pacientes.
* [ ] **Receitas Culinárias:** Manter o banco de dados de receitas para associação com os planos.
* [ ] **Impressos e Lixeira:** Manter o gerenciamento de documentos gerados e recuperação de itens excluídos.

### 📚 Módulo: Estudos

* [ ] **Lâminas Informativas:** Manter este sub-módulo focado em conteúdos visuais estáticos e explicativos para o paciente (ex: imagens de medidas caseiras, colheres, porções). *Nota: O conteúdo é fixo e não exige atualizações frequentes.*

---

## 3. 🚀 Novas Funcionalidades e Melhorias Críticas

### 🧮 Fluxo de Consulta: Antropometria Expandida

* [ ] **Aprimoramento do Módulo de Medidas:** Ir além do básico de Peso e Altura. O sistema deve permitir a inserção detalhada de:
* Circunferências corporais.
* Pregas cutâneas / Dobras cutâneas.


* *Dependência:* Aguardando o modelo/layout de tabela que a stakeholder utiliza para mapear os campos exatos.

### 🍏 Fluxo de Consulta: Editor de Cardápio / Planos Alimentares

* [ ] **Criação de Cardápio do Zero:** Adicionar a opção de iniciar um cardápio com "campos em branco" para montagem totalmente personalizada, além de permitir o uso da semana padrão.
* [ ] **Mapeamento de Marcas e Fontes de Medidas:** Na seleção de alimentos (ex: Ovo), o sistema deve listar equivalências e medidas próprias baseadas em livros de referência ou marcas comerciais específicas.

### 📸 Módulo: Diário Alimentar & Feedback da Nutri

* [ ] **Fluxo de Integração via App do Paciente:** Garantir que o paciente consiga enviar fotos das refeições em tempo real (via aplicativo acessado por QR Code impresso no cardápio).
* [ ] **Painel de Feedback:** Permitir que o profissional visualize as fotos enviadas no perfil do paciente e envie mensagens de aprovação, rejeição ou orientações nutricionais ("Feedback da Nutri").

### 💰 Novo Módulo: Controle Financeiro (Backlog de Futuro)

* [ ] **Módulo Financeiro Básico:** Estruturar uma área simples para gestão do consultório contendo:
* Fluxo de Caixa (Entradas e Saídas).
* Contas a Pagar e Contas a Receber.
* Status de pagamento por paciente (Quem já pagou / Quem está pendente).



---

## 📅 Próximas Ações / Tarefas de Design (Discovery)

1. **Coleta de Requisitos (Antropometria):** Solicitar à Amanda o envio das imagens ou tabelas com as circunferências e dobras cutâneas que ela mais utiliza no dia a dia.
2. **Sessão de Shadowing (Observação Ativa):** Agendar um momento para assistir à stakeholder operando o sistema atual para entender como ela pesquisa os alimentos e define as quantidades no cardápio.
3. **Benchmarking (Módulo de Estudos):** Verificar a viabilidade e custos de planos "Premium" de plataformas concorrentes para entender se há conteúdos extensos que valham a pena serem sintetizados/modelados como nativos no sistema.