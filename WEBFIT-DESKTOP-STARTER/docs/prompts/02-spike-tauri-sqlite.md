# Prompt 02 — Spike Tauri, SQLite, segurança e backup

Execute somente depois de o Gate G1 estar aprovado e existir baseline mínima do Gate G2.

---

Realize o spike técnico bloqueante do WebFit Desktop. Leia `AGENTS.md`, requisitos aprovados, ADR-0001 e os planos do projeto antes de agir.

Antes de instalar, confira a documentação oficial atual do Tauri e as versões disponíveis. No Windows, verifique Node LTS, Rust MSVC, Microsoft C++ Build Tools e WebView2. Use `npm create tauri-app@latest`, selecionando React, TypeScript e npm, salvo se o ADR aprovado indicar outra escolha.

Entregue uma prova mínima que:

1. abre como aplicação Tauri;
2. cria banco SQLite no diretório correto de dados do aplicativo;
3. executa migrações versionadas;
4. ativa foreign keys em toda conexão;
5. não oferece SQL genérico à WebView;
6. expõe comandos tipados mínimos para criar e listar um paciente de teste;
7. fecha e reabre preservando o registro;
8. cria snapshot consistente de backup;
9. restaura o snapshot em área de teste e valida integridade;
10. avalia SQLCipher, armazenamento da chave e impacto de empacotamento;
11. gera instalador Windows de teste;
12. possui testes frontend, Rust e SQLite proporcionais ao spike.

Não importe a interface completa. Não use dados reais. Registre resultados, limitações, comandos executados e recomendação final no ADR-0001. Se criptografia ou instalador falharem, não esconda o risco nem avance silenciosamente.

Ao final, informe se o Gate G4 pode ser aprovado e quais decisões permanecem abertas.

---
