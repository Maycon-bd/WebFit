import { BadgePercent } from 'lucide-react';
import { MenuModule } from '../types';

export const comissao: MenuModule = {
  id: 'comissao',
  tag_web: '12.00.00',
  label: "Comissão",
  icon: <BadgePercent size={18} />,
  subsections: [
    { title: "Gerencial", items: ['comissao.dashboard'] },
    { title: "Output", items: ['comissao.relatorio'] },
  ],
  funcionalidades: {
    'comissao.dashboard': {
      tag_web: '12.01.00',
      label: "Dashboard Comissão",
      route: "/comissao/dashboard",
      tela: '',  // TODO: codigo de menu do legado
      acoes: [
        { tag_web: '12.01.01', nome: "Visualizar / Acesso"  },
        { tag_web: '12.01.02', nome: "Pesquisar"  },
        { tag_web: '12.01.03', nome: "Novo"  },
        { tag_web: '12.01.04', nome: "Editar"  },
        { tag_web: '12.01.05', nome: "Excluir"  },
        { tag_web: '12.01.06', nome: "Imprimir Grid"  },
        { tag_web: '12.01.07', nome: "Exportar Dados"  },
      ],
    },
    'comissao.relatorio': {
      tag_web: '12.02.00',
      label: "Relatório Comissão",
      route: "/comissao/relatorio",
      tela: '',  // TODO: codigo de menu do legado
      acoes: [
        { tag_web: '12.02.01', nome: "Visualizar / Acesso"  },
        { tag_web: '12.02.02', nome: "Pesquisar"  },
        { tag_web: '12.02.03', nome: "Novo"  },
        { tag_web: '12.02.04', nome: "Editar"  },
        { tag_web: '12.02.05', nome: "Excluir"  },
        { tag_web: '12.02.06', nome: "Imprimir Grid"  },
        { tag_web: '12.02.07', nome: "Exportar Dados"  },
      ],
    },
  },
};
