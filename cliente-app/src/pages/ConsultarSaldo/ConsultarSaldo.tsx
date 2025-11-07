import { useState } from 'react';
import type { FormEvent } from 'react';
import { Card, Button, DocumentoInput, CelularInput, validarDocumentoColombia } from '../../components/common';
import { useNotification } from '../../contexts/NotificationContext';
import { billeteraService } from '../../api/billetera.service';
import '../Home/FormPage.css';
import './ConsultarSaldo.css';
import type { SaldoResponseEntity } from '../../../api-client';

export function ConsultarSaldo() {
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    documento: '',
    celular: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [resultado, setResultado] = useState<SaldoResponseEntity | null>(null);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.documento.trim()) {
      newErrors.documento = 'El documento es requerido';
    } else if (!/^\d+$/.test(formData.documento)) {
      newErrors.documento = 'El documento debe contener solo números';
    } else if (formData.documento.length < 6 || formData.documento.length > 10) {
      newErrors.documento = 'El documento debe tener entre 6 y 10 dígitos';
    } else if (!validarDocumentoColombia(formData.documento)) {
      newErrors.documento = 'El documento no es válido';
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
          <DocumentoInput
            value={formData.documento}
            onChange={(value) => {
              setFormData((prev) => ({ ...prev, documento: value }));
              if (errors.documento) {
                setErrors((prev) => ({ ...prev, documento: '' }));
              }
            }}
            error={errors.documento}
            required
            disabled={loading}
          />
          <CelularInput
            value={formData.celular}
            onChange={(value) => {
              setFormData((prev) => ({ ...prev, celular: value }));
              if (errors.celular) {
                setErrors((prev) => ({ ...prev, celular: '' }));
              }
            }}
            error={errors.celular}
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
