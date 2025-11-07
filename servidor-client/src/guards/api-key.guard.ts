import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { envs } from '../../envs';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<{ headers: Record<string, string> }>();
    const apiKey = request.headers['x-api-key'] as string | undefined;

    if (!apiKey || apiKey !== envs.API_KEY) {
      throw new UnauthorizedException({
        statusCode: 401,
        message: 'API Key inválida o no proporcionada',
        error: 'Unauthorized',
      });
    }

    return true;
  }
}
