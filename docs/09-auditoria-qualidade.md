# Auditoria de qualidade — 13/08/2026

## Resultado automatizado

O gate oficial é `npm run quality` e executa, em sequência:

1. TypeScript estrito sem emissão;
2. ESLint no código ativo e nas configurações;
3. testes Vitest com limites mínimos de cobertura;
4. build de produção do Vite.

O mesmo gate é executado pelo GitHub Actions em todo push e pull request. O relatório HTML de cobertura é preservado como artefato por 14 dias.

## Cobertura adicionada

- repositório de clínicas: ausência de configuração, leitura, erro, normalização de slug, propriedade e falhas de inserção;
- repositório clínico: mapeamento, normalização, escopo por clínica, soft delete, agendamentos e propagação de erros;
- armazenamento local: corrupção, formatos legados, ausência, quota, eventos de observabilidade e falhas desconhecidas;
- datas: janela móvel, contagem inválida e virada de ano;
- contexto de clínica: modo demonstração, usuário ausente, carregamento, criação e falha remota;
- migrations: RLS, autorização por usuário/clínica, proteção de funções privilegiadas, auditoria, índices e bloqueio de hard delete.

O escopo de cobertura obrigatória atual é `src/services/**`, `src/utils/**` e `WorkspaceContext.tsx`, com mínimos de 85% para linhas, funções e instruções e 75% para branches. Os números atuais superam os limites, permitindo que novas regressões sejam detectadas sem tornar o gate frágil.

## Zona legada isolada

A pasta raiz `components/` está não rastreada pelo Git, não é importada pela aplicação em `src/` e referencia módulos/dependências ausentes. Ela possui testes próprios que não conseguem ser carregados e 123 violações de lint no estado auditado. Por isso:

- a suíte oficial coleta somente `src/**/*.test.{ts,tsx}`;
- o lint oficial cobre a aplicação ativa;
- `npm run lint:legacy` expõe separadamente a dívida dessa pasta, sem apresentá-la como código validado.

Antes de integrar qualquer parte dessa pasta, é necessário decidir entre removê-la ou concluir sua migração, instalar as dependências legítimas, eliminar imports inexistentes e fazê-la entrar no `tsconfig`, no lint e na cobertura.

## Riscos residuais prioritários

1. Não há teste de integração contra um Supabase local com execução real das policies RLS. Os testes atuais validam a estrutura SQL, não o comportamento do Postgres.
2. Não há teste E2E dos fluxos de autenticação, criação/seleção de clínica, paciente e agendamento.
3. Não há auditoria automatizada de acessibilidade, contraste ou navegação por teclado.
4. Vários módulos ainda persistem dados clínicos em `localStorage`; não devem ser tratados como prontos para produção clínica.
5. `node_modules/` e `dist/` têm milhares de arquivos já rastreados no índice Git. O `.gitignore` evita novos arquivos, mas não corrige o histórico existente.
6. Componentes muito grandes, especialmente `PatientProfile.tsx`, aumentam custo de teste e risco de regressão; devem ser divididos por responsabilidade antes de ampliar testes de interface.

## Próxima etapa recomendada

Subir o Supabase local no CI e criar testes de integração por perfil (usuário anônimo, membro, não membro e proprietário), seguidos por E2E com Playwright para os quatro fluxos críticos. Depois, adicionar axe-core aos testes de interface e separar os maiores componentes.
