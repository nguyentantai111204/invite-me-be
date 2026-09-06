export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB
export const MAX_AUDIO_SIZE = 15 * 1024 * 1024; // 15 MB

export const ALLOWED_IMAGE_MIMES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
] as const;

export const ALLOWED_AUDIO_MIMES = [
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/x-wav",
  "audio/aac",
  "audio/ogg",
] as const;

export const CLOUDINARY_FOLDER = "inviteme";
