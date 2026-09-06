-- CreateEnum
CREATE TYPE "asset_category" AS ENUM ('STICKER', 'SHAPE', 'BACKGROUND', 'AUDIO', 'FONT', 'SAMPLE_IMG');

-- CreateEnum
CREATE TYPE "effect_category" AS ENUM ('OPENING_3D', 'PARTICLE', 'ANIMATION');

-- AlterTable
ALTER TABLE "invitations" ADD COLUMN     "canvas_document" JSONB;

-- AlterTable
ALTER TABLE "templates" ADD COLUMN     "canvas_document" JSONB;

-- CreateTable
CREATE TABLE "home_configs" (
    "id" UUID NOT NULL,
    "hero_title" VARCHAR(255) NOT NULL,
    "hero_subtitle" TEXT,
    "hero_badge" VARCHAR(100),
    "hero_cta_text" VARCHAR(50) NOT NULL DEFAULT 'Tạo thiệp ngay',
    "hero_cta_link" VARCHAR(200) NOT NULL DEFAULT '/templates',
    "featured_slugs" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "stats_count" JSONB NOT NULL DEFAULT '{"templates": 120, "couples": 5800, "wishes": 45000}',
    "testimonials" JSONB NOT NULL DEFAULT '[]',
    "faqs" JSONB NOT NULL DEFAULT '[]',
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "home_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assets" (
    "id" UUID NOT NULL,
    "category" "asset_category" NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "sub_category" VARCHAR(50),
    "url" VARCHAR(500),
    "content" TEXT,
    "metadata" JSONB,
    "is_premium" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "effect_presets" (
    "id" UUID NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "category" "effect_category" NOT NULL,
    "icon" VARCHAR(50),
    "config" JSONB NOT NULL DEFAULT '{}',
    "is_premium" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "effect_presets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "assets_category_sub_category_idx" ON "assets"("category", "sub_category");

-- CreateIndex
CREATE UNIQUE INDEX "effect_presets_code_key" ON "effect_presets"("code");
