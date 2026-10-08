/**
 * One use case, one handler. Controllers call `execute` and never reach into
 * the domain themselves; the handler is the only place that orchestrates it.
 */
export interface Handler<TRequest, TResponse> {
  execute(request: TRequest): TResponse | Promise<TResponse>;
}
