import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from "class-validator";
import { InvitationEventType, InvitationStatus } from "@prisma/client";

export class CreateInvitationDto {
  @ApiProperty({ example: "Lễ Thành Hôn: Minh Tuấn & Khánh Linh" })
  @IsString()
  @IsNotEmpty({ message: "Tiêu đề thiệp không được để trống" })
  title: string;

  @ApiProperty({ example: "minh-linh" })
  @IsString()
  @IsNotEmpty({ message: "Slug không được để trống" })
  slug: string;

  @ApiPropertyOptional({ enum: InvitationEventType, default: InvitationEventType.WEDDING })
  @IsEnum(InvitationEventType)
  @IsOptional()
  eventType?: InvitationEventType;

  @ApiPropertyOptional({ example: "tpl-royal-luxury" })
  @IsString()
  @IsOptional()
  templateId?: string;

  @ApiProperty({ example: "2026-10-28T11:30:00.000Z" })
  @IsString()
  @IsNotEmpty()
  eventDate: string;

  @ApiProperty({ example: "11:30 SA" })
  @IsString()
  @IsNotEmpty()
  eventTime: string;

  @ApiPropertyOptional({ example: "https://example.com/cover.jpg" })
  @IsString()
  @IsOptional()
  coverImage?: string;

  @ApiPropertyOptional({ example: "https://example.com/og.jpg" })
  @IsString()
  @IsOptional()
  ogImage?: string;

  @ApiProperty()
  @IsObject()
  themeConfig: Record<string, any>;

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  sectionVisibility?: Record<string, boolean>;

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  sectionOrder?: string[];

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  coupleData?: Record<string, any>;

  @ApiProperty()
  @IsObject()
  locationData: Record<string, any>;

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  scheduleData?: Record<string, any>[];

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  galleryData?: string[];

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  bankAccountsData?: Record<string, any>[];

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  rsvpEnabled?: boolean;

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  rsvpConfig?: Record<string, any>;
}

export class UpdateInvitationDto extends CreateInvitationDto {
  @ApiPropertyOptional({ enum: InvitationStatus })
  @IsEnum(InvitationStatus)
  @IsOptional()
  status?: InvitationStatus;
}

export class ClaimDraftDto {
  @ApiProperty({ example: "minh-linh" })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty()
  @IsObject()
  draftData: CreateInvitationDto;
}