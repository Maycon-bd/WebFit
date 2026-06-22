# Regras de Negócio - Módulo Dashboard

Este documento descreve as regras de negócio associadas aos elementos exibidos na tela inicial do sistema WebFit.

---

## 1. Banner Superior (WebDiet Black)
- **Regra de Upsell**: Um banner dourado em destaque convida o profissional a assinar o plano premium **WebDiet Black**.
- **Ação**: Clicar no banner alterna o status da assinatura (`isBlack`) no perfil do usuário.
- **Mudança de Estado**: Quando o usuário se torna "Black", o banner altera sua mensagem de convite para uma mensagem de boas-vindas, e desbloqueia recursos anteriormente restritos nos módulos Estudos, Ferramentas e Marketing.

---

## 2. Widget "Seus Pacientes"
- **Ordenação**: Os pacientes são listados em ordem cronológica reversa da última modificação efetuada em suas fichas (os mais recentemente modificados aparecem primeiro).
- **Busca Avançada**:
  - Filtra dinamicamente os registros da lista digitando termos no campo de busca.
  - Campos elegíveis para busca: Nome, Apelido, CPF, Telefone e Tags de agrupamento (ex: "atleta", "gestante").
- **Link Aniversariantes**: Filtra a lista exibindo apenas os pacientes cuja data de nascimento coincide com o mês corrente do sistema.
- **Botão "Adicionar Paciente"**: Abre um formulário de cadastro de paciente no estado global.

---

## 3. Widget "Seu Planner"
- **Finalidade**: Uma agenda administrativa interna para o profissional, diferente da agenda de consultas clínicas.
- **Filtro de Data**: Exibe apenas as tarefas cadastradas para o dia selecionado no carrossel de datas.
- **Navegação**: O usuário pode avançar ou retroceder um dia por vez através das setas direcionais.
- **Gestão de Tarefas**:
  - O usuário pode adicionar tarefas para qualquer data selecionada.
  - Clicar na caixa de seleção (checkbox) alterna o status da tarefa entre pendente e concluída. Tarefas concluídas recebem um estilo tachado e cor opaca.
  - Caso não existam tarefas para o dia corrente, exibe-se uma mensagem amigável de conclusão.

---

## 4. Accordion "Ajustes do App do Paciente"
- **Comportamento**: Uma seção colapsável (accordion) que esconde ou exibe opções de configuração globais para o aplicativo móvel do paciente.
- **Configurações Disponíveis**:
  - Permitir envio de fotos no diário alimentar.
  - Habilitar rastreamento de consumo de água.
  - Habilitar registros de pesagem corporal pelo próprio paciente.
  - Definir frequência de envio de lembretes push no celular.

---

## 5. Histórico de Consultas (Gráfico Dinâmico)
- **Representação Visual**: Um gráfico de barras em SVG puro com 13 colunas, correspondente aos últimos 13 meses.
- **Dados Dinâmicos**: A altura de cada barra e a contagem suspensa correspondem ao total de consultas com status "Realizada" ou "Confirmada" cadastradas para aquele respectivo mês no banco de dados local.
- **Linha de Referência**: Uma linha horizontal pontilhada na altura 2 (duas consultas por mês) atua como indicador de desempenho mensal do consultório.
