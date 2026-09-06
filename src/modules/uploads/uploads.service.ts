import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { UploadApiErrorResponse, UploadApiResponse, v2 as cloudinary } from "cloudinary";
import { UploadResponseDto } from "./dto/upload-response.dto";
import {
  ALLOWED_AUDIO_MIMES,
  ALLOWED_IMAGE_MIMES,
  CLOUDINARY_FOLDER,
  MAX_AUDIO_SIZE,
  MAX_IMAGE_SIZE,
} from "./uploads.constant";
import { validateAudioSignature, validateImageSignature } from "./uploads.util";

@Injectable()
export class UploadsService {
  private readonly logger = new Logger(UploadsService.name);

  /**
   * Tải lên và tối ưu hóa hình ảnh (tự động chuyển đổi định dạng WebP/AVIF nhẹ & sắc nét)
   */
  async uploadImage(
    file: Express.Multer.File,
    subFolder = "images",
  ): Promise<UploadResponseDto> {
    if (!file) {
      throw new BadRequestException({
        code: "UPLOAD_FILE_REQUIRED",
        message: "Vui lòng chọn file hình ảnh để tải lên.",
      });
    }

    // 1. Validate File Size
    if (file.size > MAX_IMAGE_SIZE) {
      throw new BadRequestException({
        code: "UPLOAD_FILE_TOO_LARGE",
        message: `Dung lượng hình ảnh vượt quá giới hạn cho phép (Tối đa ${MAX_IMAGE_SIZE / (1024 * 1024)}MB).`,
      });
    }

    // 2. Validate MIME Type
    if (!ALLOWED_IMAGE_MIMES.includes(file.mimetype as (typeof ALLOWED_IMAGE_MIMES)[number])) {
      throw new BadRequestException({
        code: "UPLOAD_UNSUPPORTED_TYPE",
        message: `Định dạng MIME không được hỗ trợ (${file.mimetype}). Chỉ chấp nhận JPEG, PNG, WEBP, GIF, SVG.`,
      });
    }

    // 3. Deep Magic Bytes File Signature Check
    validateImageSignature(file.buffer, file.mimetype);

    // 4. Stream upload lên Cloudinary với tối ưu hóa tự động
    try {
      const result = await new Promise<UploadApiResponse>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: `${CLOUDINARY_FOLDER}/${subFolder}`,
            resource_type: "image",
            transformation: [{ quality: "auto:best" }, { fetch_format: "auto" }],
          },
          (error: UploadApiErrorResponse | undefined, res: UploadApiResponse | undefined) => {
            if (error || !res) {
              return reject(error || new Error("Upload to Cloudinary failed"));
            }
            resolve(res);
          },
        );

        uploadStream.end(file.buffer);
      });

      return {
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        bytes: result.bytes,
        width: result.width,
        height: result.height,
        resourceType: result.resource_type,
      };
    } catch (error) {
      this.logger.error("Lỗi khi tải ảnh lên Cloudinary:", error);
      throw new InternalServerErrorException({
        code: "UPLOAD_PROVIDER_FAILED",
        message: "Không thể tải file lên hệ thống lưu trữ Cloud. Vui lòng kiểm tra lại cấu hình API.",
      });
    }
  }

  /**
   * Tải lên file âm thanh (Nhạc nền đám cưới BGM)
   */
  async uploadAudio(
    file: Express.Multer.File,
    subFolder = "audio",
  ): Promise<UploadResponseDto> {
    if (!file) {
      throw new BadRequestException({
        code: "UPLOAD_FILE_REQUIRED",
        message: "Vui lòng chọn file âm thanh để tải lên.",
      });
    }

    // 1. Validate File Size
    if (file.size > MAX_AUDIO_SIZE) {
      throw new BadRequestException({
        code: "UPLOAD_FILE_TOO_LARGE",
        message: `Dung lượng âm thanh vượt quá giới hạn cho phép (Tối đa ${MAX_AUDIO_SIZE / (1024 * 1024)}MB).`,
      });
    }

    // 2. Validate MIME Type
    if (!ALLOWED_AUDIO_MIMES.includes(file.mimetype as (typeof ALLOWED_AUDIO_MIMES)[number])) {
      throw new BadRequestException({
        code: "UPLOAD_UNSUPPORTED_TYPE",
        message: `Định dạng MIME không được hỗ trợ (${file.mimetype}). Chỉ chấp nhận MP3, WAV, AAC, OGG.`,
      });
    }

    // 3. Deep Magic Bytes Signature Check
    validateAudioSignature(file.buffer);

    // 4. Stream upload lên Cloudinary (dùng resource_type: "video" cho file audio)
    try {
      const result = await new Promise<UploadApiResponse>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: `${CLOUDINARY_FOLDER}/${subFolder}`,
            resource_type: "video",
          },
          (error: UploadApiErrorResponse | undefined, res: UploadApiResponse | undefined) => {
            if (error || !res) {
              return reject(error || new Error("Upload audio to Cloudinary failed"));
            }
            resolve(res);
          },
        );

        uploadStream.end(file.buffer);
      });

      return {
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        bytes: result.bytes,
        resourceType: result.resource_type,
      };
    } catch (error) {
      this.logger.error("Lỗi khi tải file âm thanh lên Cloudinary:", error);
      throw new InternalServerErrorException({
        code: "UPLOAD_PROVIDER_FAILED",
        message: "Không thể tải file âm thanh lên hệ thống lưu trữ Cloud.",
      });
    }
  }

  /**
   * Xóa file khỏi Cloudinary khi xóa thiệp hoặc thay đổi ảnh
   */
  async deleteFile(
    publicId: string,
    resourceType: "image" | "video" | "raw" = "image",
  ): Promise<boolean> {
    try {
      const res = await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
      });
      return res.result === "ok";
    } catch (error) {
      this.logger.warn(`Không thể xóa file ${publicId} trên Cloudinary:`, error);
      return false;
    }
  }
}
