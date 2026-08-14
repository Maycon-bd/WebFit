# Contexto e decisões iniciais — WebFit Desktop

## Problema

Profissionais de nutrição precisam organizar informações do consultório e do acompanhamento clínico sem depender inicialmente de uma assinatura, servidor público ou conexão contínua com a internet.

## Direção do produto

- Aplicativo desktop local e offline.
- Plataforma inicial: Windows.
- Uso inicial em um único computador.
- Sem hospedagem e sem mensalidade obrigatória.
- Dados armazenados localmente e acompanhados por backup/restauração dentro do produto.
- Interface atual do WebFit Web é referência visual e funcional, não base arquitetural obrigatória.

## Decisões vigentes

| ID | Decisão | Status |
|---|---|---|
| DEC-001 | criar novo repositório chamado WebFit Desktop | aprovada |
| DEC-002 | pausar desenvolvimento do WebFit Web | aprovada |
| DEC-003 | usar Tauri 2 como shell desktop | proposta aprovada para spike |
| DEC-004 | manter React + TypeScript + Vite | proposta aprovada para spike |
| DEC-005 | usar SQLite nativo como banco local | proposta aprovada para spike |
| DEC-006 | usar Rust como fronteira de domínio e persistência | proposta aprovada para spike |
| DEC-007 | não copiar documentação técnica web como verdade vigente | aprovada |
| DEC-008 | importar somente funcionalidade e comportamento validados | aprovada |
| DEC-009 | conduzir desenvolvimento por requisitos rastreáveis e gates | aprovada |

As escolhas técnicas continuam sujeitas ao resultado do spike. Uma proposta aprovada para spike ainda não é uma decisão final de produção.

## Hipóteses a validar no Ciclo 0

- O usuário principal é nutricionista autônomo.
- Uma instalação pertence a um consultório.
- O MVP pode operar sem acesso do paciente.
- O MVP não precisa sincronizar dois computadores.
- Um administrador local é suficiente no primeiro incremento.
- Backup externo pode ser responsabilidade assistida do operador.

## MVP candidato

- instalação e primeiro acesso;
- usuário administrador local;
- perfil do profissional e clínica;
- pacientes;
- agenda;
- anamnese;
- antropometria;
- prescrições;
- financeiro básico;
- planner;
- arquivos e relatórios;
- auditoria;
- backup, restauração e exportação.

Nada nesta lista substitui a aprovação formal de escopo e requisitos.

## Fora do MVP candidato

- portal/app do paciente;
- chat remoto;
- diário enviado pelo celular;
- teleconsulta;
- marketing e site público;
- estudos/cursos/podcast;
- integrações com WhatsApp e wearables;
- sincronização e colaboração entre computadores;
- monetização por planos.

## Primeira jornada a especificar

```text
instalar -> criar administrador -> cadastrar clínica -> cadastrar paciente
-> registrar atendimento -> salvar prescrição -> gerar documento
-> criar backup -> restaurar backup em instalação de teste
```

## Autoridade e mudanças

O responsável pelo produto aprova visão, escopo, requisitos, prioridades e critérios de aceite. Mudanças de arquitetura, segurança ou modelo de dados devem ser registradas em ADR e avaliadas quanto a migração e recuperação.
