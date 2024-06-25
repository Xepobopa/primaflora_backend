import { IsNumber, IsPositive, IsString, IsUrl, Min } from 'class-validator';

export class CreateProductDto {
    @IsString()
    @IsUrl()
    public photo_url: string;

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

    public translate: ProductTranslateDto[];
}

export class ProductTranslateDto {
    @IsString()
    public title: string;

    @IsString()
    public desc: string;

    @IsString()
    public language: string;
}
