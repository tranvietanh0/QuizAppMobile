import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { FastifyRequest } from "fastify";

/**
 * Custom decorator to extract the current authenticated user from the request
 * Usage: @CurrentUser() user: User
 * or @CurrentUser('id') userId: string
 */
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<FastifyRequest>();
    const user = (request as any).user;

    if (!user) {
      return null;
    }

    return data ? user[data] : user;
  }
);
