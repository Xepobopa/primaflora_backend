import { CategoryDto } from './category.dto';
import { PickType } from '@nestjs/swagger';

export class CreateCategoryDto extends PickType(CategoryDto, [
    'name',
    'childrens_uid',
] as const) {}
