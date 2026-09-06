import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import appConfig from "./config/app.config";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { InvitationsModule } from "./modules/invitations/invitations.module";
import { TemplatesModule } from "./modules/templates/templates.module";
import { RsvpModule } from "./modules/rsvp/rsvp.module";
import { UploadsModule } from "./modules/uploads/uploads.module";
import { CmsModule } from "./modules/cms/cms.module";
import { AssetsModule } from "./modules/assets/assets.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    InvitationsModule,
    TemplatesModule,
    RsvpModule,
    UploadsModule,
    CmsModule,
    AssetsModule,
  ],
})
export class AppModule {}