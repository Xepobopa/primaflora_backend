import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
    BadRequestException,
    Inject,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { isUndefined } from '@nestjs/common/utils/shared.utils';
import { compare } from 'bcrypt';
import { Cache } from 'cache-manager';
import { randomBytes } from 'crypto';
import { UserEntity } from '../entity/user.entity';
import { MailerService } from '../mailer/mailer.service';
import { TokenService } from '../token/token.service';
import { UserService } from '../user/user.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { RoleService } from 'src/role/role.service';
import { EUserRole } from 'src/enum/role.enum';

@Injectable()
export class AuthorizationService {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly userService: UserService,
        private readonly mailerService: MailerService,
        private readonly tokenService: TokenService,
        private readonly roleService: RoleService,
    ) {}

    private generateInvitationCode() {
        return randomBytes(16).toString('hex'); // Generates a 32-character hex string
    }

    public async signUp(signUpDto: SignUpDto) {
        this.comparePasswords(signUpDto.password1, signUpDto.password2);

        const role = await this.roleService.findOne(EUserRole.USER);

        const newUser = await this.userService.create({
            consultation_allowed: signUpDto.consultation_allowed,
            phone_allowed: signUpDto.phone_allowed,
            password: signUpDto.password1,
            login: signUpDto.login,
            email: signUpDto.email,
            phone: signUpDto.phone,
            name: signUpDto.name,
            invitationCode: this.generateInvitationCode(),
        }, role);

        const code = await this.userService.createVerificationCode(
            newUser as UserEntity
        );
        console.log('Code => ', code);
        this.mailerService.sendConfirmationEmail(newUser, code.code);

        return newUser;
    }

    public async signUpWithInvitationCode(
        signUpDto: SignUpDto,
        inviteCode: string
    ) {
        console.log('[INFO] Sign in with invivte code: => ', inviteCode);
        this.comparePasswords(signUpDto.password1, signUpDto.password2);

        // find user who gave his invite code
        const inviter = await this.userService.findOneByInviteCode(inviteCode);
        // find default user role from db and attach this role to new user
        const role = await this.roleService.findOne(EUserRole.USER);

        // create new user and attach him to inviter
        const newUser = await this.userService.create({
            consultation_allowed: signUpDto.consultation_allowed,
            phone_allowed: signUpDto.phone_allowed,
            password: signUpDto.password1,
            login: signUpDto.login,
            email: signUpDto.email,
            phone: signUpDto.phone,
            name: signUpDto.name,
            invitationCode: this.generateInvitationCode(),
        }, role);

        // attach new user to inviter
        inviter.invitedUser = newUser;
        await this.userService.save(inviter);

        return newUser;
    }

    public async signIn(signIn: SignInDto) {
        const user = await this.userService.findOneByLogin(signIn.login);

        console.log('[INFO] SignInPassword: ', signIn.password);
        if (!(await compare(signIn.password, user.password))) {
            throw new BadRequestException('Password is wrong!', {
                cause: 'Password is wrong!',
                description: 'Password is wrong!',
            });
        }

        const tokens = this.tokenService.generateTokens({ ...user });
        return { ...tokens, user };
    }

    public async refreshToken(oldToken: string) {
        const decoded: UserEntity = this.tokenService.verifyToken(
            oldToken,
            'refresh'
        );

        if (!decoded) {
            throw new UnauthorizedException();
        }

        await this.checkIfTokenIsBlackListed(decoded.uuid, oldToken);
        const user = await this.userService.findOneById(decoded.uuid);
        return { ...this.tokenService.generateTokens({ ...user }), user };
    }

    public async verifyInviteCode(inviteCode: string) {
        return await this.userService.findOneByInviteCode(inviteCode);
    }

    public async logout(refreshToken: string) {
        const { exp, jti, uuid } = this.tokenService.verifyToken(
            refreshToken,
            'refresh'
        );

        await this.blackListToken(jti, uuid, exp);
    }

    // TODO: Delete in prod
    public async getAllCache() {
        const keys = await this.cacheManager.store.keys();
        console.log('KEYS: ', keys);

        const res = [];
        for (const key in keys) {
            res[key] = await this.cacheManager.get(key);
        }

        return res;
    }

    private async blackListToken(tokenId: string, userId: string, exp: number) {
        const now = Date.now();
        const ttl = exp - now;

        if (ttl > 0) {
            // set new value
            await this.cacheManager.set(
                `blacklist:${userId}:${tokenId}`,
                now,
                ttl
            );
        }
    }

    private async checkIfTokenIsBlackListed(userId: string, tokenId: string) {
        const time = await this.cacheManager.get<number>(
            `blacklist${userId}:${tokenId}`
        );

        if (!isUndefined(time)) {
            throw new UnauthorizedException('Invalid token');
        }
    }

    private comparePasswords(password1: string, password2: string) {
        if (password1 !== password2) {
            throw new BadRequestException('Passwords are not the same!');
        }
    }
}
