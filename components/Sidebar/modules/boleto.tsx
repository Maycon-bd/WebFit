import { Barcode } from 'lucide-react';
import { MenuModule } from '../types';

export const boleto: MenuModule = {
  id: 'boleto',
  tag_web: '09.00.00',
  label: "Boleto",
  icon: <Barcode size={18} />,
  subsections: [
    { title: "Gerencial", items: ['boleto.dashboard'] },
    { title: "Output", items: ['boleto.relatorio'] },
  ],
  funcionalidades: {
    'boleto.dashboard': {
      tag_web: '09.01.00',
      label: "Dashboard Boleto",
      route: "/boleto/dashboard",
      tela: '',  // TODO: codigo de menu do legado
      acoes: [
        { tag_web: '09.01.01', nome: "Visualizar / Acesso"  },
        { tag_web: '09.01.02', nome: "Pesquisar"  },
        { tag_web: '09.01.03', nome: "Novo"  },
        { tag_web: '09.01.04', nome: "Editar"  },
        { tag_web: '09.01.05', nome: "Excluir"  },
        { tag_web: '09.01.06', nome: "Imprimir Grid"  },
        { tag_web: '09.01.07', nome: "Exportar Dados"  },
      ],
    },
    'boleto.relatorio': {
      tag_web: '09.02.00',
      label: "Relatório Boleto",
      route: "/boleto/relatorio",
      tela: '',  // TODO: codigo de menu do legado
      acoes: [
        { tag_web: '09.02.01', nome: "Visualizar / Acesso"  },
        { tag_web: '09.02.02', nome: "Pesquisar"  },
        { tag_web: '09.02.03', nome: "Novo"  },
        { tag_web: '09.02.04', nome: "Editar"  },
        { tag_web: '09.02.05', nome: "Excluir"  },
        { tag_web: '09.02.06', nome: "Imprimir Grid"  },
        { tag_web: '09.02.07', nome: "Exportar Dados"  },
      ],
    },
  },
};
