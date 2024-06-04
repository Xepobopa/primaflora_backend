import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        cors: {
            credentials: true,
            origin: 'https://primafloraweb-production.up.railway.app',
        },
    });
    const config = app.get<ConfigService>(ConfigService);

    // app.enableCors({ credentials: true, origin: '*' });
    app.use(cookieParser(config.get<string>('COOKIE_SECRET')));
    app.useGlobalPipes(new ValidationPipe());

    const server = await app.listen(config.get<number>('PORT'), () =>
        console.log('Host on http://localhost:5000')
    );

    const router = server._events.request._router;
    const availableRoutes: [] = router.stack
        .map((layer: any) => {
            if (layer.route) {
                return {
                    route: {
                        path: layer.route?.path,
                        method: layer.route?.stack[0].method,
                    },
                };
            }
        })
        .filter((item: any) => item !== undefined);
    console.log(availableRoutes);
}
bootstrap();
