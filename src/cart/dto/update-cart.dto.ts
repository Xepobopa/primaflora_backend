import { PartialType, PickType } from '@nestjs/swagger';
import { CartDto } from './cart.dto';

export class UpdateCartDto extends PartialType(PickType(CartDto, ['quantity'] as const)) {
}
