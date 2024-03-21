import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { TokenModule } from '../token/token.module';

@Module({
    imports: [
        TokenModule,
    ],
    providers: [MailerService],
    exports: [MailerService],
})
export class MailerModule {
}
