import { UserDto } from './user.dto';
import { OmitType } from '@nestjs/mapped-types';

export class CreateUserDto extends OmitType(UserDto, ['is_activated'] as const) {
}
