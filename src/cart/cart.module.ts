import { forwardRef, Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartEntity } from '../entity/cart.entity';
import { UserModule } from '../user/user.module';
import { ProductsModule } from '../products/products.module';
import { TokenModule } from '../token/token.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([CartEntity]),
        UserModule,
        forwardRef(() => ProductsModule),
        TokenModule,
    ],
    controllers: [CartController],
    providers: [CartService],
    exports: [CartService]
})
export class CartModule {
}
