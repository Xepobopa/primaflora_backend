import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { VerificationEntity } from 'src/entity/verification.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { TokenService } from 'src/token/token.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        @InjectRepository(VerificationEntity)
        private verificationRepository: Repository<VerificationEntity>,
        private tokenService: TokenService
    ) {}

    public async create(newUser: CreateUserDto) {
        return await this.userRepository.save({
            login: newUser.login,
            name: newUser.name,
            phone: newUser.phone,
            consultation_allowed: newUser.consultation_allowed,
            email: newUser.email,
            phone_allowed: newUser.phone_allowed,
            is_activated: false,
            password: await hash(newUser.password, 10),
            cart: [],
        });
    }

    public async findOneByToken(token: string) {
        const payload = this.tokenService.verifyToken(token, 'access');
        return await this.findOneById(payload.uuid);
    }

    public async findOneById(uuid: string) {
        return await this.userRepository.findOneOrFail({ where: { uuid } });
    }

    public async findOneByIdWithLikes(uuid: string) {
        return await this.userRepository.findOneOrFail({
            where: { uuid },
            relations: { likes: true },
        });
    }

    public async findOneByLogin(login: string) {
        try {
            return await this.userRepository.findOneOrFail({
                where: { login },
            });
        } catch (error) {
            throw new BadRequestException('User not found');
        }
    }

    public async updateUser(token: string, updateUser: UpdateUserDto) {
        const payload = this.tokenService.verifyToken(token, 'access');
        return this.userRepository.update({ uuid: payload.uuid }, { name: 'New value' });
    }

    private generateSixDigitCode() {
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += Math.floor(Math.random() * 10);
        }
        return code;
    }

    public async createVerificationCode(user: UserEntity) {
        return await this.verificationRepository.save({
            user,
            exp: new Date(Date.now() + 1000 * 60 * 10), // 10 minutes
            code: this.generateSixDigitCode(),
        });
    }

    public async activate(code: string) {
        try {
            const verify = await this.verificationRepository.findOneOrFail({
                where: { code },
                relations: { user: true },
            });

            console.log('verify: ', verify);

            if (new Date() > new Date(verify.exp)) {
                this.verificationRepository.delete(verify);
                throw new BadRequestException('Code expired');
            }

            return await this.userRepository.save({
                ...verify.user,
                is_activated: true,
            });
        } catch (error) {
            throw new BadRequestException('Invalid code');
        }
    }

    // test
    public async getAllUsers() {
        return await this.userRepository.find();
    }
}
