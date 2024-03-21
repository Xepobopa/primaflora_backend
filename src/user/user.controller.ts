import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../authorization/guards/auth.guard';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {
    }

    @Get('uuid')
    @UseGuards(AuthGuard)
    public async getUserById(@Param('uuid') uuid: string) {
        return await this.userService.findOneById(uuid);
    }

    @Get('all')
    public async getAllUsers() {
        return this.userService.getAllUsers();
    }

    @Get('test')
    public getTest() {
        return 'Hello world!';
    }
}
