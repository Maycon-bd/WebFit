# Regras de Negócio - Módulo Agendamentos

Este documento detalha as regras de negócio que regem o agendamento de consultas clínicas na plataforma WebFit.

---

## 1. Agendamento de Consultas
- **Vinculação Obrigatória**: Toda consulta necessariamente deve estar vinculada a um paciente existente na base de dados (`patients`).
- **Campos de Formulário**: Para cada compromisso, o sistema armazena o ID do paciente, o nome do paciente, a data do agendamento, o horário de início e a modalidade de atendimento (Presencial ou Online).
- **Status Inicial**: Por padrão, o status inicial da consulta é cadastrado como "Confirmada". Ao final do horário previsto, o sistema assume o status "Realizada".

---

## 2. Modalidades de Atendimento
1. **Presencial**: O atendimento ocorre fisicamente no consultório principal do profissional.
2. **Online (Teleconsulta)**: O atendimento ocorre de forma remota. Quando configurado como Online, o sistema libera um link de atalho no dia da consulta para o módulo de **Videochamada** (Teleconsulta integrada).

---

## 3. Desmarcação de Compromissos
- O profissional de saúde pode desmarcar consultas a qualquer momento.
- A ação de cancelamento remove permanentemente o registro da tabela de compromissos ativos do estado local (`appointments`), liberando o horário correspondente no painel de estatísticas de forma automática.

---

## 4. Integração Estatística e Financeira
- O gráfico de **Histórico de Consultas** do Dashboard analisa dinamicamente as datas de todos os compromissos ativos com status "Realizada" ou "Confirmada".
- A inclusão de consultas passadas eleva as colunas do gráfico do respectivo mês instantaneamente.
