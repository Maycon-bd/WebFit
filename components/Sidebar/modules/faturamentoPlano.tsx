import { ScrollText } from 'lucide-react';
import { MenuModule } from '../types';

export const faturamentoPlano: MenuModule = {
  id: 'fatPlano',
  tag_web: '10.00.00',
  label: "Faturamento de Plano",
  icon: <ScrollText size={18} />,
  subsections: [
    { title: "Gerencial", items: ['faturamento_de_plano.dashboard'] },
    { title: "Output", items: ['faturamento_de_plano.relatorio'] },
  ],
  funcionalidades: {
    'faturamento_de_plano.dashboard': {
      tag_web: '10.01.00',
      label: "Dashboard FatPlano",
      route: "/fat-plano/dashboard",
      tela: '',  // TODO: codigo de menu do legado
      acoes: [
        { tag_web: '10.01.01', nome: "Visualizar / Acesso"  },
        { tag_web: '10.01.02', nome: "Pesquisar"  },
        { tag_web: '10.01.03', nome: "Novo"  },
        { tag_web: '10.01.04', nome: "Editar"  },
        { tag_web: '10.01.05', nome: "Excluir"  },
        { tag_web: '10.01.06', nome: "Imprimir Grid"  },
        { tag_web: '10.01.07', nome: "Exportar Dados"  },
      ],
    },
    'faturamento_de_plano.relatorio': {
      tag_web: '10.02.00',
      label: "Relatório FatPlano",
      route: "/fat-plano/relatorio",
      tela: '',  // TODO: codigo de menu do legado
      acoes: [
        { tag_web: '10.02.01', nome: "Visualizar / Acesso"  },
        { tag_web: '10.02.02', nome: "Pesquisar"  },
        { tag_web: '10.02.03', nome: "Novo"  },
        { tag_web: '10.02.04', nome: "Editar"  },
        { tag_web: '10.02.05', nome: "Excluir"  },
        { tag_web: '10.02.06', nome: "Imprimir Grid"  },
        { tag_web: '10.02.07', nome: "Exportar Dados"  },
      ],
    },
  },
};
