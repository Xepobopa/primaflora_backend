import { PartialType } from '@nestjs/swagger';
import { ProductTranslateDto } from './create-product.dto';
import { ProductDto } from './product.dto';

export class UpdateProductDto extends PartialType(ProductDto) {
    translate: ProductTranslateDto;
}
