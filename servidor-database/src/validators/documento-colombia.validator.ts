import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';


export function validarDocumentoColombia(documento: string): boolean {
  return /^((\d{8})|(\d{10})|(\d{11})|(\d{6}-\d{5}))$/.test(documento);
}

@ValidatorConstraint({ name: 'IsDocumentoColombiaConstraint', async: false })
export class IsDocumentoColombiaConstraint implements ValidatorConstraintInterface {
  validate(documento: string) {
    return validarDocumentoColombia(documento);
  }

  defaultMessage() {
    return 'El documento no es válido. Debe ser una cédula colombiana válida';
  }
}

export function IsDocumentoColombia(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsDocumentoColombiaConstraint,
    });
  };
}
