import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class HomeConfigResponseDto {
  @ApiProperty({ example: "550e8400-e29b-41d4-a716-446655440000" })
  id: string;

  @ApiProperty({ example: "Thiệp Cưới Online Nghệ Thuật & Sang Trọng" })
  heroTitle: string;

  @ApiPropertyOptional({
    example:
      "Tự tay thiết kế thiệp cưới online phong cách hoàng kim độc bản với hiệu ứng mở bìa 3D, âm nhạc acoustic và quản lý RSVP thông minh.",
  })
  heroSubtitle?: string | null;

  @ApiPropertyOptional({ example: "✨ Nền tảng thiệp cưới 3D & tương tác #1" })
  heroBadge?: string | null;

  @ApiProperty({ example: "Khám Phá Mẫu Thiệp" })
  heroCtaText: string;

  @ApiProperty({ example: "/templates" })
  heroCtaLink: string;

  @ApiProperty({
    example: ["royal-luxury", "minimalist-rose", "golden-elegance"],
    type: [String],
  })
  featuredSlugs: string[];

  @ApiProperty({
    example: { templates: 120, couples: 5800, wishes: 45000, satisfaction: 99.4 },
  })
  statsCount: Record<string, unknown>;

  @ApiProperty({
    example: [
      {
        couple: "Minh Hoàng & Khánh Linh",
        date: "Tháng 11 / 2026",
        content: "Trải nghiệm rất hoàng gia và sang trọng!",
        rating: 5,
      },
    ],
  })
  testimonials: Record<string, unknown>[];

  @ApiProperty({
    example: [
      {
        question: "Tôi có thể gửi thiệp qua Zalo, Facebook không?",
        answer: "Hoàn toàn được! Mỗi thiệp có một đường link bảo mật riêng.",
      },
    ],
  })
  faqs: Record<string, unknown>[];

  @ApiProperty()
  updatedAt: Date;
}
