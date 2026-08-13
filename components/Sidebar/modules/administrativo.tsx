import { Settings } from 'lucide-react';
import { MenuModule } from '../types';

export const administrativo: MenuModule = {
  id: 'admin',
  tag_web: '01.00.00',
  label: "Administrativo",
  icon: <Settings size={18} />,
  subsections: [
    { title: "Principal", items: ['administrativo.dashboard'] },
    { title: "Cadastros", items: ['administrativo.empresa', 'administrativo.fornecedor', 'administrativo.regiao', 'administrativo.cidade', 'administrativo.departamento', 'administrativo.unidresp'] },
    { title: "Segurança / Acesso", items: ['administrativo.usuario', 'administrativo.perfil', 'administrativo.funcao'] },
  ],
  funcionalidades: {
    'administrativo.empresa': {
      tag_web: '01.02.00',
      label: "Empresa",
      route: "/administrativo/empresa",
      tela: '',  // TODO: codigo de menu do legado
      acoes: [
        { tag_web: '01.02.01', nome: "Visualizar / Acesso" },
        { tag_web: '01.02.02', nome: "Pesquisar" },
        { tag_web: '01.02.03', nome: "Novo" },
        { tag_web: '01.02.04', nome: "Editar" },
        { tag_web: '01.02.05', nome: "Excluir" },
        { tag_web: '01.02.06', nome: "Imprimir Grid" },
        { tag_web: '01.02.07', nome: "Exportar Dados" },
      ],
    },
    'administrativo.fornecedor': {
      tag_web: '01.03.00',
      label: "Fornecedor",
      route: "/administrativo/fornecedor",
      tela: '',  // TODO: codigo de menu do legado
      acoes: [
        { tag_web: '01.03.01', nome: "Visualizar / Acesso" },
        { tag_web: '01.03.02', nome: "Pesquisar" },
        { tag_web: '01.03.03', nome: "Novo" },
        { tag_web: '01.03.04', nome: "Editar" },
        { tag_web: '01.03.05', nome: "Excluir" },
        { tag_web: '01.03.06', nome: "Imprimir Grid" },
        { tag_web: '01.03.07', nome: "Exportar Dados" },
      ],
    },
    'administrativo.fornecedor_contas': {
      tag_web: '01.19.00',
      label: "Contas de Fornecedores",
      route: "/administrativo/fornecedor-contas",
      tela: '',  // TODO: codigo de menu do legado
      acoes: [
        { tag_web: '01.19.01', nome: "Visualizar / Acesso" },
        { tag_web: '01.19.02', nome: "Pesquisar" },
        { tag_web: '01.19.03', nome: "Novo" },
        { tag_web: '01.19.04', nome: "Editar" },
        { tag_web: '01.19.05', nome: "Excluir" },
        { tag_web: '01.19.06', nome: "Imprimir Grid" },
        { tag_web: '01.19.07', nome: "Exportar Dados" },
      ],
    },
    'administrativo.cidade': {
      tag_web: '01.05.00',
      label: "Cidade",
      route: "/adm/cidade",
      tela: '',  // TODO: codigo de menu do legado
      acoes: [
        { tag_web: '01.05.01', nome: "Visualizar / Acesso" },
        { tag_web: '01.05.02', nome: "Pesquisar" },
        { tag_web: '01.05.03', nome: "Novo" },
        { tag_web: '01.05.04', nome: "Editar" },
        { tag_web: '01.05.05', nome: "Excluir" },
        { tag_web: '01.05.06', nome: "Imprimir Grid" },
        { tag_web: '01.05.07', nome: "Exportar Dados" },
      ],
    },
    'administrativo.departamento': {
      tag_web: '01.06.00',
      label: "Departamento",
      route: "/adm/departamento",
      tela: '',  // TODO: codigo de menu do legado
      acoes: [
        { tag_web: '01.06.01', nome: "Visualizar / Acesso" },
        { tag_web: '01.06.02', nome: "Pesquisar" },
        { tag_web: '01.06.03', nome: "Novo" },
        { tag_web: '01.06.04', nome: "Editar" },
        { tag_web: '01.06.05', nome: "Excluir" },
        { tag_web: '01.06.06', nome: "Imprimir Grid" },
        { tag_web: '01.06.07', nome: "Exportar Dados" },
      ],
    },
    'administrativo.regiao': {
      tag_web: '01.04.00',
      label: "Região",
      route: "/adm/regiao",
      tela: '',  // TODO: codigo de menu do legado
      acoes: [
        { tag_web: '01.04.01', nome: "Visualizar / Acesso" },
        { tag_web: '01.04.02', nome: "Pesquisar" },
        { tag_web: '01.04.03', nome: "Novo" },
        { tag_web: '01.04.04', nome: "Editar" },
        { tag_web: '01.04.05', nome: "Excluir" },
        { tag_web: '01.04.06', nome: "Imprimir Grid" },
        { tag_web: '01.04.07', nome: "Exportar Dados" },
      ],
    },
    'administrativo.unidresp': {
      tag_web: '01.07.00',
      label: "Unidade Responsável",
      route: "/adm/unidresp",
      tela: '',  // TODO: codigo de menu do legado
      acoes: [
        { tag_web: '01.07.01', nome: "Visualizar / Acesso" },
        { tag_web: '01.07.02', nome: "Pesquisar" },
        { tag_web: '01.07.03', nome: "Novo" },
        { tag_web: '01.07.04', nome: "Editar" },
        { tag_web: '01.07.05', nome: "Excluir" },
        { tag_web: '01.07.06', nome: "Imprimir Grid" },
        { tag_web: '01.07.07', nome: "Exportar Dados" },
      ],
    },
    'administrativo.usuario': {
      tag_web: '01.08.00',
      label: "Usuários",
      route: "/adm/usuario",
      tela: '',  // TODO: codigo de menu do legado
      acoes: [
        { tag_web: '01.08.01', nome: "Visualizar / Acesso" },
        { tag_web: '01.08.02', nome: "Pesquisar" },
        { tag_web: '01.08.03', nome: "Novo" },
        { tag_web: '01.08.04', nome: "Editar" },
        { tag_web: '01.08.05', nome: "Excluir" },
        { tag_web: '01.08.06', nome: "Imprimir Grid" },
        { tag_web: '01.08.07', nome: "Exportar Dados" },
        { tag_web: '01.08.08', nome: "Configurar Permissões" },
      ],
    },
    'administrativo.perfil': {
      tag_web: '01.09.00',
      label: "Perfis de Usuário",
      route: "/adm/perfil",
      tela: '',  // TODO: codigo de menu do legado
      acoes: [
        { tag_web: '01.09.01', nome: "Visualizar / Acesso" },
        { tag_web: '01.09.02', nome: "Pesquisar" },
        { tag_web: '01.09.03', nome: "Novo" },
        { tag_web: '01.09.04', nome: "Editar" },
        { tag_web: '01.09.05', nome: "Excluir" },
        { tag_web: '01.09.06', nome: "Imprimir Grid" },
        { tag_web: '01.09.07', nome: "Exportar Dados" },
      ],
    },
    'administrativo.funcao': {
      tag_web: '01.10.00',
      label: "Função",
      route: "/adm/funcao",
      tela: '',  // TODO: codigo de menu do legado
      acoes: [
        { tag_web: '01.10.01', nome: "Visualizar / Acesso" },
      ],
    },
    'administrativo.banco': {
      tag_web: '01.12.00',
      label: "Banco",
      route: null,
      tela: '',
      acoes: [
        { tag_web: '01.12.01', nome: "Visualizar / Acesso" },
        { tag_web: '01.12.02', nome: "Pesquisar" },
        { tag_web: '01.12.03', nome: "Novo" },
        { tag_web: '01.12.04', nome: "Editar" },
        { tag_web: '01.12.05', nome: "Excluir" },
      ],
    },
    'administrativo.empresa_certificado': {
      tag_web: '01.13.00',
      label: "Certificado da Empresa",
      route: null,
      tela: '',
      acoes: [
        { tag_web: '01.13.01', nome: "Visualizar / Acesso" },
        { tag_web: '01.13.02', nome: "Pesquisar" },
        { tag_web: '01.13.03', nome: "Novo" },
        { tag_web: '01.13.04', nome: "Editar" },
        { tag_web: '01.13.05', nome: "Excluir" },
      ],
    },
    'administrativo.parametros': {
      tag_web: '01.14.00',
      label: "Par?metros",
      route: null,
      tela: '',
      acoes: [
        { tag_web: '01.14.01', nome: "Visualizar / Acesso" },
        { tag_web: '01.14.02', nome: "Pesquisar" },
        { tag_web: '01.14.03', nome: "Novo" },
        { tag_web: '01.14.04', nome: "Editar" },
        { tag_web: '01.14.05', nome: "Excluir" },
        { tag_web: '01.14.06', nome: "Consultar Sess?o" },
      ],
    },
    'administrativo.autoriza': {
      tag_web: '01.15.00',
      label: "Autoriza??es",
      route: null,
      tela: '',
      acoes: [
        { tag_web: '01.15.01', nome: "Visualizar / Acesso" },
        { tag_web: '01.15.02', nome: "Pesquisar" },
        { tag_web: '01.15.03', nome: "Novo" },
        { tag_web: '01.15.04', nome: "Editar" },
        { tag_web: '01.15.05', nome: "Excluir" },
      ],
    },
    'administrativo.solicita_autoriza': {
      tag_web: '01.16.00',
      label: "Solicita??es de Autoriza??o",
      route: null,
      tela: '',
      acoes: [
        { tag_web: '01.16.01', nome: "Visualizar / Acesso" },
        { tag_web: '01.16.02', nome: "Pesquisar" },
        { tag_web: '01.16.03', nome: "Novo" },
        { tag_web: '01.16.04', nome: "Editar" },
        { tag_web: '01.16.05', nome: "Excluir" },
        { tag_web: '01.16.06', nome: "Consultar Notifica??es" },
        { tag_web: '01.16.07', nome: "Confirmar Status" },
      ],
    },
    'administrativo.unidade_fiscal': {
      tag_web: '01.17.00',
      label: "Unidade Fiscal",
      route: null,
      tela: '',
      acoes: [
        { tag_web: '01.17.01', nome: "Visualizar / Acesso" },
        { tag_web: '01.17.02', nome: "Pesquisar" },
        { tag_web: '01.17.03', nome: "Novo" },
        { tag_web: '01.17.04', nome: "Editar" },
        { tag_web: '01.17.05', nome: "Excluir" },
      ],
    },
    'administrativo.versao': {
      tag_web: '01.18.00',
      label: "Vers?o",
      route: null,
      tela: '',
      acoes: [
        { tag_web: '01.18.01', nome: "Visualizar / Acesso" },
      ],
    },
    'administrativo.dashboard': {
      tag_web: '01.01.00',
      label: "Dashboard",
      route: null,
      tela: '',  // TODO
    },

  },
};
