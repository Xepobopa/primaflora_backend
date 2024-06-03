import { Controller, Delete, Get, Param, Req, UseGuards } from '@nestjs/common';
import { LikeService } from './like.service';
import { AuthGuard } from '../authorization/guards/auth.guard';
import { Request } from 'express';
import { TokenService } from '../token/token.service';

@Controller('like')
@UseGuards(AuthGuard)
export class LikeController {
    constructor(
        private readonly likeService: LikeService,
        private readonly tokenService: TokenService
    ) {}

    @Get('/likes')
    public async getLikedProducts(@Req() req: Request) {
        const payload = this.getTokenPayloadFromRequest(req);
        return await this.likeService.getLikedProducts(payload.uuid);
    }

    // now like product in /product route
    // @Get('/:productUuid')
    // public async likeProduct(
    //     @Param('productUuid') productId: string,
    //     @Req() req: Request
    // ) {
    //     const payload = this.getTokenPayloadFromRequest(req);
    //     console.log('payload: ', payload);
    //     return await this.likeService.setLike(payload.uuid, productId);
    // }

    @Delete('/:likeUuid')
    public async removeLike(
        @Param('likeUuid') likeUuid: string,
        @Req() req: Request
    ) {
        const payload = this.getTokenPayloadFromRequest(req);
        return await this.likeService.removeLike(payload.uuid, likeUuid);
    }

    private getTokenPayloadFromRequest(req: Request): any | null {
        const token = req.headers.authorization.replace('Bearer ', '');
        if (!token) {
            return null;
        }

        return this.tokenService.verifyToken(token, 'access');
    }
}
