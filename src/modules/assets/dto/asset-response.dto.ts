import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { AssetCategory } from "@prisma/client";

export class AssetResponseDto {
  @ApiProperty({ example: "00000000-0000-0000-0000-000000000001" })
  id: string;

  @ApiProperty({ enum: AssetCategory, example: AssetCategory.STICKER })
  category: AssetCategory;

  @ApiProperty({ example: "Hoa Đào" })
  name: string;

  @ApiPropertyOptional({ example: "floral" })
  subCategory?: string | null;

  @ApiPropertyOptional({ example: "https://... or /audio/wedding.mp3" })
  url?: string | null;

  @ApiPropertyOptional({ example: "🌸" })
  content?: string | null;

  @ApiPropertyOptional({ example: { duration: 184, artist: "Stephen Sanchez" } })
  metadata?: Record<string, unknown> | null;

  @ApiProperty({ example: false })
  isPremium: boolean;

  @ApiProperty({ example: 0 })
  order: number;
}
