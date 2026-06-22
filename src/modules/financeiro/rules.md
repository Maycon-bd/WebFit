# Regras de Negócio - Módulo Financeiro

Este documento regulamenta o funcionamento do caixa financeiro do consultório na plataforma WebFit.

---

## 1. Cadastro de Recebimentos
- **Origem dos Dados**: Transações financeiras podem ter origem automática (através do agendamento de consultas de retorno na ficha do paciente) ou inserção manual (através do botão de registrar entrada).
- **Tipos de Clientes**:
  1. **Paciente WebFit**: Vinculado a uma ficha cadastrada (`patients`). O sistema puxa o nome oficial automaticamente.
  2. **Cliente Avulso**: Permite registrar recebimentos rápidos sem a necessidade de criar uma ficha de paciente completa (ex: venda de e-books, palestras, consultorias pontuais).

---

## 2. Parâmetros de Lançamento
Cada entrada de caixa armazena obrigatoriamente:
- Nome do cliente
- Data da transação (definida automaticamente no momento da criação)
- Valor recebido (em reais)
- Método de pagamento (PIX, Cartão, Dinheiro ou Transferência)
- Status (padronizado como "Pago" para registros efetuados)

---

## 3. Cálculos e Indicadores
- **Receita Bruta Acumulada**: O sistema realiza a soma dos campos `value` de todas as transações cadastradas para exibição no painel financeiro.
- **Atendimentos Faturados**: Contagem de registros do livro de caixa.
- **Atualização**: Os indicadores recalculam-se imediatamente a cada nova entrada inserida ou removida do estado local (`financials`), persistida no `localStorage`.
