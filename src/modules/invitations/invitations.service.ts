import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { CreateInvitationDto, UpdateInvitationDto, ClaimDraftDto } from "./dto/invitation.dto";
import { InvitationStatus } from "@prisma/client";

@Injectable()
export class InvitationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string | null, dto: CreateInvitationDto) {
    const slug = dto.slug.toLowerCase().trim();
    const existing = await this.prisma.invitation.findUnique({ where: { slug } });
    if (existing) {
      throw new ConflictException("Đường dẫn (Slug) này đã tồn tại, vui lòng chọn đường dẫn khác");
    }

    return this.prisma.invitation.create({
      data: {
        userId,
        templateId: dto.templateId,
        slug,
        title: dto.title.trim(),
        eventType: dto.eventType || "WEDDING",
        eventDate: new Date(dto.eventDate),
        eventTime: dto.eventTime,
        coverImage: dto.coverImage || "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200",
        ogImage: dto.ogImage || "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200",
        themeConfig: dto.themeConfig,
        sectionVisibility: dto.sectionVisibility || {
          hero: true, countdown: true, couple: true, loveStory: true,
          schedule: true, location: true, gallery: true, bankAccounts: true, rsvp: true, music: true
        },
        sectionOrder: dto.sectionOrder || ["hero", "countdown", "couple", "loveStory", "schedule", "location", "gallery", "bankAccounts", "rsvp", "music"],
        coupleData: dto.coupleData ?? undefined,
        locationData: dto.locationData,
        scheduleData: dto.scheduleData || [],
        galleryData: dto.galleryData || [],
        bankAccountsData: dto.bankAccountsData || [],
        rsvpEnabled: dto.rsvpEnabled !== undefined ? dto.rsvpEnabled : true,
        rsvpConfig: dto.rsvpConfig ?? undefined,
        status: InvitationStatus.DRAFT,
      },
    });
  }

  async getPublicBySlug(slug: string) {
    const invitation = await this.prisma.invitation.findUnique({
      where: { slug },
      include: { template: true },
    });

    if (!invitation) {
      throw new NotFoundException("Thiệp mời không tồn tại hoặc đã bị xóa");
    }

    const { passwordHash, userId, ...publicData } = invitation;
    return publicData;
  }

  async findMyInvitations(userId: string) {
    return this.prisma.invitation.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      include: {
        _count: { select: { rsvps: true } },
      },
    });
  }

  async findOne(id: string, userId: string) {
    const invitation = await this.prisma.invitation.findUnique({
      where: { id },
      include: { rsvps: true },
    });

    if (!invitation) {
      throw new NotFoundException("Không tìm thấy thiệp mời");
    }

    if (invitation.userId !== userId) {
      throw new ForbiddenException("Bạn không có quyền quản lý thiệp mời này");
    }

    return invitation;
  }

  async update(id: string, userId: string, dto: UpdateInvitationDto) {
    await this.findOne(id, userId);

    return this.prisma.invitation.update({
      where: { id },
      data: {
        title: dto.title?.trim(),
        eventType: dto.eventType,
        eventDate: dto.eventDate ? new Date(dto.eventDate) : undefined,
        eventTime: dto.eventTime,
        coverImage: dto.coverImage,
        ogImage: dto.ogImage,
        themeConfig: dto.themeConfig,
        sectionVisibility: dto.sectionVisibility,
        sectionOrder: dto.sectionOrder,
        coupleData: dto.coupleData ?? undefined,
        locationData: dto.locationData,
        scheduleData: dto.scheduleData,
        galleryData: dto.galleryData,
        bankAccountsData: dto.bankAccountsData,
        rsvpEnabled: dto.rsvpEnabled,
        rsvpConfig: dto.rsvpConfig ?? undefined,
        status: dto.status,
      },
    });
  }

  async publish(id: string, userId: string) {
    await this.findOne(id, userId);

    return this.prisma.invitation.update({
      where: { id },
      data: {
        status: InvitationStatus.PUBLISHED,
        publishedAt: new Date(),
      },
    });
  }

  async delete(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.invitation.delete({ where: { id } });
  }

  async claimDraft(userId: string, dto: ClaimDraftDto) {
    return this.create(userId, dto.draftData);
  }
}