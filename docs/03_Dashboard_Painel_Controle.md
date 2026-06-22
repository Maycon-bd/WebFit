# Documento 3 — Dashboard e Painel de Controle

O **dashboard** é a tela inicial exibida após o login no WebDiet. Ele funciona como um painel de controle, reunindo, em uma única página, os principais indicadores e atalhos do dia a dia do nutricionista: pacientes, tarefas, histórico de consultas, comunidade profissional e prescrições recentes.

> 💡 **Dica:** sempre que precisar voltar à visão geral do seu consultório, clique no logo do WebDiet no canto superior esquerdo — isso leva diretamente ao dashboard.

---

## 3.1 Bloco "Seus pacientes"

![Bloco Seus pacientes e Seu planner](imagens/dashboard_pacientes_planner.png)

Este bloco mostra, em formato de lista, os pacientes com movimentação mais recente no sistema, exibindo avatar, nome completo e data/hora da última modificação na ficha.

**Elementos principais:**
- Botão **adicionar paciente** (em destaque, na cor verde-teal): atalho para criar um novo cadastro sem precisar entrar no menu Consultório;
- Barra de busca: permite localizar um paciente digitando `nome`, `apelido`, `CPF`, `telefone` ou `tag`;
- Lista de pacientes recentes, ordenada pela última modificação;
- Links rápidos: **Importar pacientes** (para migração de cadastros em lote), **Ver todos** (acessa a listagem completa) e **Aniversariantes** (filtra pacientes que fazem aniversário no período).

> 💡 **Dica:** use o link **Aniversariantes** periodicamente para enviar mensagens de parabéns — é uma forma simples de fortalecer o relacionamento com o paciente.

---

## 3.2 Bloco "Seu planner"

Ao lado do bloco de pacientes, o **planner** funciona como uma agenda de tarefas pessoais do nutricionista (diferente da agenda de consultas, que fica em **Consultório → Agendamentos**).

**Elementos principais:**
- Botão **adicionar tarefa**: cria uma nova tarefa para a data selecionada;
- Navegação por data: setas para esquerda/direita ao lado da data atual permitem avançar ou voltar dia a dia;
- Quando não há tarefas cadastradas para o dia, o sistema exibe a mensagem **"Nenhuma tarefa pendente"**, com o complemento "Você concluiu todas suas tarefas ou ainda não cadastrou tarefas em seu planner";
- Link **Ajustes**: abre as configurações de personalização do planner.

> 💡 **Dica:** use o planner para tarefas administrativas (ex: "enviar relatório para o paciente X", "revisar prescrição da Y") e deixe a agenda de **Agendamentos** exclusivamente para consultas — isso evita confusão entre os dois recursos.

---

## 3.3 Bloco "Ajustes do app do paciente"

![Bloco de Ajustes do app, Histórico de consultas, Comunidade e Prescrições](imagens/dashboard_historico_consultas_prescricoes.png)

Este bloco aparece como uma seção **colapsável** (accordion), identificada pelo ícone de seta voltada para baixo. Ao clicar sobre o título, a seção se expande revelando as opções de configuração do aplicativo que o paciente utiliza (por exemplo, para registrar o diário alimentar).

**Como usar:**
1. Clique sobre o título **"Ajustes do app do paciente"** para expandir a seção;
2. Ajuste as opções de configuração exibidas;
3. Clique novamente no título para recolher a seção quando terminar.

> 💡 **Dica:** revise os ajustes do app do paciente logo após o cadastro de um novo paciente, garantindo que ele consiga utilizar o aplicativo (diário alimentar, etc.) sem dificuldades desde a primeira semana de acompanhamento.

---

## 3.4 Bloco "Histórico de consultas"

Este bloco exibe um **gráfico de barras** com a quantidade de consultas realizadas, mês a mês, ao longo dos últimos 12 meses.

**Como interpretar o gráfico:**
- O **eixo horizontal** representa os meses (formato `mês/ano`, por exemplo `Jun/25` a `Jun/26`);
- O **eixo vertical** representa a quantidade de consultas realizadas naquele mês;
- Cada **barra na cor teal** corresponde ao volume de consultas de um mês específico — meses sem barra visível indicam ausência de consultas registradas naquele período;
- Uma **linha horizontal de referência** atravessa o gráfico, indicando uma meta ou média de consultas a ser usada como parâmetro de comparação visual: barras acima da linha indicam meses de desempenho superior à referência, e barras abaixo indicam meses por baixo dela.

> 💡 **Dica:** se você notar vários meses consecutivos com barras abaixo da linha de referência, isso pode ser um sinal de que vale revisar suas ações de marketing (Documento 2 — módulo Marketing) ou sua agenda de horários disponíveis.

O link **Abrir estatísticas**, no canto superior direito deste bloco, leva à seção completa de **Estatísticas** (menu Ferramentas), com relatórios mais detalhados.

---

## 3.5 Bloco "Comunidade WebDiet"

![Gráfico, Comunidade WebDiet e Prescrições recentes](imagens/dashboard_comunidade_prescricoes.png)

Este bloco apresenta uma lista dos tópicos de discussão mais recentes entre os profissionais que utilizam o WebDiet, funcionando como um fórum interno da plataforma.

**Elementos principais:**
- Título do tópico de discussão;
- Data e horário da última atualização do tópico;
- Link **Ver todos os tópicos**, que leva à listagem completa da comunidade.

> 💡 **Dica:** participar da Comunidade WebDiet é uma boa forma de trocar experiências com outros nutricionistas sobre casos clínicos, uso do app do paciente e estratégias de consultório.

---

## 3.6 Bloco "Prescrições recentes"

Este bloco lista as últimas prescrições emitidas pelo nutricionista, permitindo acompanhar rapidamente o que foi entregue a cada paciente.

**Elementos principais:**
- Tipo de prescrição emitida (por exemplo, **Cardápio Semanal**);
- Data de emissão;
- Nome do paciente vinculado à prescrição.

> 💡 **Dica:** use este bloco para verificar rapidamente se algum paciente está há muito tempo sem receber uma nova prescrição — pode ser hora de agendar um retorno.

---
**Próximo documento:** `04_Notificacoes_Comunicacao.md` — Notificações e Comunicação.
