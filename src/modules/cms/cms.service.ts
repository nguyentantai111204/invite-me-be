import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { HomeConfigResponseDto } from "./dto/home-config-response.dto";

@Injectable()
export class CmsService {
  constructor(private readonly prisma: PrismaService) {}


  async getHomeConfig(): Promise<HomeConfigResponseDto> {
    const config = await this.prisma.homeConfig.findFirst();
    if (!config) {
      throw new NotFoundException({
        code: "CMS_HOME_CONFIG_NOT_FOUND",
        message: "Chưa cấu hình dữ liệu trang chủ.",
      });
    }

    return {
      id: config.id,
      heroTitle: config.heroTitle,
      heroSubtitle: config.heroSubtitle,
      heroBadge: config.heroBadge,
      heroCtaText: config.heroCtaText,
      heroCtaLink: config.heroCtaLink,
      featuredSlugs: config.featuredSlugs,
      statsCount: config.statsCount as Record<string, unknown>,
      testimonials: (config.testimonials as unknown as Record<string, unknown>[]) || [],
      faqs: (config.faqs as unknown as Record<string, unknown>[]) || [],
      updatedAt: config.updatedAt,
    };
  }
}
