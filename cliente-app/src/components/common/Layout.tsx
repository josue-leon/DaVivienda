import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoDavivienda from '../../assets/LogoDavivienda.svg';
import './Layout.css';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Inicio' },
    { path: '/registro', label: 'Registrar Cliente' },
    { path: '/clientes', label: 'Ver Registros' },
    { path: '/recarga', label: 'Recargar Billetera' },
    { path: '/pagar', label: 'Realizar Pago' },
    { path: '/consultar-saldo', label: 'Consultar Saldo' },
  ];

  return (
    <div className="layout">
      <header className="header">
        <div className="header-content">
          <Link to="/" className="logo-link">
            <img src={logoDavivienda} alt="Davivienda" className="logo" />
          </Link>
          <nav className="nav">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'nav-link-active' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="main">{children}</main>
      <footer className="footer">
        <p>&copy; 2025 DaVivienda - Billetera Virtual</p>
      </footer>
    </div>
  );
}
