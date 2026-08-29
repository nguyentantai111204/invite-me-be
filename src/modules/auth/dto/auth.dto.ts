import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class RegisterDto {
  @ApiProperty({ example: "Nguyễn Văn A" })
  @IsString()
  @IsNotEmpty({ message: "Họ và tên không được để trống" })
  fullName: string;

  @ApiProperty({ example: "user@example.com" })
  @IsEmail({}, { message: "Email không hợp lệ" })
  email: string;

  @ApiProperty({ example: "Password123@", minLength: 6 })
  @IsString()
  @MinLength(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" })
  password: string;
}

export class LoginDto {
  @ApiProperty({ example: "user@example.com" })
  @IsEmail({}, { message: "Email không hợp lệ" })
  email: string;

  @ApiProperty({ example: "Password123@" })
  @IsString()
  @IsNotEmpty({ message: "Mật khẩu không được để trống" })
  password: string;
}

export class RefreshTokenDto {
  @ApiPropertyOptional({ description: "Refresh token nếu gửi qua body" })
  @IsString()
  @IsOptional()
  refreshToken?: string;
}

export class AuthTokensResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
    avatarUrl?: string | null;
  };
}