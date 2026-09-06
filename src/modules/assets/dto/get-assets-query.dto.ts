import { ApiPropertyOptional } from "@nestjs/swagger";
import { AssetCategory } from "@prisma/client";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class GetAssetsQueryDto {
  @ApiPropertyOptional({ enum: AssetCategory })
  @IsOptional()
  @IsEnum(AssetCategory)
  category?: AssetCategory;

  @ApiPropertyOptional({ example: "floral" })
  @IsOptional()
  @IsString()
  subCategory?: string;
}
