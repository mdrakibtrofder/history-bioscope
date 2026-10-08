import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export const TIMELINES = ['bangladesh', 'islamic', 'world'] as const;
export const CATEGORIES = [
  'politics', 'war', 'religion', 'culture', 'science', 'economy', 'movement',
  'disaster', 'prophet', 'dynasty', 'exploration', 'technology',
] as const;
export const ENTITY_TYPES = ['person', 'place', 'empire', 'battle', 'religion'] as const;

export class LocationDto {
  @ApiProperty() @IsString() @IsNotEmpty() name!: string;
  @ApiProperty() @IsNumber() @Min(-90) @Max(90) lat!: number;
  @ApiProperty() @IsNumber() @Min(-180) @Max(180) lng!: number;
  @ApiPropertyOptional() @IsOptional() @IsString() country?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() region?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() historicalTerritory?: string;
}

export class MediaRefDto {
  @ApiProperty() @IsString() url!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() caption?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() credit?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() type?: string;
}

export class VideoRefDto {
  @ApiProperty({ enum: ['youtube', 'upload', 'link'] }) @IsIn(['youtube', 'upload', 'link']) type!: 'youtube' | 'upload' | 'link';
  @ApiProperty() @IsString() url!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() title?: string;
}

export class ReferenceDto {
  @ApiProperty() @IsString() title!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() url?: string;
}

export class EntityTagDto {
  @ApiProperty({ enum: ENTITY_TYPES }) @IsIn(ENTITY_TYPES as unknown as string[]) type!: (typeof ENTITY_TYPES)[number];
  @ApiProperty() @IsString() name!: string;
}

export class CreateEventDto {
  @ApiProperty() @IsString() @IsNotEmpty() title!: string;
  @ApiProperty({ enum: TIMELINES }) @IsIn(TIMELINES as unknown as string[]) timeline!: (typeof TIMELINES)[number];
  @ApiProperty() @IsString() @IsNotEmpty() era!: string;
  @ApiProperty({ enum: CATEGORIES }) @IsString() category!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() region?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() civilization?: string;
  @ApiProperty({ description: 'Negative for BCE' }) @IsInt() startYear!: number;
  @ApiPropertyOptional({ nullable: true }) @IsOptional() @IsInt() endYear?: number | null;
  @ApiPropertyOptional() @IsOptional() @IsString() dateLabel?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() approximate?: boolean;
  @ApiProperty() @IsString() summary!: string;
  @ApiPropertyOptional({ description: 'Markdown supported' }) @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() significance?: string;
  @ApiPropertyOptional({ type: [LocationDto] }) @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => LocationDto) locations?: LocationDto[];
  @ApiPropertyOptional({ type: [MediaRefDto] }) @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => MediaRefDto) images?: MediaRefDto[];
  @ApiPropertyOptional({ type: [VideoRefDto] }) @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => VideoRefDto) videos?: VideoRefDto[];
  @ApiPropertyOptional({ type: [MediaRefDto] }) @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => MediaRefDto) documents?: MediaRefDto[];
  @ApiPropertyOptional({ nullable: true }) @IsOptional() @IsString() wikiTitle?: string | null;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() noImage?: boolean;
  @ApiPropertyOptional({ type: [ReferenceDto] }) @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => ReferenceDto) references?: ReferenceDto[];
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() @IsString({ each: true }) relatedEventIds?: string[];
  @ApiPropertyOptional({ type: [EntityTagDto] }) @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => EntityTagDto) entities?: EntityTagDto[];
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() @IsString({ each: true }) tags?: string[];
  @ApiPropertyOptional() @IsOptional() @IsBoolean() featured?: boolean;
  @ApiPropertyOptional({ enum: ['draft', 'published'] }) @IsOptional() @IsIn(['draft', 'published']) status?: 'draft' | 'published';
}

export class UpdateEventDto extends PartialType(CreateEventDto) {}

const toInt = ({ value }: { value: unknown }) => (value === undefined || value === '' ? undefined : Number(value));
const toBool = ({ value }: { value: unknown }) => value === true || value === 'true' || value === '1';

export class EventQueryDto {
  @ApiPropertyOptional({ enum: TIMELINES }) @IsOptional() @IsString() timeline?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() era?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() category?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() region?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() civilization?: string;
  @ApiPropertyOptional({ description: 'Free text search' }) @IsOptional() @IsString() q?: string;
  @ApiPropertyOptional() @IsOptional() @Transform(toInt) @IsInt() from?: number;
  @ApiPropertyOptional() @IsOptional() @Transform(toInt) @IsInt() to?: number;
  @ApiPropertyOptional({ description: 'Include drafts (admin)' }) @IsOptional() @Transform(toBool) @IsBoolean() includeDrafts?: boolean;
  @ApiPropertyOptional() @IsOptional() @Transform(toBool) @IsBoolean() featured?: boolean;
}
