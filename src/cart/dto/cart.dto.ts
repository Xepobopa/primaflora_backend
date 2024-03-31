import { IsNumber, Min } from 'class-validator';

export class CartDto {
    public user_uuid: string;

    public product_uuid: string;

    @IsNumber()
    @Min(1)
    public quantity: number;
}