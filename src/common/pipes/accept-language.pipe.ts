import { BadRequestException, PipeTransform } from '@nestjs/common';

export class ValidateLanguagePipe implements PipeTransform {
    transform(value: any) {
        if (Number(value)) return value;

        const allowedLanguages = ['rus', 'ukr'];
        if (!allowedLanguages.includes(value)) {
            throw new BadRequestException(
                `Invalid language. Only ${allowedLanguages} are allowed`
            );
        }

        return value;
    }
}
