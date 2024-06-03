import { IsNumber, IsString, IsUUID, Min } from 'class-validator';

export class CartDto {
    @IsString()
    @IsUUID()
    public userUId: string;

    @IsString()
    @IsUUID()
    public productUId: string;

    @IsNumber()
    @Min(1)
    public quantity: number;
}
