import { IsBoolean, IsEmail, IsPhoneNumber, IsString, IsStrongPassword, Length } from 'class-validator';

export class SignInDto {
    @IsString()
    public login: string;

    @IsString()
    public password: string;

}