import { IsNumber, IsString, IsUUID, Min } from 'class-validator';

export class CartDto {
    @IsString()
    @IsUUID()
    public userId: string;

    @IsString()
    @IsUUID()
    public productId: string;

    @IsNumber()
    @Min(1)
    public quantity: number;
}