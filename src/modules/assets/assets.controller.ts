import { Controller, Get, Query } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { EffectCategory } from "@prisma/client";
import { AssetsService } from "./assets.service";
import { AssetResponseDto } from "./dto/asset-response.dto";
import { EffectResponseDto } from "./dto/effect-response.dto";
import { GetAssetsQueryDto } from "./dto/get-assets-query.dto";

@ApiTags("Assets & Effects")
@Controller("assets")
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get()
  @ApiOperation({
    summary: "Lấy danh sách tài nguyên Studio (Stickers, Shapes, BGM Audio, Fonts)",
    description: "Hỗ trợ lọc theo category (STICKER, SHAPE, BACKGROUND, AUDIO, FONT).",
  })
  @ApiResponse({
    status: 200,
    description: "Lấy danh sách tài nguyên thành công",
    type: [AssetResponseDto],
  })
  async getAssets(@Query() query: GetAssetsQueryDto): Promise<AssetResponseDto[]> {
    return this.assetsService.getAssets(query);
  }

  @Get("effects")
  @ApiOperation({
    summary: "Lấy danh mục hiệu ứng mở thiệp 3D & hiệu ứng hạt rơi",
    description: "Hiệu ứng mở bao thư 3D, phong ấn sáp, hoa đào rơi, bụi vàng hoàng kim.",
  })
  @ApiQuery({
    name: "category",
    enum: EffectCategory,
    required: false,
    description: "Lọc theo OPENING_3D hoặc PARTICLE",
  })
  @ApiResponse({
    status: 200,
    description: "Lấy danh sách hiệu ứng thành công",
    type: [EffectResponseDto],
  })
  async getEffects(
    @Query("category") category?: EffectCategory,
  ): Promise<EffectResponseDto[]> {
    return this.assetsService.getEffects(category);
  }
}
