import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { v4 } from 'uuid';

@Injectable()
export class TokenService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {
    }

    public generateTokens(payload: object) {
        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('SECRET_ACCESS'),
            expiresIn: this.configService.get<string>('JWT_EXPIRES_IN_SHORT'),
            algorithm: 'HS256',
        });
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('SECRET_REFRESH'),
            expiresIn: this.configService.get<string>('JWT_EXPIRES_IN_LONG'),
            algorithm: 'HS256',
            jwtid: v4(),
        });

        return { accessToken, refreshToken };
    }

    /**
     * Verify and returns payload if token is valid
     * @param token - token that will be verified
     */
    public verifyRefreshToken(token: string) {
        try {
            return this.jwtService.verify(
                token,
                {
                    secret: this.configService.get<string>('SECRET_REFRESH'),
                    ignoreExpiration: false,
                    algorithms: ['HS256'],
                });
        } catch (e) {
            throw new UnauthorizedException();
        }
    }

    public generateTokenEmail(payload: object) {
        return this.jwtService.sign(payload, {
            secret: this.configService.get<string>('SECRET_ACCESS'),
            expiresIn: this.configService.get<string>('JWT_EXPIRES_IN_SHORT'),
            algorithm: 'HS256'
        });
    }
}
