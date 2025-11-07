export enum EnumMsgValidator {
  isNotText = "Debe ser una cadena de texto",
  min5 = "Mínimo 5 caracteres",
  max60 = "Máximo 60 caracteres",
  max100 = "Máximo 100 caracteres",

  notMaxNumber = "El número máximo no es válido",
  notMinNumber = "El número mínimo no es válido",
  isNotInteger = "No es un número entero",
  notPositive = "No es un número positivo",

  notValidEmail = "No es un correo válido",
  notNull = "No puede ser nulo",
  isNotStrongPassword = "Clave poco segura",
  isNotEmptyString = "No puede estar vacío",

  defaultNotValid = "No válido",
  notValidIdUser = "El ID debe tener el formato (user_xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx) donde (x) es una letra o número en minúsculas",
  notValidNameUser = "No es un nombre/apellido válido",
  notValidBool = "No es un valor boleano válido",
  notValidLimit = "No es un rango válido",

  notRolValid = "No es un rol válido"
}

export enum EnumNameValidations {
  isNotEmptyString = "isNotEmptyString",
  sequentials = "sequentials",
  sequentialsFns = "sequentialsFns",
  isValidCelular = "isValidCelular"
}
