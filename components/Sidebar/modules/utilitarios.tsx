import { Wrench } from 'lucide-react';
import { MenuModule } from '../types';

export const utilitarios: MenuModule = {
  id: 'utilitarios',
  tag_web: '14.00.00',
  label: "Utilitários",
  icon: <Wrench size={18} />,
  subsections: [
    { title: "Serviços", items: ['utilitarios.sincronizador'] },
  ],
  funcionalidades: {
    'utilitarios.sincronizador': {
      publico: true,
      tag_web: '14.01.00',
      label: "Sincronizador",
      route: "/utilitarios/sincronizador",
      tela: '',
      componente: 'SINCRONIZADOR',
      acoes: [
        { tag_web: '14.01.01', nome: "Visualizar / Acesso" }
      ],
    },
  },
};
