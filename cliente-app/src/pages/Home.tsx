import { Link } from 'react-router-dom';
import { Card } from '../components/common';
import logoSmall from '../assets/logoSmallDavivienda.png';
import './Home.css';

export function Home() {
  const features = [
    {
      title: 'Registrar Cliente',
      description: 'Crea una cuenta nueva en la billetera virtual de Davivienda',
      path: '/registro',
      icon: '👤',
    },
    {
      title: 'Ver Registros',
      description: 'Consulta todos los clientes registrados en el sistema',
      path: '/clientes',
      icon: '📋',
    },
    {
      title: 'Recargar Billetera',
      description: 'Agrega saldo a tu billetera de forma rápida y segura',
      path: '/recarga',
      icon: '💰',
    },
    {
      title: 'Realizar Pago',
      description: 'Realiza compras con tu saldo disponible de manera segura',
      path: '/pagar',
      icon: '💳',
    },
    {
      title: 'Consultar Saldo',
      description: 'Verifica tu saldo actual y el historial de movimientos',
      path: '/consultar-saldo',
      icon: '📊',
    },
  ];

  return (
    <div className="home">
      <div className="hero">
        <img src={logoSmall} alt="Davivienda" className="hero-logo" />
        <h1 className="hero-title">Billetera Virtual</h1>
        <p className="hero-subtitle">
          Gestiona tu dinero de forma fácil, rápida y segura con la billetera virtual de Davivienda
        </p>
      </div>

      <div className="features-grid">
        {features.map((feature) => (
          <Link key={feature.path} to={feature.path} className="feature-card-link">
            <Card className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
              <div className="feature-arrow">→</div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
