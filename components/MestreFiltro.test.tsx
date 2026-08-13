// Testes de permissão — MestreFiltro
// Valida que o gate `podePesquisar` desabilita corretamente a busca:
//   - banner de aviso visível
//   - campos (select, input) com disabled=true
//   - botão PESQUISAR com disabled=true e não dispara onSearch

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import MestreFiltro from './MestreFiltro';

// MestreFiltro é um componente puro de props — não usa nenhum Context.

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const FIELDS = [
  { label: 'Nome', value: 'NOME' },
  { label: 'Área', value: 'AREA' },
  { label: 'Status (S / N)', value: 'ATIVO' },
];

const BASE_PROPS = {
  fields:     FIELDS,
  searchCols: ['NOME'],
  onSearch:   vi.fn(),
  onClear:    vi.fn(),
};

const renderFiltro = (props = {}) =>
  render(<MestreFiltro {...BASE_PROPS} {...props} />);

// ─── podePesquisar = true (comportamento padrão) ───────────────────────────────

describe('MestreFiltro — podePesquisar=true (padrão)', () => {
  beforeEach(() => vi.clearAllMocks());

  it('sem prop podePesquisar → sem banner de aviso (default true)', () => {
    renderFiltro();
    expect(screen.queryByText(/pesquisa desabilitada/i)).not.toBeInTheDocument();
  });

  it('podePesquisar=true → botão PESQUISAR habilitado', () => {
    renderFiltro({ podePesquisar: true });
    expect(screen.getByRole('button', { name: /pesquisar/i })).not.toBeDisabled();
  });

  it('podePesquisar=true → input de texto habilitado', () => {
    renderFiltro({ podePesquisar: true });
    expect(screen.getByPlaceholderText(/digite para pesquisar/i)).not.toBeDisabled();
  });

  it('podePesquisar=true → select de coluna habilitado', () => {
    renderFiltro({ podePesquisar: true });
    // Primeiro combobox é o select "Coluna de Busca"
    expect(screen.getAllByRole('combobox')[0]).not.toBeDisabled();
  });

  it('podePesquisar=true → clicar PESQUISAR chama onSearch', async () => {
    const onSearch = vi.fn();
    const user = userEvent.setup();
    renderFiltro({ podePesquisar: true, onSearch });
    await user.click(screen.getByRole('button', { name: /pesquisar/i }));
    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith({ advancedFilter: '' });
  });

  it('podePesquisar=true → digitar texto e pesquisar monta filtro correto', async () => {
    const onSearch = vi.fn();
    const user = userEvent.setup();
    renderFiltro({ podePesquisar: true, onSearch });
    const input = screen.getByPlaceholderText(/digite para pesquisar/i);
    await user.clear(input);
    fireEvent.change(input, { target: { value: 'FAZENDA SUL' } });
    await user.click(screen.getByRole('button', { name: /pesquisar/i }));
    expect(onSearch).toHaveBeenCalledWith({
      advancedFilter: "(NOME LIKE '%FAZENDA SUL%')",
    });
    expect(onSearch.mock.calls[0][0].advancedFilter).not.toMatch(/UPPER|TO_CHAR|TO_DATE|TRUNC/);
  });
});

// ─── podePesquisar = false ─────────────────────────────────────────────────────

describe('MestreFiltro — podePesquisar=false', () => {
  beforeEach(() => vi.clearAllMocks());

  it('banner "Pesquisa desabilitada..." visível', () => {
    renderFiltro({ podePesquisar: false });
    expect(screen.getByText(/pesquisa desabilitada para seu perfil/i)).toBeInTheDocument();
  });

  it('botão PESQUISAR está disabled', () => {
    renderFiltro({ podePesquisar: false });
    expect(screen.getByRole('button', { name: /pesquisar/i })).toBeDisabled();
  });

  it('input de texto está disabled', () => {
    renderFiltro({ podePesquisar: false });
    expect(screen.getByPlaceholderText(/digite para pesquisar/i)).toBeDisabled();
  });

  it('select de coluna está disabled', () => {
    renderFiltro({ podePesquisar: false });
    expect(screen.getAllByRole('combobox')[0]).toBeDisabled();
  });

  it('select de operação está disabled', () => {
    renderFiltro({ podePesquisar: false });
    // Segundo combobox é o select "Operação"
    expect(screen.getAllByRole('combobox')[1]).toBeDisabled();
  });

  it('clicar no botão PESQUISAR (disabled) não chama onSearch', async () => {
    const onSearch = vi.fn();
    const user = userEvent.setup();
    renderFiltro({ podePesquisar: false, onSearch });
    await user.click(screen.getByRole('button', { name: /pesquisar/i }));
    expect(onSearch).not.toHaveBeenCalled();
  });

  it('podePesquisar muda de false → true: banner desaparece e botão fica habilitado', () => {
    const { rerender } = renderFiltro({ podePesquisar: false });
    expect(screen.getByText(/pesquisa desabilitada/i)).toBeInTheDocument();

    rerender(<MestreFiltro {...BASE_PROPS} podePesquisar={true} />);

    expect(screen.queryByText(/pesquisa desabilitada/i)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /pesquisar/i })).not.toBeDisabled();
  });
});
