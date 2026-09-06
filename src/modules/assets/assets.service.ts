import { Injectable } from "@nestjs/common";
import { AssetCategory, EffectCategory } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { AssetResponseDto } from "./dto/asset-response.dto";
import { EffectResponseDto } from "./dto/effect-response.dto";
import { GetAssetsQueryDto } from "./dto/get-assets-query.dto";

@Injectable()
export class AssetsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Lấy danh sách tài nguyên (Sticker, Font, Background, Audio) cho Studio Editor
   */
  async getAssets(query: GetAssetsQueryDto): Promise<AssetResponseDto[]> {
    const assets = await this.prisma.asset.findMany({
      where: {
        isActive: true,
        ...(query.category ? { category: query.category } : {}),
        ...(query.subCategory ? { subCategory: query.subCategory } : {}),
      },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });

    return assets.map((a) => ({
      id: a.id,
      category: a.category,
      name: a.name,
      subCategory: a.subCategory,
      url: a.url,
      content: a.content,
      metadata: (a.metadata as Record<string, unknown>) || null,
      isPremium: a.isPremium,
      order: a.order,
    }));
  }

  /**
   * Lấy danh sách hiệu ứng mở bìa 3D và hiệu ứng hạt rơi
   */
  async getEffects(category?: EffectCategory): Promise<EffectResponseDto[]> {
    const effects = await this.prisma.effectPreset.findMany({
      where: category ? { category } : undefined,
      orderBy: { createdAt: "asc" },
    });

    return effects.map((e) => ({
      id: e.id,
      code: e.code,
      name: e.name,
      description: e.description,
      category: e.category,
      icon: e.icon,
      config: (e.config as Record<string, unknown>) || {},
      isPremium: e.isPremium,
    }));
  }
}
