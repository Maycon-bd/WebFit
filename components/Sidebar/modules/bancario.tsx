import { Landmark } from 'lucide-react';
import { MenuModule } from '../types';

export const bancario: MenuModule = {
  id: 'banking',
  tag_web: '02.00.00',
  label: "Bancário",
  icon: <Landmark size={18} />,
  subsections: [
    { title: "Principal", items: ['bancario.dashboard'] },
    { title: "Cadastros", items: ['bancario.conta', 'bancario.conta_aplicacao', 'bancario.lote'] },
    { title: "Lançamentos e Controle", items: ['bancario.movimento', 'bancario.cheque', 'bancario.conciliacao'] },
    { title: "Processamento", items: ['bancario.movimento_importa_extrato'] },
    { title: "Output", items: ['bancario.relatorio'] },
  ],
  funcionalidades: {
    'bancario.conta': {
      tag_web: '02.02.00',
      label: "Contas",
      route: "/bco/conta",
      tela: '',  // TODO: codigo de menu do legado
      acoes: [
        { tag_web: '02.02.01', nome: "Visualizar / Acesso"  },
        { tag_web: '02.02.02', nome: "Pesquisar"  },
        { tag_web: '02.02.03', nome: "Novo"  },
        { tag_web: '02.02.04', nome: "Editar"  },
        { tag_web: '02.02.05', nome: "Excluir"  },
        { tag_web: '02.02.06', nome: "Imprimir Grid"  },
        { tag_web: '02.02.07', nome: "Exportar Dados"  },
      ],
    },
    'bancario.movimento': {
      tag_web: '02.05.00',
      label: "Extrato",
      route: "/bco/movimento",
      tela: '',  // TODO: codigo de menu do legado
      acoes: [
        { tag_web: '02.05.01', nome: "Visualizar / Acesso"  },
        { tag_web: '02.05.02', nome: "Pesquisar"  },
        { tag_web: '02.05.03', nome: "Novo"  },
        { tag_web: '02.05.04', nome: "Editar"  },
        { tag_web: '02.05.05', nome: "Excluir"  },
        { tag_web: '02.05.06', nome: "Imprimir Grid"  },
        { tag_web: '02.05.07', nome: "Exportar Dados"  },
        { tag_web: '02.05.08', nome: "Realizar Baixa"  },
        { tag_web: '02.05.09', nome: "Listar Despesas"  },
        { tag_web: '02.05.10', nome: "Listar Lançamentos"  },
      ],
    },
    'bancario.conta_aplicacao': {
      tag_web: '02.03.00',
      label: "Aplicação",
      route: "/bco/conta-aplicacao",
      tela: '',  // TODO: codigo de menu do legado
      acoes: [
        { tag_web: '02.03.01', nome: "Visualizar / Acesso"  },
        { tag_web: '02.03.02', nome: "Pesquisar"  },
        { tag_web: '02.03.03', nome: "Novo"  },
        { tag_web: '02.03.04', nome: "Editar"  },
        { tag_web: '02.03.05', nome: "Excluir"  },
        { tag_web: '02.03.06', nome: "Imprimir Grid"  },
        { tag_web: '02.03.07', nome: "Exportar Dados"  },
        { tag_web: '02.03.08', nome: "Exportar XLS"  },
        { tag_web: '02.03.09', nome: "Exportar XLSX"  },
        { tag_web: '02.03.10', nome: "Exportar CSV"  },
        { tag_web: '02.03.11', nome: "Exportar TXT"  },
      ],
    },
    'bancario.conciliacao': {
      tag_web: '02.07.00',
      label: "Conciliação",
      route: "/bco/conciliacao",
      tela: '',  // TODO: codigo de menu do legado
      acoes: [
        { tag_web: '02.07.01', nome: "Visualizar / Acesso"  },
        { tag_web: '02.07.02', nome: "Pesquisar"  },
        { tag_web: '02.07.03', nome: "Novo"  },
        { tag_web: '02.07.04', nome: "Editar"  },
        { tag_web: '02.07.05', nome: "Excluir"  },
        { tag_web: '02.07.06', nome: "Imprimir Grid"  },
        { tag_web: '02.07.07', nome: "Exportar Dados"  },
        { tag_web: '02.07.08', nome: "Gravar Conciliação"  },
        { tag_web: '02.07.09', nome: "Setar Conta Bancária"  },
        { tag_web: '02.07.10', nome: "Remover Conta Bancária"  },
      ],
    },
    'bancario.cheque': {
      tag_web: '02.06.00',
      label: "Cheques",
      route: "/bco/cheque",
      tela: '',  // TODO: codigo de menu do legado
      acoes: [
        { tag_web: '02.06.01', nome: "Visualizar / Acesso"  },
        { tag_web: '02.06.02', nome: "Pesquisar"  },
        { tag_web: '02.06.03', nome: "Novo"  },
        { tag_web: '02.06.04', nome: "Editar"  },
        { tag_web: '02.06.05', nome: "Excluir"  },
        { tag_web: '02.06.06', nome: "Imprimir Grid"  },
        { tag_web: '02.06.07', nome: "Exportar Dados"  },
        { tag_web: '02.06.08', nome: "Setar Conta Bancária"  },
        { tag_web: '02.06.09', nome: "Remover Conta Bancária"  },
      ],
    },
    'bancario.lote': {
      tag_web: '02.04.00',
      label: "Lotes",
      route: "/bco/lote",
      tela: '',  // TODO: codigo de menu do legado
      acoes: [
        { tag_web: '02.04.01', nome: "Visualizar / Acesso"  },
        { tag_web: '02.04.02', nome: "Pesquisar"  },
        { tag_web: '02.04.03', nome: "Novo"  },
        { tag_web: '02.04.04', nome: "Editar"  },
        { tag_web: '02.04.05', nome: "Excluir"  },
        { tag_web: '02.04.06', nome: "Imprimir Grid"  },
        { tag_web: '02.04.07', nome: "Exportar Dados"  },
      ],
    },
    'bancario.movimento_importa_extrato': {
      tag_web: '02.08.00',
      label: "Importação",
      route: "/bco/movimento-importa-extrato",
      tela: '',  // TODO: codigo de menu do legado
      acoes: [
        { tag_web: '02.08.01', nome: "Visualizar / Acesso"  },
        { tag_web: '02.08.02', nome: "Pesquisar"  },
        { tag_web: '02.08.03', nome: "Novo"  },
        { tag_web: '02.08.04', nome: "Editar"  },
        { tag_web: '02.08.05', nome: "Excluir"  },
        { tag_web: '02.08.06', nome: "Imprimir Grid"  },
        { tag_web: '02.08.07', nome: "Exportar Dados"  },
        { tag_web: '02.08.08', nome: "Importar Extrato"  },
        { tag_web: '02.08.09', nome: "Importar Extrato Aux."  },
        { tag_web: '02.08.10', nome: "Lançar Movimento"  },
        { tag_web: '02.08.11', nome: "Gravar Movimento (Partida Nova)"  },
        { tag_web: '02.08.12', nome: "Gravar Movimento (Partida Existente)"  },
        { tag_web: '02.08.13', nome: "Detalhar"  },
        { tag_web: '02.08.14', nome: "Voltar"  },
      ],
    },
    'bancario.dashboard': {
      tag_web: '02.01.00',
      label: "Dashboard",
      route: null,
      tela: '',  // TODO
    },
    'bancario.relatorio': {
      tag_web: '02.09.00',
      label: "Relatório",
      route: null,
      tela: '',  // TODO
    },
  },
};
