import { AbstractDto } from '../../dto/abstract.dto';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CategoryDto extends AbstractDto {
    @IsString()
    public name: string;

    @IsNumber()
    public parent_id: number

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Number)
    products_id: number[];
}