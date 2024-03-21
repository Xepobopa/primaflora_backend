import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class ProductQueryDto {
    @IsString()
    @IsOptional()
    public categoryName: string;

    @IsNumber()
    @Min(1)
    @IsOptional()
    @Transform(({ value }) => Number(value))
    public categoryId: number;
}