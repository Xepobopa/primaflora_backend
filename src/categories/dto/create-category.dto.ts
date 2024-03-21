import { CategoryDto } from './category.dto';
import { PickType } from '@nestjs/swagger';

export class CreateCategoryDto extends PickType(CategoryDto, ['name', 'parent_id'] as const) {}