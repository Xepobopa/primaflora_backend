import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const AcceptLanguage = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.headers['accept-language'];
    }
);
