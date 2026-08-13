// Testes de permissão — MasterCrudPage
// Valida que os botões do header (Novo, Imprimir, Exportar) são controlados
// exclusivamente pelas flags de permissão recebidas via prop `permissions`.

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

import MasterCrudPage from './MasterCrudPage';

// MasterCrudPage chama useCompany() internamente para exibir dados da empresa.
vi.mock('../context/CompanyContext', () => ({
  useCompany: () => ({ selectedCompany: { id: 1, nome: 'Empresa Teste' } }),
}));

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Props mínimas para renderizar o header (viewMode !== 'form'). */
const BASE_PROPS = {
  title:     'Talhões',
  subtitle:  'Gestão de talhões',
  viewMode:  'list' as const,
  hasData:   false,
  isLoading: false,
  onNew:     vi.fn(),
  onPrint:   vi.fn(),
  onExport:  vi.fn(),
  onRefresh: vi.fn(),
};

const renderPage = (permissions?: any, extraProps = {}) =>
  render(<MasterCrudPage {...BASE_PROPS} {...extraProps} permissions={permissions} />);

// ─── Suítes ───────────────────────────────────────────────────────────────────

describe('MasterCrudPage — gate podeCriar (botão Novo)', () => {
  beforeEach(() => vi.clearAllMocks());

  it('podeCriar=true → botão "Novo" presente no DOM', () => {
    renderPage({ podeCriar: true });
    expect(screen.getByRole('button', { name: /novo/i })).toBeInTheDocument();
  });

  it('podeCriar=false → botão "Novo" ausente do DOM', () => {
    renderPage({ podeCriar: false });
    expect(screen.queryByRole('button', { name: /novo/i })).not.toBeInTheDocument();
  });
});

describe('MasterCrudPage — gate podeImprimir (botão Imprimir)', () => {
  beforeEach(() => vi.clearAllMocks());

  it('podeImprimir=true → botão "Imprimir" presente no DOM', () => {
    renderPage({ podeImprimir: true });
    expect(screen.getByRole('button', { name: /imprimir/i })).toBeInTheDocument();
  });

  it('podeImprimir=false → botão "Imprimir" ausente do DOM', () => {
    renderPage({ podeImprimir: false });
    expect(screen.queryByRole('button', { name: /imprimir/i })).not.toBeInTheDocument();
  });

  it('podeImprimir=true sem onPrint → botão "Imprimir" ausente (sem handler não renderiza)', () => {
    render(<MasterCrudPage {...BASE_PROPS} onPrint={undefined} permissions={{ podeImprimir: true }} />);
    expect(screen.queryByRole('button', { name: /imprimir/i })).not.toBeInTheDocument();
  });
});

describe('MasterCrudPage — gate podeExportar (botão Exportar)', () => {
  beforeEach(() => vi.clearAllMocks());

  it('podeExportar=true → botão "Exportar" presente no DOM', () => {
    renderPage({ podeExportar: true });
    expect(screen.getByRole('button', { name: /exportar/i })).toBeInTheDocument();
  });

  it('podeExportar=false → botão "Exportar" ausente do DOM', () => {
    renderPage({ podeExportar: false });
    expect(screen.queryByRole('button', { name: /exportar/i })).not.toBeInTheDocument();
  });
});

describe('MasterCrudPage — perfis compostos', () => {
  beforeEach(() => vi.clearAllMocks());

  it('permissions=undefined → todos os botões visíveis (retrocompatibilidade)', () => {
    renderPage(undefined);
    expect(screen.getByRole('button', { name: /novo/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /imprimir/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /exportar/i })).toBeInTheDocument();
  });

  it('acesso total → Novo + Imprimir + Exportar presentes', () => {
    renderPage({ podeCriar: true, podeImprimir: true, podeExportar: true });
    expect(screen.getByRole('button', { name: /novo/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /imprimir/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /exportar/i })).toBeInTheDocument();
  });

  it('somente visualização → nenhum dos 3 botões de ação presente', () => {
    renderPage({ podeCriar: false, podeImprimir: false, podeExportar: false });
    expect(screen.queryByRole('button', { name: /novo/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /imprimir/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /exportar/i })).not.toBeInTheDocument();
  });

  it('pode criar mas não imprimir nem exportar → só botão Novo visível', () => {
    renderPage({ podeCriar: true, podeImprimir: false, podeExportar: false });
    expect(screen.getByRole('button', { name: /novo/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /imprimir/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /exportar/i })).not.toBeInTheDocument();
  });
});

describe('MasterCrudPage — viewMode=form', () => {
  it('viewMode=form → renderiza formSlot e NÃO renderiza o header de botões', () => {
    render(
      <MasterCrudPage
        {...BASE_PROPS}
        viewMode="form"
        permissions={{ podeCriar: true, podeImprimir: true, podeExportar: true } as any}
        formSlot={<div data-testid="form-slot">formulário aqui</div>}
      />
    );
    expect(screen.getByTestId('form-slot')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /novo/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /imprimir/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /exportar/i })).not.toBeInTheDocument();
  });
});
