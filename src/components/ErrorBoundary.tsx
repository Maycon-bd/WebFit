import React from 'react';

interface State {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[WebFit] Falha inesperada na interface', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="fatal-error" role="alert">
          <h1>Não foi possível carregar esta tela</h1>
          <p>Seus dados continuam no navegador. Recarregue a página para tentar novamente.</p>
          <button className="btn-teal" onClick={() => window.location.reload()}>Recarregar</button>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
