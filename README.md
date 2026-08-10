# WebFit - Plataforma Nutricional Completa

O **WebFit** é um protótipo funcional de alta fidelidade visual desenvolvido para nutricionistas e profissionais de saúde. A plataforma demonstra gestão de fichas clínicas, agendamentos, diários alimentares, controle financeiro, marketing e fidelização.

> **Estado atual:** aplicação híbrida em evolução. A interface pode operar em modo de demonstração local e já possui autenticação, onboarding e fundação de dados preparada para Supabase. Os módulos de negócio ainda estão sendo migrados gradualmente do `localStorage` para o banco.

### Nova fundação Supabase

O projeto já contém a primeira fundação de backend em `supabase/`: configuração local, migration multi-clínica, RLS em todas as tabelas expostas, bucket privado para arquivos clínicos, índices e Realtime para mensagens e notificações. Quando as variáveis Supabase estão presentes, o front habilita autenticação e onboarding de clínica; sem elas, continua em modo de demonstração local.

```bash
copy .env.example .env
# preencha VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY
npm run dev
```

Use somente a chave publicável (`sb_publishable_...`) no front-end. Chaves secretas ou `service_role` nunca devem ser adicionadas ao `.env` do Vite.

---

## 1. Arquitetura de Desenvolvimento Assistido (Assisted Development)

Este projeto foi projetado com foco na **facilidade de compreensão por agentes de IA e desenvolvedores para futuras manutenções**. A estrutura do projeto é modular e autocontida:
- Cada módulo funcional está localizado em sua própria subpasta dentro do diretório `src/modules/`.
- Cada pasta de módulo contém seu próprio código (`.jsx` ou `.css`) e um arquivo **`rules.md`** específico contendo detalhadamente as regras de negócio que governam aquele componente.
- O estado global é gerenciado pelo `AppContext`. A camada `src/services/storage.ts` mantém o `localStorage` sincronizado, trata conteúdo corrompido e isola o ponto que deverá ser substituído por uma API.

### Links Diretos para as Regras de Negócio de Cada Módulo:
1. **Layout e Notificações**: [src/modules/layout/rules.md](file:///d:/MAYCON/PROJETOS/WebFit/src/modules/layout/rules.md)
2. **Dashboard Geral**: [src/modules/dashboard/rules.md](file:///d:/MAYCON/PROJETOS/WebFit/src/modules/dashboard/rules.md)
3. **Gestão de Pacientes**: [src/modules/pacientes/rules.md](file:///d:/MAYCON/PROJETOS/WebFit/src/modules/pacientes/rules.md)
4. **Agendamentos de Consulta**: [src/modules/agendamentos/rules.md](file:///d:/MAYCON/PROJETOS/WebFit/src/modules/agendamentos/rules.md)
5. **Diário Alimentar de Fotos**: [src/modules/diario/rules.md](file:///d:/MAYCON/PROJETOS/WebFit/src/modules/diario/rules.md)
6. **Controle Financeiro**: [src/modules/financeiro/rules.md](file:///d:/MAYCON/PROJETOS/WebFit/src/modules/financeiro/rules.md)
7. **Estudos, Biblioteca e Cursos**: [src/modules/estudos/rules.md](file:///d:/MAYCON/PROJETOS/WebFit/src/modules/estudos/rules.md)
8. **Marketing, Canvas e Site Builder**: [src/modules/marketing/rules.md](file:///d:/MAYCON/PROJETOS/WebFit/src/modules/marketing/rules.md)
9. **Teleconsulta e Ferramentas**: [src/modules/ferramentas/rules.md](file:///d:/MAYCON/PROJETOS/WebFit/src/modules/ferramentas/rules.md)
10. **Chat de Comunicação**: [src/modules/chat/rules.md](file:///d:/MAYCON/PROJETOS/WebFit/src/modules/chat/rules.md)
11. **Suporte Técnico**: [src/modules/suporte/rules.md](file:///d:/MAYCON/PROJETOS/WebFit/src/modules/suporte/rules.md)

---

## 2. Stack Tecnológica

Para garantir máximo desempenho, facilidade de compreensão estrutural e customização de design sem placeholders genéricos, utilizamos:
- **Core**: React 18 + Vite (Javascript moderno / ES Modules).
- **Estilos**: Vanilla CSS puro com variáveis customizadas para gerenciar o tema escuro (`src/styles/variables.css`). Sem dependência de TailwindCSS ou bibliotecas pesadas de terceiros.
- **Gráficos**: SVGs puros e responsivos acoplados diretamente ao estado dinâmico dos atendimentos realizados no banco de dados.
- **Dados**: Persistência reativa completa no `localStorage` do navegador.

---

## 3. Estrutura Detalhada do Código Fonte

```text
d:\MAYCON\PROJETOS\WebFit\
├── docs/                             # Documentação textual original do sistema
├── prints/                           # Imagens originais para fidelidade de design
├── package.json                      # Arquivo de dependências e comandos npm
├── vite.config.ts                    # Configurações do Vite
├── index.html                        # Ponto de entrada do site com fontes e metadados
├── README.md                         # Este documento consolidado
└── src/
    ├── main.tsx                      # Inicialização do React
    ├── App.tsx                       # Ponto de entrada do aplicativo (layout + páginas)
    ├── context/
    │   └── AppContext.tsx            # Provedor de estado global persistente
    ├── services/storage.ts           # Adaptador defensivo de persistência local
    ├── components/                   # Limite de erros e avisos globais
    ├── styles/
    │   ├── variables.css             # Tema escuro e variáveis de CSS
    │   └── global.css                # Estilo global, botões, animações e reset
    └── modules/
        ├── layout/                   # Navbar, dropdowns e sino de notificações
        ├── dashboard/                # Widgets da Home (Seus Pacientes, Planner, Ajustes, Gráficos)
        ├── pacientes/                # Cadastro, Edição de Ficha, Histórico Clínico, iMetas
        ├── agendamentos/             # Calendário de Consultas (Presencial e Online)
        ├── diario/                   # Linha do tempo de refeições com fotos e avaliações
        ├── financeiro/               # Caixa, faturamentos, TED, Cartão, Dinheiro
        ├── estudos/                  # Cursos, podcast, blog e artigos de pesquisa
        ├── marketing/                # Estúdio de conteúdo, criador de site e leads
        ├── ferramentas/              # Teleconsulta (Videochamada HD) e estatísticas
        ├── chat/                     # Central de mensagens com injeção de templates
        ├── suporte/                  # FAQs e abertura de chamados técnicos
        └── shared/                   # Componente de modal comum reutilizável
```

---

## 4. Como Executar o Projeto Localmente

1. Certifique-se de possuir o **Node.js** instalado na máquina.
2. No diretório raiz do projeto, instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento local:
   ```bash
   npm run dev
   ```
4. O Vite abrirá automaticamente o navegador no endereço `http://localhost:3000`.

### Validação de qualidade

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

Os testes cobrem persistência defensiva, janela móvel de datas, navegação dos módulos e integridade das operações principais do contexto.

### Desenvolvimento Supabase

```bash
npx supabase start
npx supabase migration list --local
npx supabase db reset
```

Esses comandos exigem Docker. A migration inicial está em `supabase/migrations/` e deve ser validada localmente antes de ser aplicada a um projeto remoto.

## Limite de segurança da versão local

O `localStorage` não deve ser usado como banco definitivo para CPF, prontuários, conversas ou informações financeiras. Para produção, implemente um adaptador remoto no lugar de `src/services/storage.ts`, com autenticação, autorização por usuário, validação no servidor, criptografia em trânsito, auditoria e estratégia de backup. Credenciais e segredos nunca devem ser incluídos no bundle do Vite.

---

## 5. Fluxos de Demonstração e Simulação de Interatividade

Para testar a integração dinâmica e comprovar que o sistema não é estático:
1. **Simulador de Interação (Diário Alimentar)**: Clique na badge numerada **"20"** no canto superior direito do cabeçalho. O sistema simulará o upload de uma refeição aleatória de um paciente. O indicador vermelho acenderá sobre o **Sino**. Clique no Sino de Notificações, clique na refeição gerada e digite um feedback que será automaticamente enviado ao chat do paciente!
2. **WebFit Pro (Metas & MoveHealth)**: o sistema inicializa no plano Essencial. Recursos avançados ficam disponíveis ao alternar para o plano Pro nas demonstrações de assinatura.
3. **Gráfico do Histórico de Consultas**: Vá em *Consultório -> Agendamentos* ou clique em "Agendar Retorno" dentro de um perfil de paciente. Agende uma consulta na data de hoje. Volte ao Dashboard e veja a barra correspondente ao mês de Junho se elevar dinamicamente no gráfico de colunas!
4. **Site Builder e Mailing de Leads**: Vá em *Marketing -> Criador de site*. Edite os dados do seu consultório e veja o site se atualizar na lateral. Digite um contato no formulário do simulador e veja o lead ser cadastrado instantaneamente em *Mailing captado*.
