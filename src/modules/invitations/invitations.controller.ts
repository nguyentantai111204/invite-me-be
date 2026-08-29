import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { InvitationsService } from "./invitations.service";
import { CreateInvitationDto, UpdateInvitationDto, ClaimDraftDto } from "./dto/invitation.dto";
import { Public } from "@/common/decorators/public.decorator";
import { CurrentUser } from "@/common/decorators/current-user.decorator";
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard";

@ApiTags("Invitations")
@Controller("invitations")
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @Public()
  @Get("public/:slug")
  @ApiOperation({ summary: "Xem thông tin thiệp mời công khai theo Slug" })
  async getPublicBySlug(@Param("slug") slug: string) {
    return this.invitationsService.getPublicBySlug(slug);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get("me")
  @ApiOperation({ summary: "Lấy danh sách tất cả thiệp mời của user hiện tại" })
  async findMyInvitations(@CurrentUser("userId") userId: string) {
    return this.invitationsService.findMyInvitations(userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(":id")
  @ApiOperation({ summary: "Xem chi tiết thiệp mời (Dashboard/Editor)" })
  async findOne(
    @Param("id") id: string,
    @CurrentUser("userId") userId: string
  ) {
    return this.invitationsService.findOne(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: "Tạo mới một thiệp mời" })
  async create(
    @CurrentUser("userId") userId: string,
    @Body() dto: CreateInvitationDto
  ) {
    return this.invitationsService.create(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put(":id")
  @ApiOperation({ summary: "Cập nhật thiệp mời" })
  async update(
    @Param("id") id: string,
    @CurrentUser("userId") userId: string,
    @Body() dto: UpdateInvitationDto
  ) {
    return this.invitationsService.update(id, userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(":id/publish")
  @ApiOperation({ summary: "Xuất bản thiệp mời chính thức" })
  async publish(
    @Param("id") id: string,
    @CurrentUser("userId") userId: string
  ) {
    return this.invitationsService.publish(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(":id")
  @ApiOperation({ summary: "Xóa thiệp mời" })
  async delete(
    @Param("id") id: string,
    @CurrentUser("userId") userId: string
  ) {
    return this.invitationsService.delete(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post("claim-draft")
  @ApiOperation({ summary: "Claim Anonymous Draft vào tài khoản đăng nhập" })
  async claimDraft(
    @CurrentUser("userId") userId: string,
    @Body() dto: ClaimDraftDto
  ) {
    return this.invitationsService.claimDraft(userId, dto);
  }
}