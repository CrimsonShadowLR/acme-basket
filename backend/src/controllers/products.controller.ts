import { Controller, Get, Inject } from '@nestjs/common';
import { ListProductsHandler } from '../use-cases/catalogue/list-products/list-products.handler.js';
import type { ListProductsResponse } from '../use-cases/catalogue/list-products/list-products.response.js';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(ListProductsHandler)
    private readonly listProducts: ListProductsHandler,
  ) {}

  @Get()
  list(): ListProductsResponse {
    return this.listProducts.execute();
  }
}
