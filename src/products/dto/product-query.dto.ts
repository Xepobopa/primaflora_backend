import { IsBoolean, IsNumber, IsOptional, IsString, Min } from 'class-validator';
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

    @IsBoolean()
    @IsOptional()
    @Transform(({ value }) => Boolean(value))
    public isTop: boolean;

    @IsBoolean()
    @IsOptional()
    @Transform(({ value }) => Boolean(value))
    public isRelevant: boolean;

    @IsNumber()
    @Min(1)
    @Transform(({ value }) => Number(value))
    @IsOptional()
    public take: number;
}