import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { UploadResponseDto } from "./dto/upload-response.dto";
import { UploadsService } from "./uploads.service";

@ApiTags("Uploads")
@Controller("uploads")
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post("image")
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({
    summary: "Tải lên hình ảnh (Ảnh thiệp, Gallery, Avatar, Bìa cưới)",
    description:
      "Chỉ chấp nhận JPEG, PNG, WEBP, GIF, SVG tối đa 10MB. File sẽ được tự động tối ưu hóa nén nhẹ trên Cloudinary.",
  })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      required: ["file"],
      properties: {
        file: {
          type: "string",
          format: "binary",
          description: "File hình ảnh cần tải lên",
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Tải lên ảnh thành công",
    type: UploadResponseDto,
  })
  @ApiResponse({ status: 400, description: "File không hợp lệ hoặc quá dung lượng" })
  @ApiResponse({ status: 401, description: "Chưa xác thực đăng nhập" })
  @UseInterceptors(FileInterceptor("file"))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UploadResponseDto> {
    return this.uploadsService.uploadImage(file, "images");
  }

  @Post("audio")
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({
    summary: "Tải lên file âm thanh (Nhạc nền đám cưới MP3/WAV)",
    description: "Chỉ chấp nhận MP3, WAV, AAC, OGG tối đa 15MB.",
  })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      required: ["file"],
      properties: {
        file: {
          type: "string",
          format: "binary",
          description: "File âm thanh cần tải lên",
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Tải lên file âm thanh thành công",
    type: UploadResponseDto,
  })
  @ApiResponse({ status: 400, description: "File âm thanh không hợp lệ" })
  @UseInterceptors(FileInterceptor("file"))
  async uploadAudio(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UploadResponseDto> {
    return this.uploadsService.uploadAudio(file, "audio");
  }
}
