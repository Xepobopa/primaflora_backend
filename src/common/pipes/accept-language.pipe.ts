import { BadRequestException, PipeTransform } from '@nestjs/common';

export class ValidateLanguagePipe implements PipeTransform {
    transform(value: any) {
        if (!value) return;
        if (Number(value) || value.length !== 3) return value;

        const allowedLanguages = ['rus', 'ukr'];
        if (!allowedLanguages.includes(String(value))) {
            throw new BadRequestException(
                `Invalid language. Only ${allowedLanguages} are allowed`
            );
        }

        return value;
    }
}
