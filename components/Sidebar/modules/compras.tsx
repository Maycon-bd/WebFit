import { ShoppingCart } from 'lucide-react';
import { MenuModule } from '../types';

export const compras: MenuModule = {
  id: 'purchase',
  tag_web: '03.00.00',
  label: "Compras",
  icon: <ShoppingCart size={18} />,
  subsections: [
    { title: "Principal", items: ['compras.dashboard'] },
    { title: "Gestão de Suprimentos", items: ['compras.requisicao', 'compras.cotacao', 'compras.pedido_compra'] },
    { title: "Cadastros", items: ['compras.cfop', 'compras.unidade_medida', 'compras.tipo_item', 'compras.marca', 'compras.grupo_produtos', 'compras.produtos', 'compras.tipo_documento', 'compras.forma_pagamento'] },
    { title: "Output", items: ['compras.relatorio'] },
  ],
  funcionalidades: {
    'compras.cfop': {
      tag_web: '03.02.00',
      label: "Cfop",
      route: "/cpr/cfop",
      tela: '',  // TODO: codigo de menu do legado
      acoes: [
        { tag_web: '03.02.01', nome: "Visualizar / Acesso"  },
        { tag_web: '03.02.02', nome: "Pesquisar"  },
        { tag_web: '03.02.03', nome: "Novo"  },
        { tag_web: '03.02.04', nome: "Editar"  },
        { tag_web: '03.02.05', nome: "Excluir"  },
        { tag_web: '03.02.06', nome: "Imprimir Grid"  },
        { tag_web: '03.02.07', nome: "Exportar Dados"  },
      ],
    },
    'compras.unidade_medida': {
      tag_web: '03.03.00',
      label: "Unidade de Medida",
      route: "/cpr/unidade-medida",
      tela: '',  // TODO: codigo de menu do legado
      acoes: [
        { tag_web: '03.03.01', nome: "Visualizar / Acesso"  },
        { tag_web: '03.03.02', nome: "Pesquisar"  },
        { tag_web: '03.03.03', nome: "Novo"  },
        { tag_web: '03.03.04', nome: "Editar"  },
        { tag_web: '03.03.05', nome: "Excluir"  },
        { tag_web: '03.03.06', nome: "Imprimir Grid"  },
        { tag_web: '03.03.07', nome: "Exportar Dados"  },
      ],
    },
    'compras.tipo_item': {
      tag_web: '03.04.00',
      label: "Tipo de Item",
      route: "/cpr/tipo-item",
      tela: '',  // TODO: codigo de menu do legado
      acoes: [
        { tag_web: '03.04.01', nome: "Visualizar / Acesso"  },
        { tag_web: '03.04.02', nome: "Pesquisar"  },
        { tag_web: '03.04.03', nome: "Novo"  },
        { tag_web: '03.04.04', nome: "Editar"  },
        { tag_web: '03.04.05', nome: "Excluir"  },
        { tag_web: '03.04.06', nome: "Imprimir Grid"  },
        { tag_web: '03.04.07', nome: "Exportar Dados"  },
      ],
    },
    'compras.marca': {
      tag_web: '03.05.00',
      label: "Marca",
      route: "/cpr/marca",
      tela: '',  // TODO: codigo de menu do legado
      acoes: [
        { tag_web: '03.05.01', nome: "Visualizar / Acesso"  },
        { tag_web: '03.05.02', nome: "Pesquisar"  },
        { tag_web: '03.05.03', nome: "Novo"  },
        { tag_web: '03.05.04', nome: "Editar"  },
        { tag_web: '03.05.05', nome: "Excluir"  },
        { tag_web: '03.05.06', nome: "Imprimir Grid"  },
        { tag_web: '03.05.07', nome: "Exportar Dados"  },
      ],
    },
    'compras.grupo_produtos': {
      tag_web: '03.06.00',
      label: "Grupo de Produtos",
      route: "/cpr/grupo-produtos",
      tela: '',  // TODO: codigo de menu do legado
      acoes: [
        { tag_web: '03.06.01', nome: "Visualizar / Acesso"  },
        { tag_web: '03.06.02', nome: "Pesquisar"  },
        { tag_web: '03.06.03', nome: "Novo"  },
        { tag_web: '03.06.04', nome: "Editar"  },
        { tag_web: '03.06.05', nome: "Excluir"  },
        { tag_web: '03.06.06', nome: "Imprimir Grid"  },
        { tag_web: '03.06.07', nome: "Exportar Dados"  },
      ],
    },
    'compras.produtos': {
      tag_web: '03.07.00',
      label: "Produtos",
      route: "/cpr/produtos",
      tela: '',  // TODO: codigo de menu do legado
      acoes: [
        { tag_web: '03.07.01', nome: "Visualizar / Acesso"  },
        { tag_web: '03.07.02', nome: "Pesquisar"  },
        { tag_web: '03.07.03', nome: "Novo"  },
        { tag_web: '03.07.04', nome: "Editar"  },
        { tag_web: '03.07.05', nome: "Excluir"  },
        { tag_web: '03.07.06', nome: "Imprimir Grid"  },
        { tag_web: '03.07.07', nome: "Exportar Dados"  },
      ],
    },
    'compras.tipo_documento': {
      tag_web: '03.08.00',
      label: "Tipo de Documento",
      route: "/cpr/tipo-documento",
      tela: '',  // TODO: codigo de menu do legado
      acoes: [
        { tag_web: '03.08.01', nome: "Visualizar / Acesso"  },
        { tag_web: '03.08.02', nome: "Pesquisar"  },
        { tag_web: '03.08.03', nome: "Novo"  },
        { tag_web: '03.08.04', nome: "Editar"  },
        { tag_web: '03.08.05', nome: "Excluir"  },
        { tag_web: '03.08.06', nome: "Imprimir Grid"  },
        { tag_web: '03.08.07', nome: "Exportar Dados"  },
      ],
    },

    'compras.forma_pagamento': {
      tag_web: '03.11.00',
      label: "Forma de Pagamento",
      route: "/cpr/forma-pagamento",
      tela: '',  // TODO: codigo de menu do legado
      acoes: [
        { tag_web: '03.11.01', nome: "Visualizar / Acesso"  },
        { tag_web: '03.11.02', nome: "Pesquisar"  },
        { tag_web: '03.11.03', nome: "Novo"  },
        { tag_web: '03.11.04', nome: "Editar"  },
        { tag_web: '03.11.05', nome: "Excluir"  },
        { tag_web: '03.11.06', nome: "Imprimir Grid"  },
        { tag_web: '03.11.07', nome: "Exportar Dados"  },
      ],
    },
    'compras.requisicao': {
      tag_web: '03.12.00',
      label: "Requisição",
      route: "/cpr/requisicao",
      tela: '',  // TODO: codigo de menu do legado
      acoes: [
        { tag_web: '03.12.01', nome: "Visualizar / Acesso" },
        { tag_web: '03.12.02', nome: "Pesquisar" },
        { tag_web: '03.12.03', nome: "Novo" },
        { tag_web: '03.12.04', nome: "Editar" },
        { tag_web: '03.12.05', nome: "Solicitar Aprovação" },
        { tag_web: '03.12.06', nome: "Confirmar Solicitação" },
        { tag_web: '03.12.07', nome: "Aprovar" },
        { tag_web: '03.12.08', nome: "Editar Autorizante" },
        { tag_web: '03.12.09', nome: "Excluir" },
        { tag_web: '03.12.10', nome: "Imprimir" },
        { tag_web: '03.12.11', nome: "Exportar" },
      ],
    },
    'compras.cotacao': {
      tag_web: '03.13.00',
      label: "Cotação",
      route: "/cpr/cotacao",
      tela: '',  // TODO: codigo de menu do legado
      acoes: [
        { tag_web: '03.13.01', nome: "Visualizar Todos Dep." },
        { tag_web: '03.13.02', nome: "Pesquisar" },
        { tag_web: '03.13.03', nome: "Novo" },
        { tag_web: '03.13.04', nome: "Editar" },
        { tag_web: '03.13.05', nome: "Aprovar" },
        { tag_web: '03.13.06', nome: "Autorização de Cotação" },
        { tag_web: '03.13.07', nome: "Importar Cotação" },
        { tag_web: '03.13.08', nome: "Exportar Cotação" },
        { tag_web: '03.13.09', nome: "Imprimir Fornecedor" },
        { tag_web: '03.13.10', nome: "Imprimir Grid" },
        { tag_web: '03.13.11', nome: "Excluir Fornecedor" },
        { tag_web: '03.13.12', nome: "Novo Fornecedor" },
        { tag_web: '03.13.13', nome: "Visualizar" },
        { tag_web: '03.13.14', nome: "Excluir" },
        { tag_web: '03.13.15', nome: "Exportar" },
      ],
    },
    'compras.pedido_compra': {
      tag_web: '03.14.00',
      label: "Pedido de Compras",
      route: "/cpr/pedido-compra",
      tela: '',  // TODO: codigo de menu do legado
      acoes: [
        { tag_web: '03.14.01', nome: "Novo" },
        { tag_web: '03.14.02', nome: "Pesquisar" },
        { tag_web: '03.14.03', nome: "Excluir" },
        { tag_web: '03.14.04', nome: "Enviar" },
        { tag_web: '03.14.05', nome: "Salvar" },
        { tag_web: '03.14.06', nome: "Imprimir" },
        { tag_web: '03.14.07', nome: "Voltar" },
        { tag_web: '03.14.08', nome: "Exportar PDF" },
        { tag_web: '03.14.09', nome: "Visualizar" },
        { tag_web: '03.14.10', nome: "Editar" },
        { tag_web: '03.14.11', nome: "Exportar" },
      ],
    },
    'compras.dashboard': {
      tag_web: '03.01.00',
      label: "Dashboard",
      route: null,
      tela: '',  // TODO
    },
    'compras.relatorio': {
      label: "Relatório",
      route: null,
      tela: '',  // TODO
    },
  },
};
