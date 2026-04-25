import { EnvService } from '@/core/env.service';
import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ErrorLogFormatter } from '@/utils';
import { GetCartsResponseDto, GetUsersResponseDto } from './dtos';

@Injectable()
export class ExternalApiService {
  private readonly logger = new Logger(ExternalApiService.name);
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly envService: EnvService,
  ) {
    this.baseUrl = this.envService.getEnvs().EXTERNAL_API_URL;
  }

  async getUsers() {
    const url = `${this.baseUrl}/users`;
    try {
      const response = await firstValueFrom(
        this.httpService.get<GetUsersResponseDto>(url),
      );

      const data = response.data;
      this.logger.log(
        `External API getUsers ok: ${url} (total=${data.total}, returned=${data.users.length})`,
      );

      return data;
    } catch (err) {
      ErrorLogFormatter.logError(
        this.logger,
        `External API getUsers failed: ${url}`,
        err,
      );
      throw new ServiceUnavailableException(
        'Não foi possível obter usuários da API externa.',
      );
    }
  }

  async getCarts() {
    const url = `${this.baseUrl}/carts`;
    try {
      const response = await firstValueFrom(
        this.httpService.get<GetCartsResponseDto>(url),
      );

      const data = response.data;
      this.logger.log(
        `External API getCarts ok: ${url} (total=${data.total}, returned=${data.carts.length})`,
      );

      return data;
    } catch (err) {
      ErrorLogFormatter.logError(
        this.logger,
        `External API getCarts failed: ${url}`,
        err,
      );
      throw new ServiceUnavailableException(
        'Não foi possível obter carrinhos da API externa.',
      );
    }
  }
}
