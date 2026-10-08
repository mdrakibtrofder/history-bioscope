import { Body, Controller, Delete, Get, Injectable, Module, NotFoundException, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { newId, slugify } from '../../common/base.repository';
import { Blog } from '../../common/types';
import { BlogRepository } from './blog.repository';
import { CreateBlogDto, UpdateBlogDto } from './dto/blog.dto';

@Injectable()
export class BlogsService {
  constructor(private readonly repo: BlogRepository) {}

  async findAll(includeDrafts = false, timeline?: string): Promise<Blog[]> {
    return (await this.repo.findAll())
      .filter((b) => includeDrafts || b.status === 'published')
      .filter((b) => !timeline || b.timeline === timeline)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async findOne(idOrSlug: string): Promise<Blog> {
    const b = (await this.repo.findById(idOrSlug)) ?? (await this.repo.findAll()).find((x) => x.slug === idOrSlug);
    if (!b) throw new NotFoundException(`Story ${idOrSlug} not found`);
    return b;
  }

  create(dto: CreateBlogDto): Promise<Blog> {
    const now = new Date().toISOString();
    return this.repo.create({
      id: newId('blog'),
      slug: dto.slug || slugify(dto.title),
      timeline: 'world',
      excerpt: dto.content.replace(/[#>*_`]/g, '').slice(0, 160),
      tags: [],
      relatedEventIds: [],
      coverImage: null,
      wikiTitle: null,
      author: 'History Bioscope Editorial',
      status: 'draft',
      ...dto,
      createdAt: now,
      updatedAt: now,
    } as Blog);
  }

  async update(id: string, dto: UpdateBlogDto): Promise<Blog> {
    const b = await this.repo.update(id, { ...(dto as Partial<Blog>), updatedAt: new Date().toISOString() });
    if (!b) throw new NotFoundException(`Story ${id} not found`);
    return b;
  }

  async remove(id: string) {
    if (!(await this.repo.delete(id))) throw new NotFoundException(`Story ${id} not found`);
    return { deleted: true };
  }
}

@ApiTags('Blogs & Stories')
@Controller('blogs')
export class BlogsController {
  constructor(private readonly service: BlogsService) {}

  @Get()
  @ApiQuery({ name: 'includeDrafts', required: false, type: Boolean })
  @ApiQuery({ name: 'timeline', required: false })
  @ApiOperation({ summary: 'List stories' })
  findAll(@Query('includeDrafts') drafts?: string, @Query('timeline') timeline?: string) {
    return this.service.findAll(drafts === 'true', timeline);
  }
  @Get(':id') findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
  @Post() create(@Body() dto: CreateBlogDto) {
    return this.service.create(dto);
  }
  @Patch(':id') update(@Param('id') id: string, @Body() dto: UpdateBlogDto) {
    return this.service.update(id, dto);
  }
  @Delete(':id') remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}

@Module({ controllers: [BlogsController], providers: [BlogsService, BlogRepository], exports: [BlogsService] })
export class BlogsModule {}
