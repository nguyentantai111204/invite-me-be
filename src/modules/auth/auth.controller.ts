import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards, Req } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { RegisterDto, LoginDto, RefreshTokenDto, AuthTokensResponseDto } from "./dto/auth.dto";
import { Public } from "@/common/decorators/public.decorator";
import { CurrentUser, CurrentUserPayload } from "@/common/decorators/current-user.decorator";
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("register")
  @ApiOperation({ summary: "Đăng ký tài khoản người dùng mới" })
  @ApiResponse({ status: 201, type: AuthTokensResponseDto })
  async register(@Body() dto: RegisterDto): Promise<AuthTokensResponseDto> {
    return this.authService.register(dto);
  }

  @Public()
  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Đăng nhập và nhận Tokens" })
  @ApiResponse({ status: 200, type: AuthTokensResponseDto })
  async login(@Body() dto: LoginDto): Promise<AuthTokensResponseDto> {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post("logout")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Đăng xuất và hủy refresh session" })
  async logout(@CurrentUser("userId") userId: string): Promise<{ message: string }> {
    await this.authService.logout(userId);
    return { message: "Đăng xuất thành công" };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get("me")
  @ApiOperation({ summary: "Lấy thông tin cá nhân của người dùng hiện tại" })
  async getProfile(@CurrentUser() user: CurrentUserPayload) {
    return user;
  }
}