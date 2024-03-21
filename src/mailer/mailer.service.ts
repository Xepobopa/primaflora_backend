import { Injectable } from '@nestjs/common';
import { UserDto } from '../user/dto/user.dto';
import { TokenService } from '../token/token.service';
import { ITemplates } from './interfaces/template.interface';
import { ITemplatedData } from './interfaces/template-data.interface';
import { createTransport, Transporter } from 'nodemailer';
import { readFileSync } from 'fs';
import { join } from 'path';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import Handlebars from 'handlebars'

@Injectable()
export class MailerService {
    // private readonly templates: ITemplates;
    // private readonly transport: Transporter<SMTPTransport.SentMessageInfo>;
    //
    // constructor(private readonly tokenService: TokenService) {
    //     this.transport = createTransport({
    //
    //     })
    //     this.templates = {
    //         confirmation: MailerService.parseTemplate('confirmation.hbs'),
    //         resetPassword: MailerService.parseTemplate('reset-password.hbs'),
    //     };
    // }
    //
    // private static parseTemplate(name: string) {
    //     const templateText = readFileSync(
    //         join(__dirname, 'templates', name),
    //         'utf-8',
    //     );
    //
    //     return Handlebars.compile<ITemplatedData>(templateText, { strict: true });
    // }
    //
    // public sendConfirmationEmail(user: UserDto) {
    //     const { email, name } = user;
    //     const token = this.tokenService.generateTokenEmail({...user});
    //     const html = this.templates.confirmation({
    //         name,
    //         link: `https://${token}/auth/confirm/${token}`,
    //     });
    //
    //     this.sendEmail(email, 'A new confirmation email was sent.', html);
    // }
    //
    // public sendEmail(
    //     to: string,
    //     subject: string,
    //     html: string,
    // ) {
    //     this.transport.sendMail({
    //         to,
    //         from: 'ismartsdn4477@gmail.com',
    //         subject,
    //         html,
    //     })
    //         .then(res => console.log(('[INFO] Email: res')))
    //         .catch(err => console.log(('[INFO] Email: res')));
    // }
}
