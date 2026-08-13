import { HandCoins } from 'lucide-react';
import { MenuModule } from '../types';

export const recebimentoCliente: MenuModule = {
  id: 'recCliente',
  tag_web: '08.00.00',
  label: "Recebimento de Clientes",
  icon: <HandCoins size={18} />,
  subsections: [
    { title: "Gerencial", items: ['recebimento_de_clientes.dashboard'] },
    { title: "Output", items: ['recebimento_de_clientes.relatorio'] },
  ],
  funcionalidades: {
    'recebimento_de_clientes.dashboard': {
      tag_web: '08.01.00',
      label: "Dashboard RecCliente",
      route: "/rec-cliente/dashboard",
      tela: '',  // TODO: codigo de menu do legado
      acoes: [
        { tag_web: '08.01.01', nome: "Visualizar / Acesso"  },
        { tag_web: '08.01.02', nome: "Pesquisar"  },
        { tag_web: '08.01.03', nome: "Novo"  },
        { tag_web: '08.01.04', nome: "Editar"  },
        { tag_web: '08.01.05', nome: "Excluir"  },
        { tag_web: '08.01.06', nome: "Imprimir Grid"  },
        { tag_web: '08.01.07', nome: "Exportar Dados"  },
      ],
    },
    'recebimento_de_clientes.relatorio': {
      tag_web: '08.02.00',
      label: "Relatório RecCliente",
      route: "/rec-cliente/relatorio",
      tela: '',  // TODO: codigo de menu do legado
      acoes: [
        { tag_web: '08.02.01', nome: "Visualizar / Acesso"  },
        { tag_web: '08.02.02', nome: "Pesquisar"  },
        { tag_web: '08.02.03', nome: "Novo"  },
        { tag_web: '08.02.04', nome: "Editar"  },
        { tag_web: '08.02.05', nome: "Excluir"  },
        { tag_web: '08.02.06', nome: "Imprimir Grid"  },
        { tag_web: '08.02.07', nome: "Exportar Dados"  },
      ],
    },
  },
};
