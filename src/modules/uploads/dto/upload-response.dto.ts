import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class UploadResponseDto {
  @ApiProperty({
    example: "https://res.cloudinary.com/demo/image/upload/v12345/inviteme/images/abc.webp",
    description: "Đường dẫn URL bảo mật của file sau khi tối ưu",
  })
  url: string;

  @ApiProperty({
    example: "inviteme/images/abc",
    description: "Public ID của file trên Cloudinary",
  })
  publicId: string;

  @ApiProperty({ example: "webp", description: "Định dạng file" })
  format: string;

  @ApiProperty({ example: 204800, description: "Kích thước file theo bytes" })
  bytes: number;

  @ApiPropertyOptional({ example: 1920, description: "Chiều rộng ảnh (nếu là ảnh)" })
  width?: number;

  @ApiPropertyOptional({ example: 1080, description: "Chiều cao ảnh (nếu là ảnh)" })
  height?: number;

  @ApiProperty({ example: "image", description: "Loại tài nguyên: image hoặc video/audio" })
  resourceType: string;
}
