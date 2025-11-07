import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { Input } from './Input';

interface DocumentoInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?: string;
  error?: string;
  helperText?: string;
  value: string;
  onChange: (value: string) => void;
}


export const validarDocumentoColombia = (documento: string): boolean => {
  return /^((\d{8})|(\d{10})|(\d{11})|(\d{6}-\d{5}))$/.test(documento);
};

export const DocumentoInput = forwardRef<HTMLInputElement, DocumentoInputProps>(
  ({ label = 'Documento de Identidad', error, helperText, value, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      // Permite solo números y guión
      if (newValue !== '' && !/^[\d-]+$/.test(newValue)) {
        return;
      }

      // Máximo 12 caracteres (formato: 123456-12345)
      if (newValue.length > 12) {
        return;
      }

      onChange(newValue);
    };

    return (
      <Input
        ref={ref}
        label={label}
        name="documento"
        type="text"
        placeholder="1134854312"
        value={value}
        onChange={handleChange}
        error={error}
        helperText={helperText || 'Cédula colombiana (8, 10, 11 dígitos o formato 123456-12345)'}
        {...props}
      />
    );
  }
);

DocumentoInput.displayName = 'DocumentoInput';
