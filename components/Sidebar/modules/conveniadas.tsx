import { Handshake } from 'lucide-react';
import { MenuModule } from '../types';

export const conveniadas: MenuModule = {
  id: 'conveniadas',
  tag_web: '06.00.00',
  label: "Conveniadas",
  icon: <Handshake size={18} />,
  subsections: [
    { title: "Operações", items: ['conveniadas.dashboard'] },
    { title: "Financeiro", items: ['conveniadas.pagamentos', 'conveniadas.ordem_pagamento'] },
    { title: "Saídas e Impressão", items: ['conveniadas.relatorio'] },
  ],
  funcionalidades: {
    'conveniadas.dashboard': {
      tag_web: '06.01.00',
      label: "Dashboard  ",
      route: "/conv/dashboard",
      tela: '',  // TODO: codigo de menu do legado
      acoes: [
        { tag_web: '06.01.01', nome: "Visualizar / Acesso"  },
        { tag_web: '06.01.02', nome: "Pesquisar"  },
        { tag_web: '06.01.03', nome: "Novo"  },
        { tag_web: '06.01.04', nome: "Editar"  },
        { tag_web: '06.01.05', nome: "Excluir"  },
        { tag_web: '06.01.06', nome: "Imprimir Grid"  },
        { tag_web: '06.01.07', nome: "Exportar Dados"  },
      ],
    },
    'conveniadas.relatorio': {
      tag_web: '06.04.00',
      label: "Relatório  ",
      route: "/conv/relatorio",
      tela: '',  // TODO: codigo de menu do legado
      acoes: [
        { tag_web: '06.04.01', nome: "Visualizar / Acesso"  },
        { tag_web: '06.04.02', nome: "Pesquisar"  },
        { tag_web: '06.04.03', nome: "Gerar e Imprimir"  },
        { tag_web: '06.04.04', nome: "Rel. Conveniadas a Pagar/Pagas"  },
        { tag_web: '06.04.05', nome: "Rel. Pagamento Financeiro"  },
        { tag_web: '06.04.06', nome: "Rel. Ordem de Pagamento"  },
        { tag_web: '06.04.07', nome: "Rel. Posição no Dia"  },
      ],
    },
    'conveniadas.ordem_pagamento': {
      tag_web: '06.03.00',
      label: "Ordem Pagamento",
      route: "/conv/ordem-pagamento",
      tela: '',
      acoes: [
        { tag_web: '06.03.01', nome: "Visualizar / Acesso"  },
        { tag_web: '06.03.02', nome: "Pesquisar Ordens"  },
        { tag_web: '06.03.03', nome: "Editar"  },
        { tag_web: '06.03.04', nome: "Exportar Dados"  },
        { tag_web: '06.03.05', nome: "Exportar CSV"  },
        { tag_web: '06.03.06', nome: "Exportar XLS"  },
        { tag_web: '06.03.07', nome: "Exportar XLSX"  },
        { tag_web: '06.03.08', nome: "Imprimir Grid"  },
        { tag_web: '06.03.09', nome: "Setar Meios Selecionados"  },
        { tag_web: '06.03.10', nome: "Setar Contas Selecionadas"  },
        { tag_web: '06.03.11', nome: "Limpar Filtros de Pesquisa"  },
        { tag_web: '06.03.12', nome: "Criar"  },
        { tag_web: '06.03.13', nome: "Excluir"  },
        { tag_web: '06.03.14', nome: "Pesquisar"  },
      ],
    },
    'conveniadas.pagamentos': {
      tag_web: '06.02.00',
      label: "Pagamentos",
      route: "/cpr/pagamento-conveniada",
      tela: '',
      acoes: [
        { tag_web: '06.02.01', nome: "Visualizar / Acesso"  },
        { tag_web: '06.02.02', nome: "Pesquisar"  },
        { tag_web: '06.02.03', nome: "Efetuar Baixa"  },
        { tag_web: '06.02.04', nome: "Editar"  },
        { tag_web: '06.02.05', nome: "Excluir"  },
        { tag_web: '06.02.06', nome: "Imprimir"  },
        { tag_web: '06.02.07', nome: "Exportar Dados"  },
      ],
    },
  },
};
