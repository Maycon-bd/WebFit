import { Calculator } from 'lucide-react';
import { MenuModule } from '../types';

export const contabilidade: MenuModule = {
  id: 'accounting',
  tag_web: '13.00.00',
  label: "Contabilidade",
  icon: <Calculator size={18} />,
  subsections: [
    { title: "Dashboard", items: ['contabilidade.dashboard'] },
    { title: "Cadastros", items: ['contabilidade.tipo_imposto', 'contabilidade.tabela_impostos'] },
    { title: "Caixa", items: ['contabilidade.movimento_caixa', 'contabilidade.apuracao_impostos'] },
    { title: "Relatórios", items: ['contabilidade.relatorio_caixa', 'contabilidade.balancete'] },
  ],
  funcionalidades: {
    'contabilidade.dashboard': {
      tag_web: '13.01.00',
      label: "Dashboard",
      route: "/contabilidade/dashboard",
      tela: '',
      componente: '13.01.00',
      acoes: [
        { tag: null, tag_web: '13.01.01', nome: "Visualizar / Acesso" },
      ],
    },
    'contabilidade.apuracao_impostos': {
      tag_web: '13.07.00',
      label: "Apuração PIS/COFINS",
      route: "/contabilidade/apuracao-impostos",
      tela: 'sisfac/contabil/06_02_14',
      componente: '13.07.00',
      acoes: [
        { tag_web: '13.07.01', nome: "Visualizar / Acesso" },
        { tag_web: '13.07.02', nome: "Gerar Relatório" },
        { tag_web: '13.07.03', nome: "Lançar no Caixa" },
      ],
    },
    'contabilidade.relatorio_caixa': {
      tag_web: '13.08.00',
      label: "Relatório",
      route: "/contabilidade/relatorio-caixa",
      tela: 'sisfac/contabil/07_01',
      componente: '13.08.00',
      acoes: [
        { tag_web: '13.08.01', nome: "Visualizar / Acesso" },
        { tag_web: '13.08.02', nome: "Gerar Relatório" }
      ],
    },
    'contabilidade.movimento_caixa': {
      tag_web: '13.06.00',
      label: "Movimentos do Caixa",
      route: "/contabilidade/movimento-caixa",
      tela: 'sisfac/contabil/03_12',
      componente: '03.12.00',
      acoes: [
        { tag_web: '13.06.01', nome: "Visualizar / Acesso" },
        { tag_web: '13.06.02', nome: "Pesquisar" },
        { tag_web: '13.06.03', nome: "Novo" },
        { tag_web: '13.06.04', nome: "Editar" },
        { tag_web: '13.06.05', nome: "Excluir" },
        { tag_web: '13.06.06', nome: "Imprimir Relatório" }
      ],
    },
    'contabilidade.balancete': {
      tag_web: '13.09.00',
      label: "Balancete",
      route: null,
      tela: '',  // TODO: codigo de menu do legado
      componente: 'FORM_CTB_BALANCETE',
    },

    'contabilidade.tipo_imposto': {
      tag_web: '13.04.00',
      label: "Tipo de Imposto",
      route: "/contabilidade/tipo-imposto",
      tela: '',
      acoes: [
        { tag_web: '13.04.01', nome: "Visualizar / Acesso" },
        { tag_web: '13.04.02', nome: "Pesquisar" },
        { tag_web: '13.04.03', nome: "Novo" },
        { tag_web: '13.04.04', nome: "Editar" },
        { tag_web: '13.04.05', nome: "Excluir" },
        { tag_web: '13.04.06', nome: "Imprimir Grid" },
        { tag_web: '13.04.07', nome: "Exportar Dados" },
      ],
    },
    'contabilidade.tabela_impostos': {
      tag_web: '13.05.00',
      label: "Tabela de Impostos",
      route: "/contabilidade/tabela-impostos",
      tela: '',
      acoes: [
        { tag_web: '13.05.01', nome: "Visualizar / Acesso" },
        { tag_web: '13.05.02', nome: "Pesquisar" },
        { tag_web: '13.05.03', nome: "Novo" },
        { tag_web: '13.05.04', nome: "Editar" },
        { tag_web: '13.05.05', nome: "Excluir" },
        { tag_web: '13.05.06', nome: "Imprimir Grid" },
        { tag_web: '13.05.07', nome: "Exportar Dados" },
        { tag_web: '13.05.08', nome: "Exportar XLS" },
        { tag_web: '13.05.09', nome: "Exportar XLSX" },
        { tag_web: '13.05.10', nome: "Exportar CSV" },
        { tag_web: '13.05.11', nome: "Exportar TXT" },
      ],
    },
  },
};
