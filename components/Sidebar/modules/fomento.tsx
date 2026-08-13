import { Briefcase } from 'lucide-react';
import { MenuModule } from '../types';

export const fomento: MenuModule = {
  id: 'fomento',
  tag_web: '07.00.00',
  label: "Antecipação",
  icon: <Briefcase size={18} />,
  subsections: [
    { title: "Operações", items: ['antecipacao.dashboard'] },
    { title: "Antecipações", items: ['antecipacao.antecipacao_proprio', 'antecipacao.antecipacao_terceiro'] },
    { title: "Saídas e Impressão", items: ['antecipacao.relatorio'] },
  ],
  funcionalidades: {
    'antecipacao.dashboard': {
      tag_web: '07.01.00',
      label: "Dashboard",
      route: "/fom/dashboard",
      tela: '',  // TODO: codigo de menu do legado
      acoes: [
        { tag_web: '07.01.01', nome: "Visualizar / Acesso"  },
        { tag_web: '07.01.02', nome: "Pesquisar"  },
        { tag_web: '07.01.03', nome: "Novo"  },
        { tag_web: '07.01.04', nome: "Editar"  },
        { tag_web: '07.01.05', nome: "Excluir"  },
        { tag_web: '07.01.06', nome: "Imprimir Grid"  },
        { tag_web: '07.01.07', nome: "Exportar Dados"  },
      ],
    },
    'antecipacao.relatorio': {
      tag_web: '07.04.00',
      label: "Relatório ",
      route: "/fom/relatorio",
      tela: '',  // TODO: codigo de menu do legado
      acoes: [
        { tag_web: '07.04.01', nome: "Visualizar / Acesso"  },
        { tag_web: '07.04.02', nome: "Pesquisar"  },
        { tag_web: '07.04.03', nome: "Novo"  },
        { tag_web: '07.04.04', nome: "Editar"  },
        { tag_web: '07.04.05', nome: "Excluir"  },
        { tag_web: '07.04.06', nome: "Imprimir Grid"  },
        { tag_web: '07.04.07', nome: "Exportar Dados"  },
      ],
    },
    'antecipacao.antecipacao_proprio': {
      tag_web: '07.02.00',
      label: "Antecipação Rec. Próprio",
      route: "/fom/antecipacao-proprio",
      tela: '',  // TODO: codigo de menu do legado
      acoes: [
        { tag_web: '07.02.01', nome: "Visualizar / Acesso"  },
        { tag_web: '07.02.02', nome: "Pesquisar"  },
        { tag_web: '07.02.03', nome: "Novo"  },
        { tag_web: '07.02.04', nome: "Editar"  },
        { tag_web: '07.02.05', nome: "Excluir"  },
        { tag_web: '07.02.06', nome: "Imprimir Grid"  },
        { tag_web: '07.02.07', nome: "Exportar Dados"  },
      ],
    },
    'antecipacao.antecipacao_terceiro': {
      tag_web: '07.03.00',
      label: "Antecipação Rec. Terceiro",
      route: "/fom/antecipacao-terceiro",
      tela: '',  // TODO: codigo de menu do legado
      acoes: [
        { tag_web: '07.03.01', nome: "Visualizar / Acesso"  },
        { tag_web: '07.03.02', nome: "Pesquisar"  },
        { tag_web: '07.03.03', nome: "Novo"  },
        { tag_web: '07.03.04', nome: "Editar"  },
        { tag_web: '07.03.05', nome: "Excluir"  },
        { tag_web: '07.03.06', nome: "Imprimir Grid"  },
        { tag_web: '07.03.07', nome: "Exportar Dados"  },
      ],
    },
  },
};
