import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser'
import { ValidationPipe } from "@nestjs/common";
import {ConfigService} from "@nestjs/config";

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { cors: true });
    const config = app.get<ConfigService>(ConfigService);

    //config.get<string>('COOKIE_SECRET')
    app.use(cookieParser());
    app.enableCors({ credentials: true, origin: '*' });
    app.useGlobalPipes(new ValidationPipe());

    const server = await app.listen(config.get<number>('PORT'), () => console.log('Host on http://localhost:5000'));

    const router = server._events.request._router;
    const availableRoutes: [] = router.stack
        .map((layer: any) => {
            if (layer.route) {
                return {
                    route: {
                        path: layer.route?.path,
                        method: layer.route?.stack[0].method
                    }
                };
            }
        })
        .filter((item: any) => item !== undefined);
    console.log(availableRoutes);
}
bootstrap();
