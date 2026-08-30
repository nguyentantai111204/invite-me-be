-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "invitation_event_type" AS ENUM ('WEDDING', 'BIRTHDAY', 'ANNIVERSARY', 'PARTY', 'CORPORATE');

-- CreateEnum
CREATE TYPE "invitation_status" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255),
    "full_name" VARCHAR(100) NOT NULL,
    "avatar_url" VARCHAR(500),
    "role" "user_role" NOT NULL DEFAULT 'USER',
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "hashed_refresh_token" VARCHAR(255),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "templates" (
    "id" UUID NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "title" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "category" VARCHAR(50) NOT NULL,
    "thumbnail_url" VARCHAR(500) NOT NULL,
    "preview_slug" VARCHAR(100),
    "is_premium" BOOLEAN NOT NULL DEFAULT false,
    "is_popular" BOOLEAN NOT NULL DEFAULT false,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "theme_config" JSONB NOT NULL,
    "sample_data" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invitations" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "template_id" UUID,
    "slug" VARCHAR(100) NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "event_type" "invitation_event_type" NOT NULL DEFAULT 'WEDDING',
    "status" "invitation_status" NOT NULL DEFAULT 'DRAFT',
    "event_date" TIMESTAMPTZ NOT NULL,
    "event_time" VARCHAR(50) NOT NULL,
    "cover_image" VARCHAR(500) NOT NULL,
    "og_image" VARCHAR(500) NOT NULL,
    "document_version" INTEGER NOT NULL DEFAULT 1,
    "theme_config" JSONB NOT NULL,
    "section_visibility" JSONB NOT NULL,
    "section_order" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "couple_data" JSONB,
    "location_data" JSONB NOT NULL,
    "schedule_data" JSONB NOT NULL DEFAULT '[]',
    "gallery_data" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "bank_accounts_data" JSONB NOT NULL DEFAULT '[]',
    "rsvp_enabled" BOOLEAN NOT NULL DEFAULT true,
    "rsvp_config" JSONB,
    "password_hash" VARCHAR(255),
    "published_at" TIMESTAMPTZ,
    "draft_expires_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "invitations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rsvps" (
    "id" UUID NOT NULL,
    "invitation_id" UUID NOT NULL,
    "guest_name" VARCHAR(100) NOT NULL,
    "phone_number" VARCHAR(20),
    "attending" BOOLEAN NOT NULL DEFAULT true,
    "number_of_guests" INTEGER NOT NULL DEFAULT 1,
    "dietary_requirements" VARCHAR(255),
    "wishes" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rsvps_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "templates_slug_key" ON "templates"("slug");

-- CreateIndex
CREATE INDEX "templates_category_idx" ON "templates"("category");

-- CreateIndex
CREATE UNIQUE INDEX "invitations_slug_key" ON "invitations"("slug");

-- CreateIndex
CREATE INDEX "invitations_user_id_idx" ON "invitations"("user_id");

-- CreateIndex
CREATE INDEX "invitations_slug_idx" ON "invitations"("slug");

-- CreateIndex
CREATE INDEX "invitations_status_idx" ON "invitations"("status");

-- CreateIndex
CREATE INDEX "rsvps_invitation_id_idx" ON "rsvps"("invitation_id");

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rsvps" ADD CONSTRAINT "rsvps_invitation_id_fkey" FOREIGN KEY ("invitation_id") REFERENCES "invitations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
