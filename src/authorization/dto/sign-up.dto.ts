import { IsBoolean, IsEmail, IsPhoneNumber, IsString, IsStrongPassword, Length } from 'class-validator';

export class SignUpDto {
    @IsString()
    @Length(4, 50)
    public name: string;

    @IsString()
    @IsPhoneNumber()
    public phone: string;

    @IsString()
    @IsEmail()
    public email: string;

    @IsString()
    public login: string;

    @IsString()
    @IsStrongPassword({
        minLength: 7,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1,
        minLowercase: 1,
    })
    public password1: string;
    @IsString()
    public password2: string;

    @IsBoolean()
    public phone_allowed: boolean;

    @IsBoolean()
    public consultation_allowed: boolean;
}