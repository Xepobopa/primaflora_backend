import { Controller, Get, Param, Patch, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../authorization/guards/auth.guard';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    private getTokenFromRequest(req: Request) {
        return req.headers['authorization'].replace('Bearer ', '');
    }

    @Get()
    @UseGuards(AuthGuard)
    public async getUserByToken(@Req() req: Request) {
        console.log('Get user by token...');
        const token = this.getTokenFromRequest(req);
        return await this.userService.findOneByToken(token);
    }

    @Get('/:uuid')
    @UseGuards(AuthGuard)
    public async getUserById(@Param('uuid') uuid: string) {
        return await this.userService.findOneById(uuid);
    }

    @Patch()
    @UseGuards(AuthGuard)
    public async updateUser(@Req() req: Request) {
        const payload = this.getTokenFromRequest(req);
        return await this.userService.updateUser(payload.uuid);
    }

    @Get('all')
    public async getAllUsers() {
        return this.userService.getAllUsers();
    }

    @Post('activate/:code')
    public async activateUser(@Param('code') code: string) {
        return await this.userService.activate(code);
    }

    @Get('test')
    public getTest() {
        return 'Hello world!';
    }
}
