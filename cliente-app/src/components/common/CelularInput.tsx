import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { Input } from './Input';

interface CelularInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?: string;
  error?: string;
  helperText?: string;
  value: string;
  onChange: (value: string) => void;
}

export const CelularInput = forwardRef<HTMLInputElement, CelularInputProps>(
  ({ label = 'Celular', error, helperText, value, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      if (newValue !== '' && !/^\d+$/.test(newValue)) {
        return;
      }

      if (newValue.length > 10) {
        return;
      }

      onChange(newValue);
    };

    return (
      <Input
        ref={ref}
        label={label}
        name="celular"
        type="tel"
        placeholder="3001234567"
        prefix="+57"
        value={value}
        onChange={handleChange}
        error={error}
        helperText={helperText || '10 dígitos sin espacios'}
        {...props}
      />
    );
  }
);

CelularInput.displayName = 'CelularInput';
