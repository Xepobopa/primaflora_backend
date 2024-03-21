import { IsNumber, IsPositive, IsString, IsUrl, Min } from 'class-validator';

export class ProductDto {
    @IsString()
    @IsUrl()
    public photo_url: string;

    @IsString()
    public title: string;

    @IsString()
    public desc: string;

    @IsNumber()
    @IsPositive()
    public price_currency: number;

    @IsNumber()
    @Min(0)
    public price_points: number;

    @IsNumber()
    @Min(0)
    public percent_discount: number;

    @IsNumber()
    @IsPositive()
    public rating: number;

    @IsNumber()
    @IsPositive()
    public categoryId: number;
}