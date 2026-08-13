import { administrativo } from './administrativo';
import { financeiro } from './financeiro';
import { bancario } from './bancario';
import { compras } from './compras';
import { entradasNotaFiscal } from './entradasNotaFiscal';
import { fomento } from './fomento';
import { faturamentoPlano } from './faturamentoPlano';
import { faturamentoNf } from './faturamentoNf';
import { recebimentoCliente } from './recebimentoCliente';
import { boleto } from './boleto';
import { comissao } from './comissao';
import { contabilidade } from './contabilidade';
import { conveniadas } from './conveniadas';
import { utilitarios } from './utilitarios';
import { MenuModule, Funcionalidade } from '../types';

const baseMenuModules: MenuModule[] = [
  administrativo,       // 01.00.00
  bancario,             // 02.00.00
  compras,              // 03.00.00
  entradasNotaFiscal,   // 04.00.00
  financeiro,           // 05.00.00
  conveniadas,          // 06.00.00
  fomento,              // 07.00.00
  recebimentoCliente,   // 08.00.00
  boleto,               // 09.00.00
  faturamentoPlano,     // 10.00.00
  faturamentoNf,        // 11.00.00
  comissao,             // 12.00.00
  contabilidade,        // 13.00.00
  utilitarios,          // 14.00.00
];

// Helper to sort a module's internal items by tag_web and sections alphabetically
function sortModuleDeep(mod: MenuModule): MenuModule {
  const newSubsections = mod.subsections.map(sub => {
    const sortedItems = [...sub.items].sort((a, b) => {
      const tagA = mod.funcionalidades[a]?.tag_web || '';
      const tagB = mod.funcionalidades[b]?.tag_web || '';
      return tagA.localeCompare(tagB);
    });
    return { ...sub, items: sortedItems };
  });

  newSubsections.sort((a, b) => {
    const minTagA = a.items.reduce((min, slug) => {
      const t = mod.funcionalidades[slug]?.tag_web || '';
      return (!min || t.localeCompare(min) < 0) ? t : min;
    }, '');
    const minTagB = b.items.reduce((min, slug) => {
      const t = mod.funcionalidades[slug]?.tag_web || '';
      return (!min || t.localeCompare(min) < 0) ? t : min;
    }, '');
    return minTagA.localeCompare(minTagB);
  });

  return { ...mod, subsections: newSubsections };
}

export const menuModules: MenuModule[] = baseMenuModules
  .map(sortModuleDeep)
  .sort((a, b) => (a.tag_web || '').localeCompare(b.tag_web || ''));

export function buildFuncionalidades(mods: MenuModule[]): Record<string, Funcionalidade> {
  const out: Record<string, Funcionalidade> = {};
  for (const mod of mods) Object.assign(out, mod.funcionalidades);
  return out;
}

export const funcionalidades = buildFuncionalidades(menuModules);

/** @deprecated indexacao antiga por label, para transicao gradual */
export const funcionalidadesPorLabel: Record<string, Funcionalidade> =
  Object.fromEntries(Object.values(funcionalidades).map(f => [f.label, f]));

/** @deprecated alias de funcionalidadesPorLabel para retrocompatibilidade com Funcao */
export const routeConfig = funcionalidadesPorLabel;
