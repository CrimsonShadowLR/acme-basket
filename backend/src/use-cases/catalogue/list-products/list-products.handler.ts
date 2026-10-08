import { Inject, Injectable } from '@nestjs/common';
import { Catalogue } from '../../../domain/catalogue/catalogue.js';
import type { Handler } from '../../shared/handler.js';
import type { ListProductsResponse } from './list-products.response.js';

@Injectable()
export class ListProductsHandler implements Handler<
  void,
  ListProductsResponse
> {
  constructor(@Inject(Catalogue) private readonly catalogue: Catalogue) {}

  execute(): ListProductsResponse {
    return {
      products: this.catalogue
        .all()
        .map(({ code, name, price }) => ({ code, name, price })),
    };
  }
}
