# Catálogo funcional candidato — WebFit Desktop

## Como usar

Este catálogo transporta somente conhecimento de produto extraído do WebFit Web. Todos os itens estão no estado **proposto** até validação. A existência de uma tela ou regra antiga não significa aprovação para o Desktop.

Detalhes de banco, nuvem, navegador e estado técnico anterior foram removidos. Quando uma regra estiver contraditória ou incompleta, a decisão aparece explicitamente como pendência.

## Atores candidatos

- Proprietário do consultório.
- Nutricionista.
- Assistente/recepcionista.
- Paciente, apenas como entidade atendida no MVP local.

O paciente não é usuário do MVP Desktop. A necessidade de múltiplos usuários locais e seus poderes deve ser validada.

## Clínica e perfil profissional

### Capacidades candidatas

- Criar e editar dados da clínica.
- Manter nome do profissional, registro profissional, e-mail, telefone e avatar.
- Selecionar clínica ativa, caso múltiplas clínicas sejam aprovadas.
- Manter preferências visuais e operacionais do aplicativo.

### Decisões pendentes

- Uma instalação atenderá uma ou várias clínicas?
- Haverá vários usuários locais no MVP?
- Quais campos são obrigatórios para emissão de documentos?

## Dashboard

### Informações candidatas

- Pacientes alterados recentemente.
- Pacientes aniversariantes do mês.
- Próximas consultas.
- Tarefas do planner para a data selecionada.
- Histórico mensal de consultas.
- Prescrições recentes.
- Indicadores financeiros básicos.

### Comportamentos candidatos

- Pacientes mais recentemente alterados aparecem primeiro.
- Busca por nome, apelido, contato ou identificador aprovado.
- Atalhos abrem diretamente o fluxo correspondente.
- Indicadores são calculados a partir de registros reais, nunca de valores demonstrativos.

### Decisões pendentes

- Quais indicadores são essenciais no MVP?
- Consultas confirmadas contam como realizadas nos gráficos?
- Qual período padrão deve aparecer?

## Pacientes

### Campos candidatos

- Nome completo.
- Nome social ou apelido.
- CPF.
- Data de nascimento.
- Gênero, quando necessário e justificado.
- E-mail.
- Celular/WhatsApp.
- Tags.
- Observações clínicas.
- Estado ativo, inativo ou arquivado.
- Datas de criação e última alteração.

### Comportamentos candidatos

- Nome completo é obrigatório.
- Quando não houver apelido, sugerir o primeiro nome, permitindo alteração.
- Permitir cadastrar, consultar, pesquisar, editar e arquivar.
- Manter histórico clínico relacionado ao paciente arquivado conforme política definida.
- Permitir restaurar paciente quando a política aprovada autorizar.
- Exibir perfil organizado por áreas clínicas.

### Decisões pendentes

- CPF será obrigatório? Deve ser único por clínica?
- Quais opções de gênero e política de preenchimento serão usadas?
- Quais campos podem ser pesquisados?
- Qual é a política de arquivamento, restauração e eliminação?

## Agenda e consultas

### Campos candidatos

- Paciente.
- Profissional responsável, se houver múltiplos usuários.
- Data e horário.
- Duração.
- Modalidade presencial ou online.
- Estado da consulta.
- Observações.

### Comportamentos candidatos

- Toda consulta clínica deve estar vinculada a paciente existente.
- Permitir criar, editar, reagendar, cancelar e concluir consulta.
- Detectar conflito de horário conforme profissional e duração.
- Exibir consultas no dashboard e histórico do paciente.
- Preservar histórico de cancelamento em vez de desaparecer silenciosamente.

### Decisões pendentes

- Estado inicial: agendada ou confirmada?
- Quais transições de estado são permitidas?
- Uma consulta vira realizada automaticamente ou somente por ação do usuário?
- “Online” é apenas classificação ou implica videochamada?
- Qual regra de conflito e tolerância de horário?

## Anamnese e prontuário

### Capacidades candidatas

- Registrar e atualizar anamnese.
- Manter histórico de avaliações e observações.
- Relacionar registros ao paciente, autor e data.
- Diferenciar correção, nova evolução e complemento quando necessário.

### Decisões pendentes

- A anamnese será um texto atual ou versões/evoluções imutáveis?
- Quais campos estruturados são necessários no MVP?
- Quem pode alterar e visualizar cada informação?

## Antropometria

### Dados candidatos

- Data da medição.
- Peso.
- Altura.
- Percentual de gordura.
- Circunferências: cintura, quadril, abdômen, braço, antebraço, coxa, panturrilha, pescoço e tórax.
- Dobras: peitoral, subescapular, tríceps, axilar média, suprailíaca, abdominal e coxa.
- Indicadores calculados aprovados, como IMC.

### Comportamentos candidatos

- Manter histórico cronológico por paciente.
- Validar faixas e unidades.
- Diferenciar valor informado de valor calculado.
- Mostrar evolução sem substituir medições anteriores.

### Decisões pendentes

- Quais protocolos e fórmulas serão suportados?
- Quais medidas são obrigatórias?
- Resultados calculados devem ser persistidos ou recalculados?

## Prescrições e planos alimentares

### Capacidades candidatas

- Criar prescrição vinculada a paciente e autor.
- Salvar rascunho.
- Versionar alterações.
- Emitir/publicar versão final.
- Consultar prescrições recentes e histórico do paciente.
- Gerar documento para impressão ou exportação.
- Organizar refeições, alimentos, porções, orientações e substituições.

### Solicitações de UX existentes

- Reorganizar a apresentação de substituições para facilitar a leitura.
- Avaliar uma entrada clara para análise de exames bioquímicos.

### Decisões pendentes

- Estrutura completa do plano alimentar.
- Regras de substituição e equivalência.
- Estados de rascunho, emitida, substituída e cancelada.
- Quem pode alterar uma prescrição já emitida?
- Quais documentos têm validade profissional e campos obrigatórios?

## Pré-consulta

### Capacidades candidatas

- Criar questionário ou selecionar modelo.
- Vincular questionário a paciente e consulta.
- Registrar respostas fornecidas por meio local aprovado.
- Consultar histórico de envios e respostas.

### Restrição atual

Envio remoto ao paciente está fora do MVP local. O módulo só entra se houver um fluxo local útil e aprovado.

## Financeiro

### Dados candidatos

- Paciente opcional ou cliente avulso.
- Nome do pagador/cliente.
- Data da competência ou lançamento.
- Valor.
- Forma de pagamento.
- Estado: pendente, pago, cancelado ou reembolsado.
- Data do pagamento.
- Observação e vínculo opcional com consulta.

### Comportamentos candidatos

- Registrar entrada manual.
- Calcular receita e quantidade de lançamentos a partir dos registros.
- Permitir correção controlada, cancelamento e reembolso.
- Preservar histórico financeiro conforme política definida.

### Decisões pendentes

- Agendar retorno deve criar cobrança automaticamente?
- Se criar, qual é o estado inicial?
- Haverá despesas ou somente recebimentos no MVP?
- Quais relatórios e períodos são necessários?

## Planner

### Capacidades candidatas

- Criar tarefa administrativa com título e data.
- Listar tarefas da data selecionada.
- Navegar por datas.
- Marcar tarefa como concluída e reabrir quando permitido.
- Diferenciar tarefa administrativa de consulta clínica.

### Decisões pendentes

- Haverá horário, prioridade, recorrência e responsável?
- Tarefas concluídas continuam visíveis por quanto tempo?

## Arquivos clínicos e impressos

### Capacidades candidatas

- Anexar PDF ou imagem a paciente.
- Registrar nome original, tipo, tamanho, hash, autor e data.
- Visualizar, exportar e arquivar arquivo.
- Gerar PDFs reais de documentos aprovados.
- Detectar arquivo ausente ou alterado.

### Documentos candidatos

- Prescrição/plano alimentar.
- Receituário de suplementação.
- Atestado ou declaração de acompanhamento.
- Relatório de evolução.

### Decisões pendentes

- Quais documentos entram no MVP?
- Quais exigem assinatura ou dados profissionais específicos?
- Política de retenção e eliminação dos anexos.

## Autenticação e usuários locais

### Capacidades candidatas

- Criar primeiro administrador no primeiro uso.
- Entrar, sair, trocar senha e bloquear a sessão.
- Bloqueio automático após inatividade.
- Registrar sucessos e falhas relevantes de autenticação.
- Gerenciar usuários locais quando aprovado.

### Decisões pendentes

- Um único usuário atende ao MVP?
- Quais papéis serão disponibilizados?
- Matriz de ações permitidas por papel.
- Procedimento local de recuperação de acesso.

## Auditoria

### Eventos candidatos

- Login e falha de login.
- Criação, alteração, arquivamento e restauração.
- Emissão de documento.
- Exportação de dados ou arquivo.
- Criação e restauração de backup.
- Alteração de usuário e permissões.

### Decisões pendentes

- Quem pode consultar auditoria?
- Por quanto tempo ela será mantida?
- Quais alterações exigem motivo informado?

## Backup, restauração e exportação

### Capacidades obrigatórias candidatas

- Criar backup completo do banco e arquivos.
- Escolher destino externo.
- Verificar integridade e checksums.
- Exibir data e resultado do último backup.
- Alertar sobre backup desatualizado.
- Restaurar primeiro em área temporária.
- Preservar o estado atual antes de uma restauração.
- Exportar dados do usuário em formato documentado.

### Decisões pendentes

- Frequência recomendada e política de retenção.
- Proteção por senha e recuperação da chave.
- Destinos suportados.
- Política para backup automático.

## Preferências e modelos

### Capacidades candidatas

- Tema visual.
- Preferências de tabela e navegação.
- Dados padrão do profissional e da clínica.
- Modelos de texto reutilizáveis em documentos ou comunicação manual.

Preferências visuais podem usar armazenamento simples; dados clínicos e financeiros não.

## Funcionalidades adiadas

As seguintes ideias existiam nas fontes, mas não entram no MVP Desktop local:

- chat remoto;
- diário alimentar enviado pelo paciente;
- notificações push;
- WhatsApp e mensagens automáticas;
- portal ou aplicativo do paciente;
- teleconsulta integrada;
- site público, landing pages e mailing;
- estúdio de conteúdo e exportação promocional;
- biblioteca científica, cursos e podcast;
- wearables e MoveHealth;
- benefícios e vouchers;
- suporte remoto integrado;
- planos comerciais Pro/Black.

Cada item adiado exige nova análise de produto e, quando envolver outro dispositivo ou serviço externo, reavaliação da arquitetura local.

## Jornada candidata do MVP

```text
instalar
-> criar administrador
-> cadastrar clínica e profissional
-> cadastrar paciente
-> registrar consulta
-> preencher anamnese e antropometria
-> criar e emitir prescrição
-> registrar recebimento, se aplicável
-> gerar documento
-> criar backup
-> restaurar o backup em ambiente de teste
```

## Fontes históricas usadas na extração

- `docs/doc_stakeholder.md`.
- `docs/04-modulos-fluxos.md`.
- `docs/02_Guia_Consultorio.md`.
- `docs/03_Dashboard_Painel_Controle.md`.
- `docs/04_Notificacoes_Comunicacao.md`.
- `docs/05_Guia_Rapido.md`.
- `src/modules/*/rules.md`.
- `backlog-webfit.md`.
- `src/types/index.ts`.

Esses arquivos permanecem no WebFit Web. Não precisam ser copiados para o Desktop, salvo para auditoria histórica específica.
