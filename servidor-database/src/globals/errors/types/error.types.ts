import { HttpStatus } from "@nestjs/common"

import { ErrorCustomEntity } from "~/globals/http-exception.filter"

import { EnumError400 } from "../enums/error-400.enum"
import { EnumError401 } from "../enums/error-401.enum"
import { EnumError403 } from "../enums/error-403.enum"
import { EnumError404 } from "../enums/error-404.enum"
import { EnumError409 } from "../enums/error-409.enum"
import { EnumError500 } from "../enums/error-500.enum"

export type TypeEnumError =
  | EnumError400
  | EnumError401
  | EnumError403
  | EnumError404
  | EnumError409
  | EnumError500

export type TError400 = Record<
  EnumError400,
  ErrorCustomEntity & {
    statusCode: HttpStatus.BAD_REQUEST
  }
>

export type TError401 = Record<
  EnumError401,
  ErrorCustomEntity & {
    statusCode: HttpStatus.UNAUTHORIZED
  }
>

export type TError404 = Record<
  EnumError404,
  ErrorCustomEntity & {
    statusCode: HttpStatus.NOT_FOUND
  }
>

export type TError403 = Record<
  EnumError403,
  ErrorCustomEntity & {
    statusCode: HttpStatus.FORBIDDEN
  }
>

export type TError409 = Record<
  EnumError409,
  ErrorCustomEntity & {
    statusCode: HttpStatus.CONFLICT
  }
>

export type TError500 = Record<
  EnumError500,
  ErrorCustomEntity & {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR
  }
>
