import type { ReactNode } from 'react';
import '../styles/master.css';

type MasterAction = {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'secondary' | 'primary';
};

type MasterCrudLayoutProps = {
  title: string;
  subtitle?: ReactNode;
  icon?: ReactNode;
  actions?: MasterAction[];
  loading?: boolean;
  loadingMessage?: string;
  children: ReactNode;
};

const MasterCrudLayout = ({
  title,
  subtitle,
  icon,
  actions = [],
  loading = false,
  loadingMessage = 'Carregando registros...',
  children,
}: MasterCrudLayoutProps) => (
  <section className="master-page" aria-busy={loading}>
    <header className="master-page-header">
      <div className="master-page-identity">
        {icon && <div className="master-page-icon" aria-hidden="true">{icon}</div>}
        <div>
          <h1>{title}</h1>
          {subtitle && <div className="master-page-subtitle">{subtitle}</div>}
        </div>
      </div>

      {actions.length > 0 && (
        <div className="master-page-actions">
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              className={`master-action master-action-${action.variant ?? 'secondary'}`}
              onClick={action.onClick}
              disabled={action.disabled}
            >
              {action.icon}
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      )}
    </header>

    <div className="master-page-body">
      {loading && (
        <div className="master-loading" role="status">
          <span className="master-loading-spinner" aria-hidden="true" />
          <strong>Processando</strong>
          <span>{loadingMessage}</span>
        </div>
      )}
      {children}
    </div>
  </section>
);

export default MasterCrudLayout;
