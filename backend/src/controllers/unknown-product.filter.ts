import {
  Catch,
  HttpStatus,
  type ArgumentsHost,
  type ExceptionFilter,
} from '@nestjs/common';
import type { Response } from 'express';
import { UnknownProductError } from '../domain/catalogue/catalogue.js';

/** The request was well formed but names a product the catalogue lacks. */
@Catch(UnknownProductError)
export class UnknownProductFilter implements ExceptionFilter {
  catch(error: UnknownProductError, host: ArgumentsHost): void {
    host
      .switchToHttp()
      .getResponse<Response>()
      .status(HttpStatus.UNPROCESSABLE_ENTITY)
      .json({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        error: 'Unknown product',
        message: error.message,
        code: error.code,
      });
  }
}
