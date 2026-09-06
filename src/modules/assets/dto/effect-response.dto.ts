import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { EffectCategory } from "@prisma/client";

export class EffectResponseDto {
  @ApiProperty({ example: "550e8400-e29b-41d4-a716-446655440000" })
  id: string;

  @ApiProperty({ example: "envelope-3d" })
  code: string;

  @ApiProperty({ example: "Bao Thư 3D Hoàng Gia" })
  name: string;

  @ApiPropertyOptional({
    example: "Nắp bao thư mở lật 3D sang trọng kèm niêm phong sáp đỏ vàng kim.",
  })
  description?: string | null;

  @ApiProperty({ enum: EffectCategory, example: EffectCategory.OPENING_3D })
  category: EffectCategory;

  @ApiPropertyOptional({ example: "✉️" })
  icon?: string | null;

  @ApiProperty({ example: {} })
  config: Record<string, unknown>;

  @ApiProperty({ example: false })
  isPremium: boolean;
}
