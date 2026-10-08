import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Inject,
  Post,
  UseFilters,
} from '@nestjs/common';
import { PriceBasketHandler } from '../use-cases/basket/price-basket/price-basket.handler.js';
import type { PriceBasketRequest } from '../use-cases/basket/price-basket/price-basket.request.js';
import type { PriceBasketResponse } from '../use-cases/basket/price-basket/price-basket.response.js';
import { UnknownProductFilter } from './unknown-product.filter.js';

/** Caps the work one request can ask for. No real basket comes close. */
const MAX_ITEMS = 1000;

@Controller('basket')
@UseFilters(UnknownProductFilter)
export class BasketController {
  constructor(
    @Inject(PriceBasketHandler)
    private readonly priceBasket: PriceBasketHandler,
  ) {}

  @Post('total')
  @HttpCode(200)
  total(@Body() body: unknown): PriceBasketResponse {
    return this.priceBasket.execute(toRequest(body));
  }
}

function toRequest(body: unknown): PriceBasketRequest {
  const items: unknown =
    typeof body === 'object' && body !== null
      ? (body as Record<string, unknown>).items
      : undefined;

  if (
    !Array.isArray(items) ||
    !items.every((code) => typeof code === 'string')
  ) {
    throw new BadRequestException('items must be an array of product codes');
  }
  if (items.length > MAX_ITEMS) {
    throw new BadRequestException(
      `items cannot hold more than ${MAX_ITEMS} codes`,
    );
  }
  return { items };
}
