import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";

@Injectable()
export class TemplatesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(category?: string) {
    const where = category ? { category } : {};
    return this.prisma.template.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(idOrSlug: string) {
    const template = await this.prisma.template.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
    });

    if (!template) {
      throw new NotFoundException("Mẫu thiệp không tồn tại");
    }

    return template;
  }
}