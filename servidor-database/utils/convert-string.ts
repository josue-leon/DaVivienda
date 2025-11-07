import { CustomError } from "src/globals/custom.errors"

import { EnumError400 } from "~/globals/errors"

export const capitalizeFirst = (str?: string): string => {
  if (str == undefined) throw new CustomError(EnumError400.ValorNoDefinido)

  return str.match("^[a-z]") ? str.charAt(0).toUpperCase() + str.substring(1) : str
}
