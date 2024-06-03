import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Post,
    Req,
    Res,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthorizationService } from './authorization.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { Request, Response } from 'express';
import { isUndefined } from '@nestjs/common/utils/shared.utils';

@Controller('authorization')
export class AuthorizationController {
    private readonly cookieName: string;

    constructor(private readonly authorizationService: AuthorizationService) {
        this.cookieName = 'refreshToken';
    }

    @Post('/sign-up')
    public async singUp(@Body() signUpDto: SignUpDto) {
        return this.authorizationService.signUp(signUpDto);
    }

    @Post('/sign-in')
    public async signIn(@Body() singInDto: SignInDto, @Res() res: Response) {
        console.log('Sign in dto => ', singInDto);
        const result = await this.authorizationService.signIn(singInDto);

        this.setRefreshCookie(result.refreshToken, res)
            .status(HttpStatus.OK)
            .send({
                user: result.user,
                accessToken: result.accessToken,
                refreshToken: result.refreshToken,
            });

        console.log({ access: result.accessToken });
    }

    @Get('/refreshToken')
    public async refreshToken(@Req() req: Request, @Res() res: Response) {
        const oldToken = this.getRefreshToken(req);
        const result = await this.authorizationService.refreshToken(oldToken);

        this.setRefreshCookie(result.refreshToken, res)
            .status(HttpStatus.OK)
            .send({ accessToken: result.accessToken, user: result.user });
    }

    @Post('/logout')
    public async logout(@Req() req: Request, @Res() res: Response) {
        const token = this.getRefreshToken(req);

        await this.authorizationService.logout(token);

        res.clearCookie(this.cookieName).status(HttpStatus.OK).send('Success');
    }
    @Post('/confirm-email')
    public async confirmUserByEmail() {}

    @Get('cache')
    public async getAllCache() {
        return await this.authorizationService.getAllCache();
    }

    private setRefreshCookie(token: string, res: Response) {
        console.log('attack refresh token: ', token);
        return res.cookie(this.cookieName, token, {
            secure: true,
            httpOnly: true,
            expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // for next 5 days
        });
    }

    private getRefreshToken(req: Request) {
        const token = req.cookies[this.cookieName];
        console.log('Token: ', token);
        console.log(req);

        if (isUndefined(token) || token === '' || token === null) {
            throw new UnauthorizedException(
                null,
                'Cant find token in cookies!'
            );
        }

        return token;
    }
}
