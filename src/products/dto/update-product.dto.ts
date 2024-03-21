import { PartialType } from '@nestjs/swagger';
import { ProductDto } from './product.dto';

export class UpdateProductDto extends PartialType(ProductDto) {
}
