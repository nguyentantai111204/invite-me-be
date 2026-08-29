import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as argon2 from "argon2";
import { PrismaService } from "@/prisma/prisma.service";
import { RegisterDto, LoginDto, AuthTokensResponseDto } from "./dto/auth.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async register(dto: RegisterDto): Promise<AuthTokensResponseDto> {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
    });

    if (existing) {
      throw new ConflictException("Email này đã được đăng ký trong hệ thống");
    }

    const passwordHash = await argon2.hash(dto.password, {
      type: argon2.argon2id,
    });

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase().trim(),
        fullName: dto.fullName.trim(),
        passwordHash,
      },
    });

    return this.generateTokensAndSession(user);
  }

  async login(dto: LoginDto): Promise<AuthTokensResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException("Email hoặc mật khẩu không chính xác");
    }

    const isValid = await argon2.verify(user.passwordHash, dto.password);
    if (!isValid) {
      throw new UnauthorizedException("Email hoặc mật khẩu không chính xác");
    }

    return this.generateTokensAndSession(user);
  }

  async refreshToken(userId: string, incomingRefreshToken: string): Promise<{ accessToken: string }> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.hashedRefreshToken) {
      throw new UnauthorizedException("Session không hợp lệ");
    }

    const isMatch = await argon2.verify(user.hashedRefreshToken, incomingRefreshToken);
    if (!isMatch) {
      throw new UnauthorizedException("Refresh token không hợp lệ");
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>("jwt.accessSecret"),
      expiresIn: (this.configService.get<string>("jwt.accessExpiresIn") || "15m") as any,
    });

    return { accessToken };
  }

  async logout(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken: null },
    });
  }

  private async generateTokensAndSession(user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
    avatarUrl?: string | null;
  }): Promise<AuthTokensResponseDto> {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>("jwt.accessSecret"),
        expiresIn: (this.configService.get<string>("jwt.accessExpiresIn") || "15m") as any,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>("jwt.refreshSecret"),
        expiresIn: (this.configService.get<string>("jwt.refreshExpiresIn") || "7d") as any,
      }),
    ]);

    const hashedRefreshToken = await argon2.hash(refreshToken, { type: argon2.argon2id });
    await this.prisma.user.update({
      where: { id: user.id },
      data: { hashedRefreshToken },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
    };
  }
}