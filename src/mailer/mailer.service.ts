import { Injectable } from '@nestjs/common';
import { ITemplatedData } from './interfaces/template-data.interface';
import { ITemplates } from './interfaces/template.interface';
import { createTransport, Transporter } from 'nodemailer';
import { UserEntity } from 'src/entity/user.entity';
import { readFileSync } from 'fs';
import { join } from 'path';
import Handlebars from 'handlebars';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class MailerService {
    private readonly templates: ITemplates;
    private readonly transport: Transporter<SMTPTransport.SentMessageInfo>;

    constructor() {
        this.transport = createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // true for 465
            auth: {
                user: 'ismartsdn4477@gmail.com',
                pass: 'emfoickszoufvocd',
            },
        });
        this.templates = {
            confirmation: MailerService.parseTemplate('confirmation.hbs'),
            resetPassword: MailerService.parseTemplate('reset-password.hbs'),
        };
    }

    private static parseTemplate(name: string) {
        // eslint-disable-next-line prettier/prettier
        const templateText = readFileSync(join(process.cwd(), '/src/mailer/templates', name), 'utf-8');

        return Handlebars.compile<ITemplatedData>(templateText, {
            strict: true,
        });
    }

    public sendConfirmationEmail(user: UserEntity, code: string) {
        const { email, name } = user;
        const html = this.templates.confirmation({
            name,
            code,
        });

        this.sendEmail(email, 'A new confirmation email was sent.', html);
    }

    public sendEmail(to: string, subject: string, html: string) {
        this.transport
            .sendMail({
                to,
                from: 'ismartsdn4477@gmail.com',
                subject,
                html,
            })
            .then(res => console.log('[INFO] Email: ', res))
            .catch(err => console.log('[INFO] Email: ', err));
    }
}
