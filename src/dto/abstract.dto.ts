import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class AbstractDto {
    @ApiProperty({
        description: "The Id of a user",
        title: "User ID",
        type: Number,
        example: 1
    })
    @IsNumber()
    @IsOptional()
    public id: number;

    @ApiProperty({
        description: "The uuid of a user",
        title: "User UUID",
        type: String,
        example: "060fbcfa-243f-46b9-a1d3-7bdc1f4c80a5"
    })
    @IsString()
    @IsOptional()
    public uuid: string;

    @ApiProperty({
        title: "User createdAt",
        type: Date,
        example: "2023-06-21 21:49:06.30812"
    })
    @IsDate()
    @IsOptional()
    public createdAt: Date;

    @ApiProperty({
        title: "User updatedAt",
        type: Date,
        example: "2023-06-21 21:49:06.30812"
    })
    @IsDate()
    @IsOptional()
    public updatedAt: Date;
}