import { AbstractDto } from 'src/dto/abstract.dto';
import { UserDto } from './user.dto';

export class VerificationDto extends AbstractDto {
    public code: string;

    public user: UserDto;

    public exp: Date;
}
