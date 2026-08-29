import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { SubmitRsvpDto } from "./dto/rsvp.dto";

@Injectable()
export class RsvpService {
  constructor(private readonly prisma: PrismaService) {}

  async submitRsvp(dto: SubmitRsvpDto) {
    const invitation = await this.prisma.invitation.findUnique({
      where: { id: dto.invitationId },
    });

    if (!invitation) {
      throw new NotFoundException("Thiệp mời không tồn tại");
    }

    const record = await this.prisma.rsvp.create({
      data: {
        invitationId: dto.invitationId,
        guestName: dto.guestName.trim(),
        phoneNumber: dto.phoneNumber?.trim() || null,
        attending: dto.attending,
        numberOfGuests: dto.attending ? (dto.numberOfGuests || 1) : 0,
        dietaryRequirements: dto.dietaryRequirements || null,
        wishes: dto.wishes?.trim() || null,
      },
    });

    return {
      success: true,
      message: "Cảm ơn bạn đã gửi lời chúc và xác nhận tham dự!",
      data: record,
    };
  }

  async getRsvpsByInvitation(invitationId: string, userId: string) {
    // Validate quyền sở hữu
    const invitation = await this.prisma.invitation.findUnique({
      where: { id: invitationId },
    });

    if (!invitation || invitation.userId !== userId) {
      throw new NotFoundException("Không tìm thấy thiệp mời");
    }

    return this.prisma.rsvp.findMany({
      where: { invitationId },
      orderBy: { createdAt: "desc" },
    });
  }
}