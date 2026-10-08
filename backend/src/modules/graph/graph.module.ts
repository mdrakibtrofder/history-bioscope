import { Controller, Get, Injectable, Module, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { EventsModule } from '../events/events.module';
import { EventsService } from '../events/events.service';

export interface GraphNode {
  id: string;
  label: string;
  type: 'event' | 'person' | 'place' | 'empire' | 'battle' | 'religion';
  timeline?: string;
  year?: number;
  degree: number;
}
export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  kind: 'involves' | 'related';
}

@Injectable()
export class GraphService {
  constructor(private readonly events: EventsService) {}

  async build(timeline?: string, era?: string) {
    const events = await this.events.findAll({ timeline, era });
    const nodes = new Map<string, GraphNode>();
    const edges: GraphEdge[] = [];
    const ids = new Set(events.map((e) => e.id));
    for (const e of events) {
      nodes.set(e.id, { id: e.id, label: e.title, type: 'event', timeline: e.timeline, year: e.startYear, degree: 0 });
    }
    for (const e of events) {
      for (const ent of e.entities) {
        const nid = `${ent.type}:${ent.name}`;
        if (!nodes.has(nid)) nodes.set(nid, { id: nid, label: ent.name, type: ent.type, degree: 0 });
        edges.push({ id: `${e.id}->${nid}`, source: e.id, target: nid, kind: 'involves' });
      }
      for (const r of e.relatedEventIds) {
        if (ids.has(r) && e.id < r) edges.push({ id: `${e.id}<->${r}`, source: e.id, target: r, kind: 'related' });
      }
    }
    for (const ed of edges) {
      nodes.get(ed.source)!.degree++;
      nodes.get(ed.target)!.degree++;
    }
    return { nodes: [...nodes.values()], edges };
  }
}

@ApiTags('Knowledge Graph')
@Controller('graph')
export class GraphController {
  constructor(private readonly graph: GraphService) {}
  @Get()
  @ApiOperation({ summary: 'Nodes (events, people, places, empires, battles, religions) and edges' })
  @ApiQuery({ name: 'timeline', required: false })
  @ApiQuery({ name: 'era', required: false })
  get(@Query('timeline') timeline?: string, @Query('era') era?: string) {
    return this.graph.build(timeline, era);
  }
}

@Module({ imports: [EventsModule], controllers: [GraphController], providers: [GraphService] })
export class GraphModule {}
