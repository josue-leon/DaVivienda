import { Controller } from "@nestjs/common"
import { ApiSecurity, ApiTags } from "@nestjs/swagger"

@ApiTags("Clientes")
@ApiSecurity("api-key")
@Controller("clientes")
export class ClienteController {
  constructor() {}
}
