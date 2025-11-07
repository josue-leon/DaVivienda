import { Injectable, Logger } from "@nestjs/common"

@Injectable()
export class ClienteService {
  private readonly logger = new Logger(ClienteService.name)

  constructor() {
    this.logger.log("> Instancia creada para <ClienteService>")
  }
}
