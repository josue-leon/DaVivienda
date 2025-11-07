import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Input, Button } from '../../components/common';
import { useNotification } from '../../contexts/NotificationContext';
import { billeteraService } from '../../api/billetera.service';
import '../Home/FormPage.css';
import './Pagar.css';

type Step = 'iniciar' | 'confirmar';

export function Pagar() {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [step, setStep] = useState<Step>('iniciar');
  const [loading, setLoading] = useState(false);

  // Datos del paso 1 (iniciar pago)
  const [formDataIniciar, setFormDataIniciar] = useState({
    documento: '',
    celular: '',
    monto: '',
  });
  const [errorsIniciar, setErrorsIniciar] = useState<Record<string, string>>({});
  const [sessionId, setSessionId] = useState('');

  // Datos del paso 2 (confirmar pago)
  const [formDataConfirmar, setFormDataConfirmar] = useState({
    token: '',
  });
  const [errorsConfirmar, setErrorsConfirmar] = useState<Record<string, string>>({});

  const handleChangeIniciar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormDataIniciar((prev) => ({ ...prev, [name]: value }));
    if (errorsIniciar[name]) {
      setErrorsIniciar((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleChangeConfirmar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormDataConfirmar((prev) => ({ ...prev, [name]: value }));
    if (errorsConfirmar[name]) {
      setErrorsConfirmar((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateFormIniciar = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formDataIniciar.documento.trim()) {
      newErrors.documento = 'El documento es requerido';
    } else if (!/^\d+$/.test(formDataIniciar.documento)) {
      newErrors.documento = 'El documento debe contener solo números';
    }

    if (!formDataIniciar.celular.trim()) {
      newErrors.celular = 'El celular es requerido';
    } else if (!/^\d{10}$/.test(formDataIniciar.celular)) {
      newErrors.celular = 'El celular debe tener 10 dígitos';
    }

    if (!formDataIniciar.monto.trim()) {
      newErrors.monto = 'El monto es requerido';
    } else {
      const montoNum = parseFloat(formDataIniciar.monto);
      if (isNaN(montoNum) || montoNum <= 0) {
        newErrors.monto = 'El monto debe ser mayor a 0';
      }
    }

    setErrorsIniciar(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateFormConfirmar = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formDataConfirmar.token.trim()) {
      newErrors.token = 'El token es requerido';
    } else if (!/^\d{6}$/.test(formDataConfirmar.token)) {
      newErrors.token = 'El token debe tener 6 dígitos';
    }

    setErrorsConfirmar(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitIniciar = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateFormIniciar()) {
      showNotification('error', 'Por favor corrige los errores en el formulario');
      return;
    }

    setLoading(true);

    try {
      const result = await billeteraService.iniciarPago({
        documento: formDataIniciar.documento,
        celular: formDataIniciar.celular,
        monto: parseFloat(formDataIniciar.monto),
      });

      setSessionId(result.id_sesion);
      showNotification('success', 'Token de confirmación enviado a tu email', 'Token Enviado');
      setStep('confirmar');
    } catch (error: any) {
      const apiError = error.response?.data || error;
      const errorMessage = apiError.message || 'Error al iniciar el pago';
      const errorTitle = apiError.title || 'Error';

      showNotification('error', errorMessage, errorTitle);

      if (apiError.validations) {
        const fieldErrors: Record<string, string> = {};
        apiError.validations.forEach((validation: any) => {
          const firstError = Object.values(validation.constraints)[0] as string;
          fieldErrors[validation.property] = firstError;
        });
        setErrorsIniciar(fieldErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitConfirmar = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateFormConfirmar()) {
      showNotification('error', 'Por favor ingresa el token de 6 dígitos');
      return;
    }

    setLoading(true);

    try {
      const result = await billeteraService.confirmarPago({
        id_sesion: sessionId,
        token: formDataConfirmar.token,
      });

      showNotification(
        'success',
        `Pago confirmado. Monto: $${result.montoDescontado}. Nuevo saldo: $${result.saldoNuevo}`,
        'Pago Exitoso'
      );

      await new Promise((resolve) => setTimeout(resolve, 1500));

      navigate('/');
    } catch (error: any) {
      const apiError = error.response?.data || error;
      const errorMessage = apiError.message || 'Error al confirmar el pago';
      const errorTitle = apiError.title || 'Error';

      showNotification('error', errorMessage, errorTitle);

      if (apiError.validations) {
        const fieldErrors: Record<string, string> = {};
        apiError.validations.forEach((validation: any) => {
          const firstError = Object.values(validation.constraints)[0] as string;
          fieldErrors[validation.property] = firstError;
        });
        setErrorsConfirmar(fieldErrors);
      }
      
      setLoading(false);
    }
  };

  const handleCancelar = () => {
    if (step === 'confirmar') {
      setStep('iniciar');
      setFormDataConfirmar({ token: '' });
      setErrorsConfirmar({});
      setSessionId('');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="form-page">
      <Card title="Realizar Pago">
        <div className="pagar-steps">
          <div className={`step-indicator ${step === 'iniciar' ? 'active' : step === 'confirmar' ? 'completed' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Iniciar Pago</div>
          </div>
          <div className="step-divider" />
          <div className={`step-indicator ${step === 'confirmar' ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Confirmar Token</div>
          </div>
        </div>

        {step === 'iniciar' ? (
          <>
            <p className="form-description">
              Ingresa los datos de la compra. Se enviará un token de 6 dígitos a tu email para confirmar el pago.
            </p>
            <form onSubmit={handleSubmitIniciar} className="form">
              <Input
                label="Documento de Identidad"
                name="documento"
                type="text"
                placeholder="Ej: 12345678"
                value={formDataIniciar.documento}
                onChange={handleChangeIniciar}
                error={errorsIniciar.documento}
                required
                disabled={loading}
              />
              <Input
                label="Celular"
                name="celular"
                type="tel"
                placeholder="Ej: 3001234567"
                value={formDataIniciar.celular}
                onChange={handleChangeIniciar}
                error={errorsIniciar.celular}
                helperText="10 dígitos sin espacios"
                required
                disabled={loading}
              />
              <Input
                label="Monto a Pagar"
                name="monto"
                type="number"
                step="0.01"
                placeholder="Ej: 25000"
                value={formDataIniciar.monto}
                onChange={handleChangeIniciar}
                error={errorsIniciar.monto}
                required
                disabled={loading}
              />
              <div className="form-actions">
                <Button type="button" variant="outline" onClick={handleCancelar} disabled={loading}>
                  Cancelar
                </Button>
                <Button type="submit" loading={loading}>
                  Solicitar Token
                </Button>
              </div>
            </form>
          </>
        ) : (
          <>
            <p className="form-description">
              Hemos enviado un token de 6 dígitos a tu email. Ingrésalo para confirmar el pago de ${formDataIniciar.monto}.
            </p>
            <div className="session-info">
              <span className="session-label">ID de Sesión:</span>
              <span className="session-value">{sessionId}</span>
            </div>
            <form onSubmit={handleSubmitConfirmar} className="form">
              <Input
                label="Token de Confirmación"
                name="token"
                type="text"
                placeholder="Ej: 123456"
                value={formDataConfirmar.token}
                onChange={handleChangeConfirmar}
                error={errorsConfirmar.token}
                helperText="Token de 6 dígitos enviado a tu email"
                required
                disabled={loading}
                maxLength={6}
              />
              <div className="form-actions">
                <Button type="button" variant="outline" onClick={handleCancelar} disabled={loading}>
                  Volver
                </Button>
                <Button type="submit" loading={loading}>
                  Confirmar Pago
                </Button>
              </div>
            </form>
          </>
        )}
      </Card>
    </div>
  );
}
