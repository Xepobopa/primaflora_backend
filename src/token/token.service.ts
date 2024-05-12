import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {}

    public generateTokens(payload: object) {
        console.log('payload: ', payload);

        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('SECRET_ACCESS'),
            expiresIn: this.configService.get<string>('JWT_EXPIRES_IN_SHORT'),
            algorithm: 'HS256',
            allowInvalidAsymmetricKeyTypes: false,
            allowInsecureKeySizes: false,
        });
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('SECRET_REFRESH'),
            expiresIn: this.configService.get<string>('JWT_EXPIRES_IN_LONG'),
            algorithm: 'HS256',
            allowInvalidAsymmetricKeyTypes: false,
            allowInsecureKeySizes: false,
        });

        return { accessToken, refreshToken };
    }

    /**
     * Verify and return payload if token is valid
     * @param token  -  Token that will be verified
     * @param tokenType  -  'access' or 'refresh'
     */
    public verifyToken(token: string, tokenType: 'access' | 'refresh') {
        try {
            return this.jwtService.verify(token, {
                secret:
                    tokenType === 'access'
                        ? this.configService.get<string>('SECRET_ACCESS')
                        : this.configService.get<string>('SECRET_REFRESH'),
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
            algorithm: 'HS256',
        });
    }
}
