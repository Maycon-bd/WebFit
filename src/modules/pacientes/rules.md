# Regras de Negócio - Módulo Pacientes

Este documento descreve as regras de negócio para a gestão de fichas de pacientes, prescrições e acompanhamento de anamnese.

---

## 1. Cadastro e Validação de Paciente
- **Campos Obrigatórios**: O campo *Nome Completo* é obrigatório.
- **Campos Adicionais**: O sistema captura Nome Social/Apelido, Gênero, CPF, Data de Nascimento, E-mail, Celular (WhatsApp), Tags de Agrupamento e Anamnese Clínica.
- **Apelido**: Caso o apelido não seja fornecido pelo usuário, o sistema preenche automaticamente com o primeiro nome extraído do campo *Nome Completo*.
- **Registro de Data**: Ao criar ou atualizar a ficha do paciente, o sistema registra a data e hora do servidor no formato `DD/MM/AAAA - HH:MM:SS` no campo `lastModified`, forçando a lista no Dashboard a ser reordenada para manter o paciente no topo.

---

## 2. Ações do Perfil do Paciente

### A. Anamnese
- Exibe o histórico de anotações clínicas inserido pelo profissional. Pode ser atualizado a qualquer momento editando a ficha.

### B. Emissão de Cardápios
- O profissional escolhe o tipo de planejamento alimentar (ex: "Cardápio Semanal Padrão", "Protocolo Hipertrofia Limpa").
- Ao confirmar, o sistema gera um registro sob a tabela de Prescrições no estado global associando o ID do paciente, data corrente de emissão e nome. A nova prescrição é exibida no bloco "Prescrições recentes" no Dashboard.

### C. Questionários de Pré-consulta
- O profissional pode simular o envio de questionários antes de atendimentos formais.
- O sistema exibe o histórico de respostas enviadas pelos pacientes para auxiliar o nutricionista na elaboração do diagnóstico clínico.

### D. iMetas (Controle de Planos)
- **Controle de Acesso**: O quadro interativo de metas de hábitos é um recurso exclusivo do plano **WebDiet Black**.
- **Acesso Bloqueado**: Se o profissional estiver no plano padrão, exibe-se uma tela bloqueada e um atalho de conversão/upgrade.
- **Acesso Desbloqueado**: Quando o plano Black está ativo, o profissional pode adicionar novas metas personalizadas de hábitos e marcar conclusões em tempo real.

### E. Diário Alimentar do Paciente
- Exibe a linha do tempo de fotos de refeições enviadas pelo paciente selecionado.
- Permite que o nutricionista digite feedbacks individuais sobre cada refeição. Quando enviado, o feedback é adicionado como mensagem no chat e notificado ao paciente.

### F. Impressos
- Facilita a geração de PDFs simulados de atestados de acompanhamento, receituários de suplementação personalizados e laudos clínicos.

### G. Retorno e Cobrança
- O profissional pode agendar um retorno inserindo data, hora e modalidade (presencial ou online).
- Ao salvar, o retorno é inserido na agenda de **Agendamentos** e é gerada uma fatura financeira na tabela de fluxo de caixa em **Financeiro** com status "Pago".
