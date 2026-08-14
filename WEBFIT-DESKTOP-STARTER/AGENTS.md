# AGENTS.md — WebFit Desktop

## Produto

WebFit Desktop é um aplicativo local e offline para gestão de consultório e acompanhamento nutricional. A primeira versão é Windows-first, sem hospedagem, sem mensalidade e orientada ao uso em um único computador.

## Fonte de verdade

Antes de planejar ou alterar o produto, leia:

1. `docs/project/context.md`;
2. `docs/project/development-lifecycle.md`;
3. `docs/project/functional-candidates.md` durante a descoberta;
4. `docs/product/scope.md`, quando existir;
5. requisitos, regras, casos de uso e ADRs relacionados ao domínio alterado.

Documentos legados são fontes de descoberta, não requisitos aprovados.

## Arquitetura vigente

- Tauri 2 para o aplicativo desktop.
- React + TypeScript + Vite para a interface.
- Rust para comandos, domínio, segurança, arquivos e persistência.
- SQLite nativo para dados locais.
- Arquivos clínicos no filesystem privado, com metadados e hashes no banco.
- Comunicação frontend/backend por comandos pequenos, tipados e autorizados.

Não introduza Supabase, Firebase, backend remoto, `localStorage` de domínio ou acesso SQL genérico pela WebView sem uma nova decisão arquitetural aprovada.

## Processo obrigatório

- Não implemente requisito sem ID, critérios de aceite e status aprovado.
- Mantenha rastreabilidade entre requisito, tarefa, teste e versão.
- Registre decisões significativas em ADR.
- Faça incrementos verticais: interface, domínio, persistência, erro e teste juntos.
- Atualize documentação na mesma mudança que altera comportamento.
- Preserve alterações preexistentes e não faça ações destrutivas sem autorização explícita.

## Dados e segurança

- Trate dados de saúde como sensíveis.
- Nunca registre senha, chave, CPF, prontuário, mensagem ou documento clínico em logs.
- Nunca coloque segredo no frontend ou no repositório.
- Autorize toda operação no backend Tauri; ocultar botão não é autorização.
- Use consultas parametrizadas e transações.
- Ative foreign keys em toda conexão SQLite.
- Valores monetários são inteiros em centavos.
- Datas e horários instantâneos são persistidos em UTC.
- Arquivos físicos usam UUID, não nome ou CPF do paciente.
- Mudanças em dados exigem avaliação de migração, backup e restauração.

## SQLite

- Migrações devem ser numeradas, transacionais e testadas.
- Teste tanto banco vazio quanto atualização da versão anterior.
- Não use SQLite em pasta de rede ou pasta sincronizada como mecanismo de colaboração.
- Não copie diretamente um banco ativo para backup; use snapshot consistente.
- Execute verificações de integridade na restauração.

## Qualidade

Antes de concluir uma entrega, execute os comandos disponíveis para:

- formatação;
- lint;
- TypeScript;
- testes frontend;
- testes Rust;
- testes de integração SQLite;
- build Tauri aplicável.

Se algum comando ainda não existir, registre isso no handoff e crie-o quando fizer parte do escopo da fundação.

## Definition of Done resumida

Uma entrega só está concluída quando comportamento e erros estão implementados, critérios de aceite foram executados, testes passam, migrações são verificadas, documentação está atualizada e nenhum dado sensível foi introduzido em logs ou armazenamento inadequado.

## Escopo inicial proibido sem reavaliação

- sincronização entre computadores;
- portal/app remoto do paciente;
- chat remoto e notificações push;
- WhatsApp automatizado;
- teleconsulta;
- hospedagem e serviços em nuvem;
- planos pagos e bloqueios comerciais.

Se uma solicitação exigir qualquer item acima, pare, apresente o impacto e solicite uma decisão de arquitetura e produto.
