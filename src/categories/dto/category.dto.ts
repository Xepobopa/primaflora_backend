import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested } from 'class-validator';
import { AbstractDto } from '../../dto/abstract.dto';

export class CategoryDto extends AbstractDto {
    @IsString()
    public name: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => String)
    public childrens_uid: Array<string>;
    // @IsNumber()
    // public parent_id: number;

    // @IsArray()
    // @ValidateNested({ each: true })
    // @Type(() => Number)
    // products_id: number[];
}
