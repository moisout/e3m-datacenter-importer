import { createRoute } from '../methods/createRoute.ts';

export const importRoute = createRoute({
  method: 'GET',
  url: '/import',
  handler: async (request, reply) => {
    if (request.query.secretToken !== process.env.STATIC_FILE_TOKEN) {
      reply.status(403);
      return { error: 'Forbidden' };
    }

    return { status: 'ok' };
  },
});
