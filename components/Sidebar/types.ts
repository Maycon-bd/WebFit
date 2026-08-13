import { ReactNode } from 'react';

export interface Acao {
  tag_web: string;
  nome: string;
}

export interface Funcionalidade {
  label: string;
  route: string | null;
  tela?: string;                // codigo de menu do legado (camada_regras)
  componente?: string | null;
  tag_web?: string;             // chave semântica hierárquica (ex: 01.01.00)
  publico?: boolean;            // true = visivel sem permissao
  acoes?: Acao[];
}

export interface Subsection {
  title: string;
  items: string[];              // SLUGS de funcionalidades
}

export interface MenuModule {
  id: string;
  tag_web?: string;             // chave semântica hierárquica (ex: 01.00.00)
  label: string;
  icon: ReactNode;
  subsections: Subsection[];
  funcionalidades: Record<string, Funcionalidade>;
}
