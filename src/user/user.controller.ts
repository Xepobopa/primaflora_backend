import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../authorization/guards/auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    private getTokenFromRequest(req: Request) {
        return req.headers['authorization'].replace('Bearer ', '');
    }

    @Get()
    @UseGuards(AuthGuard)
    public async getUserByToken(
        @Req() req: Request,
        @Query('loadInvitedUser') loadInvitedUser?: boolean
    ) {
        console.log('Get user by token...');
        const token = this.getTokenFromRequest(req);
        return await this.userService.findOneByToken(token, loadInvitedUser);
    }

    @Get('/:uuid')
    @UseGuards(AuthGuard)
    public async getUserById(
        @Param('uuid') uuid: string,
        @Query('loadInvitedUser') loadInvitedUser?: boolean
    ) {
        if (!loadInvitedUser) return await this.userService.findOneById(uuid);

        return await this.userService.findOneByIdAndLoadInvitedUser(uuid);
    }

    @Patch()
    @UseGuards(AuthGuard)
    public async updateUser(
        @Req() req: Request,
        @Body() updateUser: UpdateUserDto
    ) {
        const token = this.getTokenFromRequest(req);
        return await this.userService.updateUser(token, updateUser);
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
