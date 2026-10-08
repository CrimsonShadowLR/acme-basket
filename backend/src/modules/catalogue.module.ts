import { Module } from '@nestjs/common';
import { ProductsController } from '../controllers/products.controller.js';
import { Catalogue } from '../domain/catalogue/catalogue.js';
import { acmeProducts } from '../infrastructure/acme-pricing.js';
import { ListProductsHandler } from '../use-cases/catalogue/list-products/list-products.handler.js';

@Module({
  controllers: [ProductsController],
  providers: [
    { provide: Catalogue, useFactory: () => new Catalogue(acmeProducts) },
    ListProductsHandler,
  ],
  exports: [Catalogue],
})
export class CatalogueModule {}
