import { Controller, Get, Query } from '@nestjs/common';
import { XitemService } from './xitem.service';
import { GetAllQueryParmas } from './dto/getAll.query-params';

@Controller('xitem')
export class XitemController {
    constructor(private readonly xitemService: XitemService) {}

    @Get('/getAll')
    async getAllByQuery(@Query() query: GetAllQueryParmas) {
        return await this.xitemService.getAllByQuery(query);
    }
}
