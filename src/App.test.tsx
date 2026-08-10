import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('application navigation', () => {
  it('opens the modules that previously rendered a blank page', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'Marketing' }));
    expect(screen.getByRole('heading', { name: 'Painel de Marketing & Captação' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Ferramentas' }));
    expect(screen.getByRole('heading', { name: 'Ferramentas & Integrações' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Suporte' }));
    expect(screen.getByRole('heading', { name: 'Suporte & Central de Ajuda' })).toBeInTheDocument();
  });
});
