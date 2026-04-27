import type { EnvService } from '@/core/env.service';
import { HttpService } from '@nestjs/axios';
import {
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { AxiosError } from 'axios';
import { of, throwError } from 'rxjs';
import { ExternalApiService } from '../external-api.service';

/* eslint-disable-next-line no-var -- jest.mock is hoisted; var avoids TDZ so the factory can assign the spy. */
var logErrorSpy: jest.Mock;

jest.mock('@/utils', () => {
  logErrorSpy = jest.fn();
  return {
    ErrorLogFormatter: {
      logError: logErrorSpy,
    },
  };
});

const minimalProduct = {
  id: 1,
  title: 't',
  price: 1,
  quantity: 1,
  total: 1,
  discountPercentage: 0,
  discountedTotal: 1,
  thumbnail: 'x',
};

const minimalCart = {
  id: 1,
  products: [minimalProduct],
  total: 1,
  discountedTotal: 1,
  userId: 1,
  totalProducts: 1,
  totalQuantity: 1,
};

const minimalCartsResponse = {
  carts: [minimalCart],
  total: 1,
  skip: 0,
  limit: 10,
};

const minimalUsersResponse = {
  users: [],
  total: 0,
  skip: 0,
  limit: 10,
};

describe('ExternalApiService', () => {
  const httpGet = jest.fn();
  const httpService = { get: httpGet } as unknown as HttpService;

  const envService = {
    getEnvs: jest.fn().mockReturnValue({
      EXTERNAL_API_URL: 'https://dummy.test',
    }),
  } as unknown as EnvService;

  beforeEach(() => {
    jest.clearAllMocks();
    httpGet.mockReset();
    envService.getEnvs = jest.fn().mockReturnValue({
      EXTERNAL_API_URL: 'https://dummy.test',
    });
  });

  const createService = () => new ExternalApiService(httpService, envService);

  it('getUsers returns response data on success', async () => {
    httpGet.mockReturnValue(of({ data: minimalUsersResponse }));
    const data = await createService().getUsers();
    expect(data).toEqual(minimalUsersResponse);
    expect(httpGet).toHaveBeenCalledWith('https://dummy.test/users');
  });

  it('getUsers wraps failures as ServiceUnavailableException', async () => {
    httpGet.mockReturnValue(throwError(() => new Error('network')));
    await expect(createService().getUsers()).rejects.toBeInstanceOf(
      ServiceUnavailableException,
    );
    expect(logErrorSpy).toHaveBeenCalled();
  });

  it('getCarts returns response data on success', async () => {
    httpGet.mockReturnValue(of({ data: minimalCartsResponse }));
    const data = await createService().getCarts();
    expect(data).toEqual(minimalCartsResponse);
    expect(httpGet).toHaveBeenCalledWith('https://dummy.test/carts');
  });

  it('getCarts wraps failures as ServiceUnavailableException', async () => {
    httpGet.mockReturnValue(throwError(() => new Error('network')));
    await expect(createService().getCarts()).rejects.toBeInstanceOf(
      ServiceUnavailableException,
    );
  });

  it('getCartById parses cart with Zod and returns it', async () => {
    httpGet.mockReturnValue(of({ data: minimalCart }));
    const cart = await createService().getCartById(5);
    expect(cart).toEqual(minimalCart);
    expect(httpGet).toHaveBeenCalledWith('https://dummy.test/carts/5');
  });

  it('getCartById maps axios 404 to NotFoundException', async () => {
    const err = new AxiosError('nf');
    err.response = { status: 404 } as never;
    httpGet.mockReturnValue(throwError(() => err));
    await expect(createService().getCartById(9)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('getCartById maps other errors to ServiceUnavailableException', async () => {
    httpGet.mockReturnValue(throwError(() => new Error('network')));
    await expect(createService().getCartById(1)).rejects.toBeInstanceOf(
      ServiceUnavailableException,
    );
  });

  it('getCartsByUser parses response with Zod', async () => {
    httpGet.mockReturnValue(of({ data: minimalCartsResponse }));
    const data = await createService().getCartsByUser(3);
    expect(data).toEqual(minimalCartsResponse);
    expect(httpGet).toHaveBeenCalledWith('https://dummy.test/carts/user/3');
  });

  it('getCartsByUser wraps failures as ServiceUnavailableException', async () => {
    httpGet.mockReturnValue(throwError(() => new Error('network')));
    await expect(createService().getCartsByUser(2)).rejects.toBeInstanceOf(
      ServiceUnavailableException,
    );
  });
});
