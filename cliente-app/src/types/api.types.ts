export interface ConsultarSaldoParams {
  documento: string;
  celular: string;
}

// ============= Errores =============

export interface ErrorResponse {
  statusCode: number;
  message: string;
  title?: string;
  subMessage?: string;
  tag?: string;
  details?: object;
  path: string;
  timestamp: string;
  validations?: Array<{
    property: string;
    constraints: Record<string, string>;
  }>;
  code?: number;
}
