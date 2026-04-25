import { EnvService } from '@/core/env.service';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ErrorLogFormatter } from '@/utils';
import { GetCartsResponseDto, GetUsersResponseDto } from './dtos';

@Injectable()
export class ExternalApiService {
  private readonly logger = new Logger(ExternalApiService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly envService: EnvService,
  ) {}

  async getUsers() {
    const url = `${this.envService.getEnvs().EXTERNAL_API_URL}/users`;
    try {
      const response = await firstValueFrom(
        this.httpService.get<GetUsersResponseDto>(url),
      );
      return response.data;
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
    const url = `${this.envService.getEnvs().EXTERNAL_API_URL}/carts`;
    try {
      const response = await firstValueFrom(
        this.httpService.get<GetCartsResponseDto>(url),
      );
      return response.data;
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
