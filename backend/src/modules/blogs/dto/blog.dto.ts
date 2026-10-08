import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsArray, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBlogDto {
  @ApiProperty() @IsString() @IsNotEmpty() title!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() slug?: string;
  @ApiPropertyOptional({ enum: ['bangladesh', 'islamic', 'world'] }) @IsOptional() @IsString() timeline?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() excerpt?: string;
  @ApiProperty({ description: 'Markdown content' }) @IsString() content!: string;
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() @IsString({ each: true }) tags?: string[];
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() @IsString({ each: true }) relatedEventIds?: string[];
  @ApiPropertyOptional({ nullable: true }) @IsOptional() @IsString() coverImage?: string | null;
  @ApiPropertyOptional({ nullable: true }) @IsOptional() @IsString() wikiTitle?: string | null;
  @ApiPropertyOptional() @IsOptional() @IsString() author?: string;
  @ApiPropertyOptional({ enum: ['draft', 'published'] }) @IsOptional() @IsIn(['draft', 'published']) status?: 'draft' | 'published';
}
export class UpdateBlogDto extends PartialType(CreateBlogDto) {}
