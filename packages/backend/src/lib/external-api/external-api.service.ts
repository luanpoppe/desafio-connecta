import { EnvService } from '@/core/env.service';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { GetCartsResponseDto, GetUsersResponseDto } from './dtos';

@Injectable()
export class ExternalApiService {
  constructor(
    private readonly httpService: HttpService,
    private readonly envService: EnvService,
  ) {}

  async getUsers() {
    const url = `${this.envService.getEnvs().EXTERNAL_API_URL}/users`;
    const response = await firstValueFrom(
      this.httpService.get<GetUsersResponseDto>(url),
    );
    return response.data;
  }

  async getCarts() {
    const url = `${this.envService.getEnvs().EXTERNAL_API_URL}/carts`;
    const response = await firstValueFrom(
      this.httpService.get<GetCartsResponseDto>(url),
    );
    return response.data;
  }
}
