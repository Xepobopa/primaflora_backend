import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { hash } from 'bcrypt';

@Injectable()
export class UserService {
    constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>) {
    }

    public async create(newUser: CreateUserDto) {
        return this.userRepository.save({
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

    public async findOneById(uuid: string) {
        return await this.userRepository.findOneOrFail({ where: { uuid } });
    }

    public async findOneByIdWithLikes(uuid: string) {
        return await this.userRepository.findOneOrFail({ where: { uuid }, relations: { likes: true } });
    }

    public async findOneByLogin(login: string) {
        return await this.userRepository.findOneOrFail({ where: { login } });
    }

    public async activate(uuid: string) {
        //        return await this.userRepository
        //             .createQueryBuilder()
        //             .update(UserEntity)
        //             .set({ is_activated: true })
        //             .where("uuid = :uuid", { uuid })
        //             .execute();

        const user = await this.findOneById(uuid);
        if (user.is_activated)
            throw new BadRequestException('User already activated');

        return await this.userRepository.update({ uuid }, { is_activated: true });
    }

    // test
    public async getAllUsers() {
        return await this.userRepository.find();
    }
}
