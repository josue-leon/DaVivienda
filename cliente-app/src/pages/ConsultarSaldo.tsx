import { useState } from 'react';
import type { FormEvent } from 'react';
import { Card, Input, Button } from '../components/common';
import { useNotification } from '../contexts/NotificationContext';
import { billeteraService } from '../api/billetera.service';
import './FormPage.css';
import './ConsultarSaldo.css';
import type { SaldoResponseEntity } from '../../api-client';

export function ConsultarSaldo() {
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    documento: '',
    celular: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [resultado, setResultado] = useState<SaldoResponseEntity | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.documento.trim()) {
      newErrors.documento = 'El documento es requerido';
    } else if (!/^\d+$/.test(formData.documento)) {
      newErrors.documento = 'El documento debe contener solo números';
    }

    if (!formData.celular.trim()) {
      newErrors.celular = 'El celular es requerido';
    } else if (!/^\d{10}$/.test(formData.celular)) {
      newErrors.celular = 'El celular debe tener 10 dígitos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showNotification('error', 'Por favor corrige los errores en el formulario');
      return;
    }

    setLoading(true);
    setResultado(null);

    try {
      const result = await billeteraService.consultarSaldo(formData);
      setResultado(result);
      showNotification('success', 'Saldo consultado exitosamente');
    } catch (error: any) {
      const apiError = error.response?.data || error;
      const errorMessage = apiError.message || 'Error al consultar el saldo';
      const errorTitle = apiError.title || 'Error';

      showNotification('error', errorMessage, errorTitle);

      if (apiError.validations) {
        const fieldErrors: Record<string, string> = {};
        apiError.validations.forEach((validation: any) => {
          const firstError = Object.values(validation.constraints)[0] as string;
          fieldErrors[validation.property] = firstError;
        });
        setErrors(fieldErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="form-page">
      <Card title="Consultar Saldo">
        <p className="form-description">Ingresa tu documento y celular para consultar tu saldo disponible</p>
        <form onSubmit={handleSubmit} className="form">
          <Input
            label="Documento de Identidad"
            name="documento"
            type="text"
            placeholder="Ej: 12345678"
            value={formData.documento}
            onChange={handleChange}
            error={errors.documento}
            required
            disabled={loading}
          />
          <Input
            label="Celular"
            name="celular"
            type="tel"
            placeholder="Ej: 3001234567"
            value={formData.celular}
            onChange={handleChange}
            error={errors.celular}
            helperText="10 dígitos sin espacios"
            required
            disabled={loading}
          />
          <Button type="submit" fullWidth loading={loading}>
            Consultar Saldo
          </Button>
        </form>

        {resultado && (
          <div className="saldo-resultado">
            <div className="saldo-header">
              <h3 className="saldo-nombre">{resultado.cliente.nombres}</h3>
              <p className="saldo-documento">Doc: {resultado.cliente.documento}</p>
            </div>
            <div className="saldo-monto">
              <span className="saldo-label">Saldo Disponible</span>
              <span className="saldo-valor">{formatCurrency(typeof resultado.saldo === 'string' ? parseFloat(resultado.saldo) : resultado.saldo)}</span>
            </div>
            <div className="saldo-estadisticas">
              <div className="estadistica">
                <span className="estadistica-label">Total Recargas</span>
                <span className="estadistica-valor">
                  {formatCurrency(typeof resultado.estadisticas.totalRecargas === 'string'
                    ? parseFloat(resultado.estadisticas.totalRecargas)
                    : resultado.estadisticas.totalRecargas)}
                </span>
              </div>
              <div className="estadistica">
                <span className="estadistica-label">Total Compras</span>
                <span className="estadistica-valor">
                  {formatCurrency(typeof resultado.estadisticas.totalCompras === 'string'
                    ? parseFloat(resultado.estadisticas.totalCompras)
                    : resultado.estadisticas.totalCompras)}
                </span>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
