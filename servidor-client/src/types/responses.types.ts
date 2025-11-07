export interface ClienteResponse {
  id: string;
  documento: string;
  nombres: string;
  email: string;
  celular: string;
  saldo: number;
  createdAt: string;
  updatedAt: string;
}

export interface RecargaResponse {
  cliente: {
    id: string;
    documento: string;
    nombres: string;
    email: string;
    celular: string;
    saldo: number;
  };
  mensaje: string;
}

export interface PagoIniciadoResponse {
  id_sesion: string;
  mensaje: string;
}

export interface ConfirmarPagoResponse {
  cliente: {
    id: string;
    documento: string;
    nombres: string;
    saldo: number;
  };
  mensaje: string;
}

export interface SaldoResponse {
  cliente: {
    documento: string;
    nombres: string;
    saldo: number;
  };
  estadisticas: {
    totalRecargas: number;
    totalCompras: number;
  };
}
