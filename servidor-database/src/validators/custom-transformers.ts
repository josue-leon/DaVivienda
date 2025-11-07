import { Transform, TransformFnParams } from "class-transformer"

/**
 * Si es numero, devuelve solo su valor entero caso contrario conserva el valor original
 * @returns
 */
export const ConvertNotDecimalNumberOrAny = () =>
  Transform(({ value }: TransformFnParams): unknown => {
    return typeof value === "number" ? Math.floor(value) : value
  })

/**
 * Si es string convierte a numero entero caso contrario conserva el valor original
 * @returns
 */
export const ConvertStrToIntOrNot = () =>
  Transform(({ value }: TransformFnParams): unknown =>
    typeof value === "string" && !isNaN(Number(value)) ? parseInt(value) : value
  )

// function TrimString() {
//   return Transform(({ value }) => (typeof value === "string" ? value?.trim() : value))
// }

const trim = (params: TransformFnParams): unknown =>
  typeof params.value === "string" ? params.value?.trim() : params.value

const lowerCase = (params: TransformFnParams): unknown =>
  typeof params.value === "string" ? params.value?.toLowerCase().trim() : params.value

export const TrimString = () => Transform(trim)
export const ConvertLowerCase = () => Transform(lowerCase)
