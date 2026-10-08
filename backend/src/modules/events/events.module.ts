import { Module } from '@nestjs/common';
import { EventsController, TimelinesController } from './events.controller';
import { EventsService } from './events.service';
import { TimelineRepository } from './timeline.repository';

@Module({
  controllers: [EventsController, TimelinesController],
  providers: [EventsService, TimelineRepository],
  exports: [EventsService, TimelineRepository],
})
export class EventsModule {}
