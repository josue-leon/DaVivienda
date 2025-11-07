import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Input, Button, DocumentoInput, CelularInput, validarDocumentoColombia } from '../../components/common';
import { useNotification } from '../../contexts/NotificationContext';
import '../Home/FormPage.css';
import { clienteService } from '../../api/cliente.service';

export function RegistroCliente() {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    documento: '',
    nombres: '',
    email: '',
    celular: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpiar error del campo al escribir
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
    } else if (formData.documento.length < 6 || formData.documento.length > 10) {
      newErrors.documento = 'El documento debe tener entre 6 y 10 dígitos';
    } else if (!validarDocumentoColombia(formData.documento)) {
      newErrors.documento = 'El documento no es válido';
    }

    if (!formData.nombres.trim()) {
      newErrors.nombres = 'El nombre es requerido';
    } else if (formData.nombres.trim().length < 3) {
      newErrors.nombres = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
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

    try {
      const result = await clienteService.registrar(formData);
      showNotification('success', `Cliente registrado exitosamente. Saldo inicial: $${result.saldo}`, 'Registro Exitoso');

      setFormData({ documento: '', nombres: '', email: '', celular: '' });

      await new Promise((resolve) => setTimeout(resolve, 1500));

      navigate('/');
    } catch (error: any) {
      // Manejar errores de axios del cliente generado
      const apiError = error.response?.data || error;
      const errorMessage = apiError.message || 'Error al registrar el cliente';
      const errorTitle = apiError.title || 'Error';

      showNotification('error', errorMessage, errorTitle);

      // Si hay validaciones, mapearlas a errores de campos
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
      <Card title="Registrar Nuevo Cliente">
        <p className="form-description">
          Completa el formulario para crear una cuenta en la billetera virtual de Davivienda
        </p>
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
          <Input
            label="Nombres Completos"
            name="nombres"
            type="text"
            placeholder="Ej: Juan Pérez"
            value={formData.nombres}
            onChange={handleChange}
            error={errors.nombres}
            required
            disabled={loading}
          />
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="Ej: juan@email.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
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
          <div className="form-actions">
            <Button type="button" variant="outline" onClick={() => navigate('/')} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" loading={loading}>
              Registrar Cliente
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
