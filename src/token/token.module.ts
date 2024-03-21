import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                verifyOptions: { ignoreExpiration: false, algorithms: ['HS256'] },
                signOptions: { algorithm: 'HS256' }
            }),
            inject: [ConfigService]
        })
    ],
    providers: [TokenService],
    exports: [TokenService]
})
export class TokenModule {
}
