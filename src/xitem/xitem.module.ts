import { Module } from '@nestjs/common';
import { XitemService } from './xitem.service';
import { XitemController } from './xitem.controller';
import { Xitem } from 'src/entities_from_db/entities/xitem.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forFeature([Xitem]),
    ],
    controllers: [XitemController],
    providers: [XitemService],
})
export class XitemModule {}
