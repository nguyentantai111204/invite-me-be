import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from "class-validator";

export class SubmitRsvpDto {
  @ApiProperty({ example: "invitation-uuid" })
  @IsString()
  @IsNotEmpty()
  invitationId: string;

  @ApiProperty({ example: "Nguyễn Văn B" })
  @IsString()
  @IsNotEmpty({ message: "Họ và tên không được để trống" })
  guestName: string;

  @ApiPropertyOptional({ example: "0901234567" })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  attending: boolean;

  @ApiPropertyOptional({ example: 2, default: 1 })
  @IsInt()
  @Min(1)
  @Max(10)
  @IsOptional()
  numberOfGuests?: number = 1;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  dietaryRequirements?: string;

  @ApiPropertyOptional({ example: "Chúc hai bạn trăm năm hạnh phúc!" })
  @IsString()
  @IsOptional()
  wishes?: string;
}