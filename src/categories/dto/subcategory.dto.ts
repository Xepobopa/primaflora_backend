import { IsString, IsUrl } from 'class-validator';
import { AbstractDto } from '../../dto/abstract.dto';

export class SubcategoryDto extends AbstractDto {
    @IsUrl()
    image: string;

    @IsString()
    desc: string;

    @IsString()
    parent_uid: string;
}
