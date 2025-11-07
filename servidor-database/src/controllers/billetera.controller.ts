import { Controller } from "@nestjs/common"
import { ApiSecurity, ApiTags } from "@nestjs/swagger"

@ApiTags("Billetera")
@ApiSecurity("api-key")
@Controller("billetera")
export class BilleteraController {
  constructor() {}
}
