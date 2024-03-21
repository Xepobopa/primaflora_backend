import { Module } from '@nestjs/common';
import { AuthorizationService } from './authorization.service';
import { AuthorizationController } from './authorization.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { TokenModule } from '../token/token.module';
import { MailerModule } from '../mailer/mailer.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('SECRET'),
                signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN_SHORT') },
            }),
            inject: [ConfigService],
        }),
        CacheModule.register(),
        UserModule,
        MailerModule,
        TokenModule,
    ],
    controllers: [AuthorizationController],
    providers: [AuthorizationService],
    exports: [AuthorizationModule],
})
export class AuthorizationModule {
}
