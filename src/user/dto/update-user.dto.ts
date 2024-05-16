import { OmitType, PartialType } from '@nestjs/mapped-types';
import { UserDto } from './user.dto';

export class UpdateUserDto extends PartialType(
    OmitType(UserDto, ['is_activated', 'cart'] as const)
) {}
