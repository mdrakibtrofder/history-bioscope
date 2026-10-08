import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateEventDto, EventQueryDto, UpdateEventDto } from './dto/event.dto';
import { EventsService } from './events.service';

@ApiTags('Timeline Events')
@Controller('events')
export class EventsController {
  constructor(private readonly service: EventsService) {}

  @Get()
  @ApiOperation({ summary: 'List events with optional filters' })
  findAll(@Query() q: EventQueryDto) {
    return this.service.findAll(q);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one event by id or slug' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create an event (defaults to draft)' })
  create(@Body() dto: CreateEventDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an event (also used to publish / unpublish)' })
  update(@Param('id') id: string, @Body() dto: UpdateEventDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an event' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}

@ApiTags('Timelines')
@Controller('timelines')
export class TimelinesController {
  constructor(private readonly service: EventsService) {}

  @Get()
  @ApiOperation({ summary: 'List the timelines and their eras' })
  findAll() {
    return this.service.timelines();
  }
}
