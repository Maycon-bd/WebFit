# Documento 1 — Visão Geral do Sistema WebDiet

## 1.1 O que é o WebDiet

O **WebDiet** é uma plataforma SaaS (Software como Serviço) desenvolvida para nutricionistas e profissionais de saúde que atuam com acompanhamento nutricional. O sistema centraliza, em um único ambiente web, a gestão de pacientes, prescrições alimentares, agendamentos de consultas, ferramentas de marketing para captação e retenção de pacientes, e recursos educacionais de atualização profissional.

Por ser um sistema **100% web**, não é necessário instalar nenhum programa no computador: basta acessar pelo navegador, em qualquer dispositivo com internet.

> 💡 **Dica:** como o WebDiet funciona na nuvem, seus dados e os de seus pacientes ficam disponíveis em qualquer computador ou celular em que você fizer login — não é preciso fazer backups manuais dos atendimentos.

## 1.2 Público-alvo

O sistema é voltado principalmente para:

- **Nutricionistas** com consultório próprio (físico ou online);
- **Clínicas multiprofissionais** que possuem nutricionistas na equipe;
- **Profissionais de saúde** que utilizam prescrições alimentares e diários alimentares como parte do acompanhamento de pacientes.

O nível de conhecimento técnico exigido é **básico**: a documentação aqui apresentada assume que o usuário não tem familiaridade prévia com sistemas de gestão, apenas com o uso comum de navegadores de internet.

## 1.3 Requisitos de acesso

Para utilizar o WebDiet, são necessários:

| Requisito | Detalhe |
|---|---|
| Navegador | Google Chrome, Microsoft Edge ou Firefox atualizados (recomenda-se Chrome para melhor compatibilidade) |
| Conexão | Internet estável (banda larga ou 4G/5G); o sistema não funciona offline |
| Dispositivo | Computador, notebook, tablet ou smartphone com navegador |
| Conta de acesso | Login e senha cadastrados junto ao WebDiet |

> ⚠️ **Observação:** como o WebDiet é acessado via navegador, não há instalador `.exe` ou aplicativo de desktop. Caso exista um aplicativo móvel complementar (por exemplo, para o paciente registrar o diário alimentar), isso deve ser verificado separadamente, pois não fazia parte do material analisado para esta documentação.

## 1.4 Planos: WebDiet Padrão vs. WebDiet Black

O WebDiet possui duas camadas de acesso:

### WebDiet Padrão
Plano base do sistema, com acesso aos módulos de gestão de pacientes, agendamentos, prescrições, estudos e marketing.

### WebDiet Black (Premium)
Plano avançado que desbloqueia recursos adicionais, com destaque para:

| Recurso exclusivo Black | Descrição esperada |
|---|---|
| **MoveHealth** | Integração de atividades físicas e bem-estar ao acompanhamento nutricional |
| **iMetas** | Definição e acompanhamento de metas para os pacientes |
| **Recursos de IA** | Funcionalidades de inteligência artificial para apoiar o atendimento |

> 💡 No painel principal do sistema, um banner de destaque convida o usuário a conhecer o WebDiet Black, reforçando que esses recursos ficam visíveis (mas bloqueados) mesmo para quem está no plano padrão — funcionando como um upsell contínuo dentro da própria interface.

![Banner de divulgação do WebDiet Black no dashboard](imagens/dashboard_pacientes_planner.png)

## 1.5 Estrutura geral da navegação

Todo o sistema é acessado a partir de uma **barra de navegação fixa no topo da tela**, presente em todas as páginas. Ela é dividida em três grupos:

### a) Menus com submenu (dropdown)
| Menu | Quantidade de sub-itens |
|---|---|
| **Consultório** | 11 |
| **Estudos** | 8 |
| **Marketing** | 7 |
| **Ferramentas** | 4 |
| **Suporte** | *(menu identificado na interface; sub-itens não capturados nas imagens disponíveis — recomenda-se nova captura de tela)* |

### b) Itens de acesso direto (sem submenu)
- **Ver chat**
- **Extensões**
- **Vouchers**

### c) Ícones de atalho (extremidade direita da barra)
| Ícone | Função esperada |
|---|---|
| WhatsApp | Atalho para integração/contato via WhatsApp |
| Badge numerado (ex: "20") | Contador de notificações ou mensagens pendentes |
| Sino | Abre o painel de notificações |
| Grade (4 quadrados) | Possível atalho para outros aplicativos/funcionalidades do ecossistema WebDiet — função exata a confirmar |
| Avatar | Abre o menu de perfil do usuário logado |

![Barra de navegação completa do WebDiet](imagens/dashboard_comunidade_prescricoes.png)

Os Documentos 2 a 5 detalham cada um desses módulos e funcionalidades.

## 1.6 Glossário de termos do sistema

| Termo | Significado |
|---|---|
| **Consultório** | Módulo central de gestão clínica: pacientes, agendamentos, prescrições e documentos |
| **Pré-consulta** | Formulário enviado ao paciente antes do atendimento, para coletar informações prévias |
| **Diário alimentar** | Registro (com fotos) que o paciente faz das refeições, para acompanhamento do nutricionista |
| **Planner** | Agenda de tarefas pessoais do nutricionista dentro do sistema |
| **Prescrição** | Documento emitido para o paciente, como um cardápio ou plano alimentar |
| **Comunidade WebDiet** | Fórum de discussão entre profissionais usuários do sistema |
| **NutriLinks** | Links personalizados de divulgação do profissional |
| **WebDiet Canvas** | Ferramenta de criação de materiais visuais (artes para redes sociais, por exemplo) |
| **MoveHealth** | Recurso premium (Black) de integração com atividades físicas |
| **iMetas** | Recurso premium (Black) de definição de metas para pacientes |
| **Lixeira** | Local onde ficam itens excluídos antes da remoção definitiva |

---
**Próximo documento:** `02_Guia_Consultorio.md` — Guia do Usuário do módulo Consultório.
