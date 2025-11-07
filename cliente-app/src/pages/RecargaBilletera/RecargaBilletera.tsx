import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Input, Button } from '../../components/common';
import { useNotification } from '../../contexts/NotificationContext';
import { billeteraService } from '../../api/billetera.service';
import '../Home/FormPage.css';

export function RecargaBilletera() {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    documento: '',
    celular: '',
    monto: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

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

    if (!formData.monto.trim()) {
      newErrors.monto = 'El monto es requerido';
    } else {
      const montoNum = parseFloat(formData.monto);
      if (isNaN(montoNum) || montoNum <= 0) {
        newErrors.monto = 'El monto debe ser mayor a 0';
      }
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

    try {
      const result = await billeteraService.recargar({
        documento: formData.documento,
        celular: formData.celular,
        monto: parseFloat(formData.monto),
      });

      showNotification(
        'success',
        `Recarga exitosa de $${result.montoRecargado}. Nuevo saldo: $${result.saldoNuevo}`,
        'Recarga Exitosa'
      );

      setFormData({ documento: '', celular: '', monto: '' });

      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      navigate('/');
    } catch (error: any) {
      const apiError = error.response?.data || error;
      const errorMessage = apiError.message || 'Error al recargar la billetera';
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

  return (
    <div className="form-page">
      <Card title="Recargar Billetera">
        <p className="form-description">
          Ingresa tu documento, celular y el monto a recargar en tu billetera virtual
        </p>
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
          <Input
            label="Monto a Recargar"
            name="monto"
            type="number"
            step="0.01"
            placeholder="Ej: 50000"
            value={formData.monto}
            onChange={handleChange}
            error={errors.monto}
            required
            disabled={loading}
          />
          <div className="form-actions">
            <Button type="button" variant="outline" onClick={() => navigate('/')} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" loading={loading}>
              Recargar
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
