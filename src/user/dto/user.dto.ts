import { IsBoolean, IsEmail, IsPhoneNumber, IsString } from 'class-validator';
import { CartDto } from '../../cart/dto/cart.dto';

export class UserDto {
    @IsString()
    public name: string;

    @IsString()
    public login: string;

    @IsString()
    @IsEmail()
    public email: string;

    @IsString()
    @IsPhoneNumber()
    public phone: string;

    @IsBoolean()
    public is_activated: boolean;

    @IsString()
    public password: string;

    @IsBoolean()
    public phone_allowed: boolean;

    @IsBoolean()
    public consultation_allowed: boolean;

    public cart: CartDto;
}