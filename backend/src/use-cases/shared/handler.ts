/**
 * One use case, one handler. Controllers call `execute` and don't use domain
 * objects, except domain error types, which they may import to map to HTTP
 * statuses. The handler is the only place that orchestrates the domain.
 */
export interface Handler<TRequest, TResponse> {
  execute(request: TRequest): TResponse | Promise<TResponse>;
}
