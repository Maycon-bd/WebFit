import { Wallet } from 'lucide-react';
import { MenuModule } from '../types';

export const financeiro: MenuModule = {
  id: 'finance',
  tag_web: '05.00.00',
  label: "Financeiro",
  icon: <Wallet size={18} />,
  subsections: [
    { title: "Principal", items: ['financeiro.dashboard'] },
    { title: "Gestão Financeira", items: ['financeiro.despesas', 'financeiro.pagamento_de_fornecedor_cartao', 'financeiro.baixa_despesa'] },
    { title: "Output", items: ['financeiro.relatorio'] },
  ],
  funcionalidades: {
    'financeiro.despesas': {
      tag_web: '05.02.00',
      label: "Lançamento de Despesa",
      route: "/fin/despesas",
      tela: '',  // TODO: codigo de menu do legado
      acoes: [
        { tag_web: '05.02.01', nome: "Visualizar / Acesso" },
        { tag_web: '05.02.02', nome: "Novo" },
        { tag_web: '05.02.03', nome: "Editar" },
        { tag_web: '05.02.04', nome: "Excluir" },
        { tag_web: '05.02.05', nome: "Pesquisar" },
        { tag_web: '05.02.06', nome: "Baixar Despesas" },
        { tag_web: '05.02.07', nome: "Confirmar Baixa" },
        { tag_web: '05.02.08', nome: "Liberar" },
        { tag_web: '05.02.09', nome: "Setar Conta Bancaria" },
        { tag_web: '05.02.10', nome: "Remover Conta Bancaria" },
        { tag_web: '05.02.11', nome: "Imprimir Grid" },
        { tag_web: '05.02.12', nome: "Exportar Dados" },
        { tag_web: '05.02.13', nome: "Voltar" },
      ],
    },
    'financeiro.dashboard': {
      label: "Dashboard",
      route: null,
      tela: '',  // TODO
    },
    'financeiro.pagamento_de_fornecedor_cartao': {
      tag_web: '05.03.00',
      label: "Baixa de Fornecedor / Cartão",
      route: "/fin/pagamento-fornecedor-cartao",
      tela: 'SAV.View.Fin.Pagamento.Fornecedor.Cartao',
      acoes: [
        { tag_web: '05.03.01', nome: "Visualizar / Acesso" },
        { tag_web: '05.03.02', nome: "Pesquisar" },
        { tag_web: '05.03.03', nome: "Baixar Títulos" },
        { tag_web: '05.03.04', nome: "Voltar" },
      ],
    },

    'financeiro.relatorio': {
      tag_web: '05.06.00',
      label: "Relatório",
      route: "/fin/relatorio",
      tela: 'TForm_Fin_Despesa_Imprimir_Contas_Pagas_Dt_Baixa',
      componente: '05.06.00',
      acoes: [
        { tag_web: '05.06.01', nome: "Visualizar / Acesso" },
        { tag_web: '05.06.02', nome: "Pesquisar / Filtrar" },
        { tag_web: '05.06.03', nome: "Gerar e Imprimir PDF" },
        { tag_web: '05.06.04', nome: "Rel. Contas Pagas (Data de Baixa)" },
        { tag_web: '05.06.05', nome: "Rel. Contas a Pagar (Geral)" },
      ],
    },
    'financeiro.baixa_despesa': {
      tag_web: '05.07.00',
      label: "Baixa de Despesa",
      route: "/fin/baixa-despesa",
      tela: 'SAV.View.Fin.Despesa',
      acoes: [
        { tag_web: '05.07.01', nome: "Visualizar / Acesso" },
        { tag_web: '05.07.02', nome: "Baixar Despesas" },
        { tag_web: '05.07.03', nome: "Confirmar Baixa" },
        { tag_web: '05.07.04', nome: "Setar Conta Bancária" },
        { tag_web: '05.07.05', nome: "Remover Conta Bancária" },
        { tag_web: '05.07.06', nome: "Voltar" },
      ],
    },
  },
};
