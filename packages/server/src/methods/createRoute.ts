import type {
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
  RouteOptions,
} from 'fastify';

interface CreateRouteOptions
  extends RouteOptions<
    RawServerDefault,
    RawRequestDefaultExpression<RawServerDefault>,
    RawReplyDefaultExpression<RawServerDefault>,
    {
      Querystring: {
        secretToken: string;
        limit?: string;
      };
    }
  > {}

export const createRoute = (routeOptions: CreateRouteOptions) => {
  return routeOptions;
};
