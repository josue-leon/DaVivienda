import { Injectable, Logger } from "@nestjs/common"

@Injectable()
export class BilleteraService {
  private readonly logger = new Logger(BilleteraService.name)

  constructor() {
    this.logger.log("> Instancia creada para <BilleteraService>")
  }
}
