import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { TemplatesService } from "./templates.service";
import { Public } from "@/common/decorators/public.decorator";

@ApiTags("Templates")
@Controller("templates")
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: "Lấy danh sách tất cả các mẫu thiệp có sẵn" })
  async findAll(@Query("category") category?: string) {
    return this.templatesService.findAll(category);
  }

  @Public()
  @Get(":idOrSlug")
  @ApiOperation({ summary: "Xem chi tiết một mẫu thiệp theo ID hoặc Slug" })
  async findOne(@Param("idOrSlug") idOrSlug: string) {
    return this.templatesService.findOne(idOrSlug);
  }
}