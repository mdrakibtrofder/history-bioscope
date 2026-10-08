import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BlogsModule } from './modules/blogs/blogs.module';
import { EventsModule } from './modules/events/events.module';
import { GraphModule } from './modules/graph/graph.module';
import { LocationsModule } from './modules/locations/locations.module';
import { MapModule } from './modules/map/map.module';
import { MediaModule } from './modules/media/media.module';
import { MetaModule } from './modules/meta/meta.module';
import { SearchModule } from './modules/search/search.module';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env', '.env.example'] }),
    StorageModule,
    EventsModule,
    BlogsModule,
    MediaModule,
    LocationsModule,
    MapModule,
    GraphModule,
    SearchModule,
    MetaModule,
  ],
})
export class AppModule {}
