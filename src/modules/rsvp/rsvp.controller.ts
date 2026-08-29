import { Controller, Post, Get, Body, Param, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { RsvpService } from "./rsvp.service";
import { SubmitRsvpDto } from "./dto/rsvp.dto";
import { Public } from "@/common/decorators/public.decorator";
import { CurrentUser } from "@/common/decorators/current-user.decorator";
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard";

@ApiTags("RSVP")
@Controller("rsvp")
export class RsvpController {
  constructor(private readonly rsvpService: RsvpService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: "Khách mời gửi xác nhận tham dự (Public)" })
  async submitRsvp(@Body() dto: SubmitRsvpDto) {
    return this.rsvpService.submitRsvp(dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get("invitation/:invitationId")
  @ApiOperation({ summary: "Lấy danh sách khách mời đã RSVP của 1 thiệp (Dashboard)" })
  async getRsvpsByInvitation(
    @Param("invitationId") invitationId: string,
    @CurrentUser("userId") userId: string
  ) {
    return this.rsvpService.getRsvpsByInvitation(invitationId, userId);
  }
}