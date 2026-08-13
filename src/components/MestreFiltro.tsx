import React, { useMemo, useState } from 'react';
import '../styles/master.css';

export type SearchFieldType = 'string' | 'date' | 'integer' | 'currency';
export type MestreFiltroState = {
  coluna: string;
  setColuna: (value: string) => void;
  operacao: string;
  setOperacao: (value: string) => void;
  texto: string;
  setTexto: (value: string) => void;
  textoFim: string;
  setTextoFim: (value: string) => void;
};

export type SearchField = { label: string; value: string; type?: SearchFieldType };

type MestreFiltroProps = {
  fields: SearchField[];
  searchCols: string[];
  onSearch: (filter: { advancedFilter: string }) => void;
  onClear: () => void;
  isLoading?: boolean;
  podePesquisar?: boolean;
  persistentState?: MestreFiltroState;
  children?: React.ReactNode;
};

const operations = [
  ['CONTÉM', 'LIKE_C'], ['NÃO CONTÉM', 'NOT_LIKE'], ['COMEÇA COM', 'LIKE_I'],
  ['TERMINA COM', 'LIKE_F'], ['IGUAL A', '='], ['DIFERENTE DE', '<>'],
  ['MAIOR QUE', '>'], ['MAIOR OU IGUAL A', '>='], ['MENOR QUE', '<'], ['MENOR OU IGUAL A', '<='],
] as const;

const fieldLabels: Record<SearchFieldType, [string, string]> = {
  string: ['Texto', 'Texto final'], date: ['Data', 'Data final'], integer: ['Número', 'Número final'], currency: ['Valor', 'Valor final'],
};

const isoToBrDate = (value: string) => {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return match ? `${match[3]}/${match[2]}/${match[1]}` : value;
};

const MestreFiltro = ({ fields, searchCols, onSearch, onClear, isLoading = false, podePesquisar = true, persistentState, children }: MestreFiltroProps) => {
  const [localColuna, setLocalColuna] = useState(persistentState?.coluna ?? '');
  const [localOperacao, setLocalOperacao] = useState(persistentState?.operacao ?? 'LIKE_C');
  const [localTexto, setLocalTexto] = useState(persistentState?.texto ?? '');
  const [localTextoFim, setLocalTextoFim] = useState(persistentState?.textoFim ?? '');
  const coluna = persistentState?.coluna ?? localColuna;
  const operacao = persistentState?.operacao ?? localOperacao;
  const texto = persistentState?.texto ?? localTexto;
  const textoFim = persistentState?.textoFim ?? localTextoFim;

  const type = useMemo<SearchFieldType>(() => fields.find((field) => field.value === coluna)?.type ?? 'string', [coluna, fields]);
  const between = operacao === 'BETWEEN';
  const setColuna = (value: string) => { setLocalColuna(value); persistentState?.setColuna(value); setOperacao('LIKE_C'); setTexto(''); setTextoFim(''); };
  const setOperacao = (value: string) => { setLocalOperacao(value); persistentState?.setOperacao(value); };
  const setTexto = (value: string) => { setLocalTexto(value); persistentState?.setTexto(value); };
  const setTextoFim = (value: string) => { setLocalTextoFim(value); persistentState?.setTextoFim(value); };

  const buildCondition = (column: string, first: string, last: string) => {
    const escape = (value: string) => value.replace(/'/g, "''");
    const v1 = escape(first); const v2 = escape(last);
    const quotes = type === 'integer' || type === 'currency' ? ['', ''] : ["'", "'"];
    const literal = (value: string) => `${quotes[0]}${value}${quotes[1]}`;
    if (operacao === 'LIKE_C') return `${column} LIKE '%${v1}%'`;
    if (operacao === 'NOT_LIKE') return `${column} NOT LIKE '%${v1}%'`;
    if (operacao === 'LIKE_I') return `${column} LIKE '${v1}%'`;
    if (operacao === 'LIKE_F') return `${column} LIKE '%${v1}'`;
    if (operacao === 'BETWEEN') return v2 ? `${column} BETWEEN ${literal(v1)} AND ${literal(v2)}` : `${column} >= ${literal(v1)}`;
    return `${column} ${operacao} ${literal(v1)}`;
  };

  const search = () => {
    if (!podePesquisar || isLoading) return;
    if (!texto.trim()) { onSearch({ advancedFilter: '' }); return; }
    let first = texto.trim(); let last = textoFim.trim();
    if (type === 'string') { first = first.toUpperCase(); last = last.toUpperCase(); }
    if (type === 'date') { first = isoToBrDate(first); last = isoToBrDate(last); }
    const columns = coluna ? [coluna] : searchCols;
    const filter = columns.map((column) => buildCondition(column, first, last)).join(' OR ');
    onSearch({ advancedFilter: coluna ? filter : `(${filter})` });
  };

  const clear = () => { setTexto(''); setTextoFim(''); setOperacao('LIKE_C'); onClear(); };
  const inputType = type === 'date' ? 'date' : type === 'integer' || type === 'currency' ? 'number' : 'text';
  const input = (value: string, change: (value: string) => void, ending = false) => (
    <input type={inputType} step={type === 'currency' ? '0.001' : undefined} value={value} onChange={(event) => change(event.target.value)}
      onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); search(); } if (type === 'date' && event.key.toLowerCase() === 't') { event.preventDefault(); change(new Date().toISOString().slice(0, 10)); } }}
      placeholder={between ? (ending ? 'Até...' : 'De...') : 'Digite para pesquisar...'} disabled={!podePesquisar || isLoading} />
  );

  return (
    <div className="master-filter">
      {!podePesquisar && <div className="master-filter-warning">Pesquisa desabilitada para seu perfil de acesso.</div>}
      <div className="master-search-fields">
        <label className="master-field master-field-column"><span>Coluna de busca</span><select value={coluna} onChange={(event) => setColuna(event.target.value)} disabled={!podePesquisar || isLoading}><option value="">TODAS AS COLUNAS</option>{fields.map((field) => <option key={field.value} value={field.value}>{field.label.toUpperCase()}</option>)}</select></label>
        <label className="master-field master-field-operation"><span>Operação</span><select value={operacao} onChange={(event) => setOperacao(event.target.value)} disabled={!podePesquisar || isLoading}>{operations.map(([label, value]) => <option key={value} value={value}>{label}</option>)}{coluna && <option value="BETWEEN">ESTÁ ENTRE</option>}</select></label>
        <label className="master-field master-field-value"><span>{between ? `${fieldLabels[type][0]} inicial` : fieldLabels[type][0]}</span>{input(texto, setTexto)}</label>
        {between && <label className="master-field master-field-value"><span>{fieldLabels[type][1]}</span>{input(textoFim, setTextoFim, true)}</label>}
        {children}
      </div>
      <div className="master-search-actions">
        <button type="button" className="master-clear-button master-clear-icon" onClick={clear} disabled={isLoading || !podePesquisar} title="Limpar filtros" aria-label="Limpar filtros">×</button>
        <button type="button" className="master-search-button" onClick={search} disabled={isLoading || !podePesquisar}><span aria-hidden="true">⌕</span>PESQUISAR</button>
      </div>
    </div>
  );
};

export default MestreFiltro;
