import { FileSpreadsheet } from 'lucide-react';
import { MenuModule } from '../types';

export const faturamentoNf: MenuModule = {
  id: 'fatNf',
  tag_web: '11.00.00',
  label: "Faturamento de NF's",
  icon: <FileSpreadsheet size={18} />,
  subsections: [
    { title: "Gerencial", items: ['faturamento_de_nf_s.dashboard'] },
    { title: "Output", items: ['faturamento_de_nf_s.relatorio'] },
  ],
  funcionalidades: {
    'faturamento_de_nf_s.dashboard': {
      tag_web: '11.01.00',
      label: "Dashboard FatNf",
      route: "/fat-nf/dashboard",
      tela: '',  // TODO: codigo de menu do legado
      acoes: [
        { tag_web: '11.01.01', nome: "Visualizar / Acesso"  },
        { tag_web: '11.01.02', nome: "Pesquisar"  },
        { tag_web: '11.01.03', nome: "Novo"  },
        { tag_web: '11.01.04', nome: "Editar"  },
        { tag_web: '11.01.05', nome: "Excluir"  },
        { tag_web: '11.01.06', nome: "Imprimir Grid"  },
        { tag_web: '11.01.07', nome: "Exportar Dados"  },
      ],
    },
    'faturamento_de_nf_s.relatorio': {
      tag_web: '11.02.00',
      label: "Relatório FatNf",
      route: "/fat-nf/relatorio",
      tela: '',  // TODO: codigo de menu do legado
      acoes: [
        { tag_web: '11.02.01', nome: "Visualizar / Acesso"  },
        { tag_web: '11.02.02', nome: "Pesquisar"  },
        { tag_web: '11.02.03', nome: "Novo"  },
        { tag_web: '11.02.04', nome: "Editar"  },
        { tag_web: '11.02.05', nome: "Excluir"  },
        { tag_web: '11.02.06', nome: "Imprimir Grid"  },
        { tag_web: '11.02.07', nome: "Exportar Dados"  },
      ],
    },
  },
};
