import { EnvService } from '@/core/env.service';
import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { isAxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import { ErrorLogFormatter } from '@/utils';
import type {
  CartDto,
  GetCartsResponseDto,
  GetUsersResponseDto,
} from './dtos';
import { cartSchema } from './dtos/carts.dto';

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

  async getUsers(): Promise<GetUsersResponseDto> {
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

  async getCarts(): Promise<GetCartsResponseDto> {
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

  /** `cartId` é o identificador do carrinho na API externa (ex.: `Transaction.externalId`). */
  async getCartById(cartId: number): Promise<CartDto> {
    const url = `${this.baseUrl}/carts/${cartId}`;
    try {
      const response = await firstValueFrom(this.httpService.get(url));
      const data = cartSchema.parse(response.data);
      this.logger.log(`External API getCartById ok: ${url}`);
      return data;
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 404) {
        throw new NotFoundException(
          `Carrinho ${cartId} não encontrado na API externa.`,
        );
      }
      ErrorLogFormatter.logError(
        this.logger,
        `External API getCartById failed: ${url}`,
        err,
      );
      throw new ServiceUnavailableException(
        'Não foi possível obter o carrinho da API externa.',
      );
    }
  }
}
