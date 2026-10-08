import { Controller, Get, Module, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BlogsModule, BlogsService } from '../blogs/blogs.module';
import { EventQueryDto } from '../events/dto/event.dto';
import { EventsModule } from '../events/events.module';
import { EventsService } from '../events/events.service';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(
    private readonly events: EventsService,
    private readonly blogs: BlogsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Global search across events, people, places, empires, battles, dates and stories' })
  async search(@Query() q: EventQueryDto) {
    const events = await this.events.findAll(q);
    const needle = (q.q ?? '').toLowerCase();
    const blogs = needle
      ? (await this.blogs.findAll()).filter((b) => `${b.title} ${b.excerpt} ${b.tags.join(' ')} ${b.content}`.toLowerCase().includes(needle))
      : [];
    const entityMap = new Map<string, { type: string; name: string; count: number }>();
    if (needle) {
      for (const e of events)
        for (const en of e.entities)
          if (en.name.toLowerCase().includes(needle)) {
            const k = `${en.type}:${en.name}`;
            const cur = entityMap.get(k) ?? { type: en.type, name: en.name, count: 0 };
            cur.count++;
            entityMap.set(k, cur);
          }
    }
    return { query: q.q ?? '', total: events.length, events, blogs, entities: [...entityMap.values()].sort((a, b) => b.count - a.count) };
  }
}

@Module({ imports: [EventsModule, BlogsModule], controllers: [SearchController] })
export class SearchModule {}
