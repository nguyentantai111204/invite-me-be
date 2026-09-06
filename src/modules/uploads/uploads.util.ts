import { BadRequestException } from "@nestjs/common";

/**
 * Kiểm tra tính hợp lệ của file dựa trên Magic Bytes (File Signature)
 * Đảm bảo file gửi lên thực sự là file ảnh / audio chứ không bị đổi extension giả mạo.
 */
export function validateImageSignature(buffer: Buffer, originalMime: string): void {
  if (!buffer || buffer.length < 4) {
    throw new BadRequestException({
      code: "UPLOAD_INVALID_FILE",
      message: "File tải lên không hợp lệ hoặc rỗng.",
    });
  }

  // 1. JPEG: FF D8 FF
  const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;

  // 2. PNG: 89 50 4E 47
  const isPng =
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47;

  // 3. GIF: 47 49 46 38
  const isGif =
    buffer[0] === 0x47 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x38;

  // 4. WEBP: RIFF....WEBP (52 49 46 46 .... 57 45 42 50)
  const isWebp =
    buffer.length >= 12 &&
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50;

  // 5. SVG: Text check chứa <svg
  const isSvg =
    originalMime.includes("svg") &&
    buffer.slice(0, 100).toString("utf-8").toLowerCase().includes("<svg");

  if (!isJpeg && !isPng && !isGif && !isWebp && !isSvg) {
    throw new BadRequestException({
      code: "UPLOAD_INVALID_IMAGE_SIGNATURE",
      message:
        "Nội dung file không đúng định dạng hình ảnh hợp lệ (chỉ chấp nhận JPEG, PNG, WEBP, GIF, SVG).",
    });
  }
}

/**
 * Kiểm tra tính hợp lệ của file âm thanh
 */
export function validateAudioSignature(buffer: Buffer): void {
  if (!buffer || buffer.length < 4) {
    throw new BadRequestException({
      code: "UPLOAD_INVALID_FILE",
      message: "File tải lên không hợp lệ hoặc rỗng.",
    });
  }

  // MP3 (ID3 tag or MPEG sync header)
  const isId3Mp3 = buffer[0] === 0x49 && buffer[1] === 0x44 && buffer[2] === 0x33;
  const isSyncMp3 =
    buffer[0] === 0xff && (buffer[1] === 0xfb || buffer[1] === 0xf3 || buffer[1] === 0xf2);

  // WAV: RIFF....WAVE (52 49 46 46 .... 57 41 56 45)
  const isWav =
    buffer.length >= 12 &&
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x41 &&
    buffer[10] === 0x56 &&
    buffer[11] === 0x45;

  // OGG: OggS (4F 67 67 53)
  const isOgg =
    buffer[0] === 0x4f &&
    buffer[1] === 0x67 &&
    buffer[2] === 0x67 &&
    buffer[3] === 0x53;

  // AAC ADTS: FF F1 or FF F9
  const isAac = buffer[0] === 0xff && (buffer[1] === 0xf1 || buffer[1] === 0xf9);

  if (!isId3Mp3 && !isSyncMp3 && !isWav && !isOgg && !isAac) {
    throw new BadRequestException({
      code: "UPLOAD_INVALID_AUDIO_SIGNATURE",
      message:
        "Nội dung file không đúng định dạng âm thanh hợp lệ (chỉ chấp nhận MP3, WAV, AAC, OGG).",
    });
  }
}
