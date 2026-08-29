# InviteMe Backend - Developer & Agent Guidelines

## 1. Project Overview & Core Philosophy

- **Stack:** NestJS, TypeScript, Prisma ORM, PostgreSQL (Redis/BullMQ chỉ dùng khi bắt buộc).
- **Architecture:** Modular Monolith. Tuyệt đối **không** over-engineer (không Microservices, Kafka, GraphQL, CQRS... nếu không có yêu cầu thực tế).
- **Priorities:** Correctness > Security > Maintainability > Type safety > Testability > Performance > Simplicity.
- **Flow chuẩn:** `Controller` ➝ `Service` ➝ `PrismaService` ➝ `PostgreSQL`.

## 2. Architecture & Code Rules

- **Controllers (Thin):** Chỉ nhận Request, validate DTO, áp dụng Guards/Pipes và gọi Service. **Không** chứa logic nghiệp vụ, query DB hay hash password.
- **Services (Fat):** Chứa business logic, handle transactions, gọi external API. Tách nhỏ service nếu quá phức tạp.
- **TypeScript:** Chế độ strict. Tránh dùng `any` và ép kiểu (`as SomeType`). Dùng `unknown` nếu thực sự không rõ.
- **Naming Convention:** File `kebab-case.ts`, Class `PascalCase`, Variable/Function `camelCase`, Constant `UPPER_SNAKE_CASE`.
- **Comments:** Chỉ comment giải thích **TẠI SAO (WHY)**, không giải thích CÁI GÌ (WHAT).

## 3. Database & Prisma

- **Source of Truth:** `prisma/schema.prisma`. Không bao giờ sửa DB production bằng tay.
- **Migrations:** Bắt buộc dùng `npx prisma migrate dev` (môi trường dev) và `npx prisma migrate deploy` (môi trường prod). **Tuyệt đối không dùng `prisma db push` trên production.**
- **Prisma Service:** Chỉ dùng 1 `PrismaService` tập trung inject qua constructor. Không khởi tạo `new PrismaClient()` rải rác.
- **Schema Rules:** Dùng UUID cho public resources, UTC timestamps (`createdAt`, `updatedAt`). Phân biệt Naming: Model `PascalCase`, Field `camelCase`, Database table/column `snake_case` (Dùng `@map`/`@@map`).
- **Query Rules:** Tránh N+1 query. Dùng `select` chỉ lấy các field cần thiết, hạn chế `include` dư thừa. Dùng `$transaction` cho các thao tác cần tính nguyên tử (atomic), nhưng không bọc các API call bên ngoài vào transaction. Tránh Raw SQL tối đa.

## 4. API Design & Validation

- **RESTful:** API versioning (`/api/v1/...`). Phân định rõ tài nguyên công khai (Public) và quản trị (Management).
- **DTOs:** Mọi request body phải dùng DTO. Bật global `ValidationPipe` (`whitelist: true`, `forbidNonWhitelisted: true`).
- **Responses & Errors:** Trả về Response DTO/Mappers, **không bao giờ trả về raw Prisma model** để tránh lộ dữ liệu nội bộ. Dùng mã lỗi nghiệp vụ (VD: `AUTH_INVALID_CREDENTIALS`) thay vì expose SQL error hay stack traces.
- **Swagger:** Cập nhật tài liệu OpenAPI đồng bộ với code (Endpoints, DTOs, Errors).

## 5. Security & Authentication

- **AuthN vs AuthZ:** Phân biệt rõ "Bạn là ai?" (Authentication) và "Bạn được làm gì?" (Authorization). Luôn dùng danh tính từ Request context, không tin tưởng `userId` từ client gửi lên.
- **Secrets:** Bắt buộc dùng biến môi trường (quản lý tại `src/config/`). Không bao giờ commit secret hay log sensitive data (passwords, tokens).
- **Tokens & Passwords:** Hash password bằng Argon2id. Lưu hash của refresh token thay vì token gốc. JWT payload không chứa dữ liệu nhạy cảm.
- **File Uploads:** Không tin tưởng filename, extension, hay MIME type từ client. Validate chặt chẽ file signature và size. Ưu tiên lưu trữ Cloud (S3/Cloudinary) thay vì local file system.

## 6. Domain Specifics (InviteMe Rules)

- **Public Invitations:** Route `/i/[slug]`. API public chỉ trả về dữ liệu công khai, ẩn toàn bộ thông tin RSVP, admin, password.
- **Slugs:** Phải URL-safe, unique, indexed và cố định sau khi publish. Không dùng thông tin nhạy cảm (như email) làm slug.
- **Invitation Lifecycle:** Status (DRAFT ➝ PUBLISHED) phải được kiểm soát bằng business logic, không cho phép client cập nhật status tùy ý.
- **Anonymous Mode:** Thiệp tạo ẩn danh phải có thời hạn (Expiration), cơ chế Claim bảo mật, không được phép enumerate (duyệt hàng loạt).
- **Document JSON:** Dữ liệu editor lưu dạng Prisma Json phải có `version`. Bất kỳ thay đổi cấu trúc nào cũng cần strategy migrate tương ứng.

## 7. Workflow & Definition of Done

- **External Services & Jobs:** Background jobs (BullMQ) dùng cho tác vụ nặng (Gửi email, xử lý ảnh). External APIs phải có timeout và retry strategy.
- **Testing:** Phải có Unit/Integration tests cho Auth, RSVP, Publish Logic. Không viết test vô nghĩa chỉ để tăng coverage. Không dùng DB production để test.
- **Git & CI:** Code phải qua `lint`, `test`, `build` trước khi merge.
- **Agent Workflow:**
  1. Hiểu requirement ➝ 2. Phân tích kiến trúc hiện tại ➝ 3. Thiết kế giải pháp nhỏ nhất ➝ 4. Modify schema (nếu có) ➝ 5. Implement ➝ 6. Test ➝ 7. Lint/Build.
