import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CmsService } from "./cms.service";
import { HomeConfigResponseDto } from "./dto/home-config-response.dto";

@ApiTags("CMS")
@Controller("cms")
export class CmsController {
  constructor(private readonly cmsService: CmsService) {}

  @Get("home")
  @ApiOperation({
    summary: "Lấy cấu hình nội dung hiển thị trang chủ Landing Page",
    description: "Trả về banner hero, thống kê số lượng cặp đôi, testimonials và FAQs.",
  })
  @ApiResponse({
    status: 200,
    description: "Lấy dữ liệu trang chủ thành công",
    type: HomeConfigResponseDto,
  })
  async getHomeConfig(): Promise<HomeConfigResponseDto> {
    return this.cmsService.getHomeConfig();
  }
}
