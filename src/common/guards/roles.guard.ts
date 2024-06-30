import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { EUserRole } from "src/enum/role.enum";
import { TokenService } from "src/token/token.service";
import { ROLE_METADATA_KEY } from "../decorators/role.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector, 
        @Inject(TokenService) private readonly tokenService: TokenService
    ) {}

    canActivate(context: ExecutionContext): boolean {
        const role = this.reflector.get<EUserRole>(ROLE_METADATA_KEY, context.getHandler());
        if (!role) {
            return false;
        }

        const request: Request = context.switchToHttp().getRequest();
        if (!request.headers.authorization) {
            console.error("RoleGuard is false, because can't find access token in headers");
            return false;
        }
        const token = request.headers.authorization.replace('Bearer ', '');
        const userFromToken = this.tokenService.verifyToken(token, 'access');

        return userFromToken.role.name === role;
    }
}