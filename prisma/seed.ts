import { PrismaClient, AssetCategory, EffectCategory } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting InviteMe database seeding...");

  // ── 1. Seed CMS Home Config ──
  console.log("1️⃣ Seeding Home Config CMS...");
  const homeConfig = await prisma.homeConfig.findFirst();
  if (!homeConfig) {
    await prisma.homeConfig.create({
      data: {
        heroBadge: "✨ Nền tảng thiệp cưới 3D & tương tác #1",
        heroTitle: "Thiệp Cưới Online Nghệ Thuật & Sang Trọng",
        heroSubtitle:
          "Tự tay thiết kế thiệp cưới online phong cách hoàng kim độc bản với hiệu ứng mở bìa 3D, âm nhạc acoustic và quản lý RSVP thông minh.",
        heroCtaText: "Khám Phá Mẫu Thiệp",
        heroCtaLink: "/templates",
        featuredSlugs: ["royal-luxury", "minimalist-rose", "golden-elegance"],
        statsCount: {
          templates: 120,
          couples: 5800,
          wishes: 45000,
          satisfaction: 99.4,
        },
        testimonials: [
          {
            couple: "Minh Hoàng & Khánh Linh",
            date: "Tháng 11 / 2026",
            avatarUrl:
              "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=400&auto=format&fit=crop",
            content:
              "Khách mời ai cũng khen nức nở hiệu ứng mở phong bao 3D và nhạc nền Until I Found You. Trải nghiệm rất hoàng gia và sang trọng!",
            rating: 5,
          },
          {
            couple: "Đức Anh & Mai Phương",
            date: "Tháng 10 / 2026",
            avatarUrl:
              "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=400&auto=format&fit=crop",
            content:
              "Studio kéo thả cực kỳ dễ dùng, mình chỉ mất 15 phút là hoàn thiện thiệp cưới hoàn hảo cho cả hai bên gia đình.",
            rating: 5,
          },
        ],
        faqs: [
          {
            question: "Tôi có thể gửi thiệp qua Zalo, Facebook không?",
            answer:
              "Hoàn toàn được! Mỗi thiệp có một đường link bảo mật riêng và ảnh xem trước (OG Image) hiển thị tuyệt đẹp trên Zalo, Messenger, iMessage.",
          },
          {
            question: "Khách mời có cần đăng ký tài khoản để xác nhận dự tiệc (RSVP) không?",
            answer:
              "Không cần, khách chỉ cần mở thiệp, chọn tham dự và nhập lời chúc là thông tin tự động đồng bộ về trang quản lý của bạn.",
          },
          {
            question: "Hiệu ứng mở bao thư 3D có hỗ trợ trên điện thoại không?",
            answer:
              "Có, hệ thống được tối ưu hóa hiển thị 3D mượt mà trên cả iPhone, Android và máy tính.",
          },
        ],
      },
    });
  }

  // ── 2. Seed Effect Presets (3D Openings & Ambient Particles) ──
  console.log("2️⃣ Seeding Effect Presets...");
  const effects = [
    {
      code: "envelope-3d",
      name: "Bao Thư 3D Hoàng Gia",
      description: "Nắp bao thư mở lật 3D sang trọng kèm niêm phong sáp đỏ vàng kim.",
      category: EffectCategory.OPENING_3D,
      icon: "✉️",
      isPremium: false,
    },
    {
      code: "scroll-royal",
      name: "Cuộn Chiếu Hoàng Kim",
      description: "Mở cuốn thư nhung đỏ viền chỉ vàng theo phong cách hoàng tộc cổ điển.",
      category: EffectCategory.OPENING_3D,
      icon: "📜",
      isPremium: true,
    },
    {
      code: "wax-seal",
      name: "Niêm Phong Sáp Nóng",
      description: "Chạm để làm tan con dấu sáp khắc hoa văn và mở thiệp cưới.",
      category: EffectCategory.OPENING_3D,
      icon: "💌",
      isPremium: true,
    },
    {
      code: "sakura",
      name: "Cánh Hoa Đào Rơi",
      description: "Những cánh hoa anh đào hồng phấn bay nhẹ nhàng trong không gian.",
      category: EffectCategory.PARTICLE,
      icon: "🌸",
      isPremium: false,
    },
    {
      code: "gold-dust",
      name: "Bụi Vàng Lấp Lánh",
      description: "Các hạt bụi vàng ánh kim chuyển động nhẹ nhàng tăng vẻ lộng lẫy.",
      category: EffectCategory.PARTICLE,
      icon: "✨",
      isPremium: false,
    },
    {
      code: "hearts",
      name: "Trái Tim Tình Yêu",
      description: "Trái tim lãng mạn bay bổng nhẹ nhàng trong gió.",
      category: EffectCategory.PARTICLE,
      icon: "💖",
      isPremium: false,
    },
  ];

  for (const eff of effects) {
    await prisma.effectPreset.upsert({
      where: { code: eff.code },
      update: eff,
      create: eff,
    });
  }

  // ── 3. Seed Assets (Stickers, BGM Audio, Backgrounds) ──
  console.log("3️⃣ Seeding Assets Library...");
  const stickers = [
    { content: "🌸", name: "Hoa Đào", subCategory: "floral" },
    { content: "🌹", name: "Hoa Hồng", subCategory: "floral" },
    { content: "💐", name: "Bó Hoa", subCategory: "floral" },
    { content: "💍", name: "Nhẫn Cưới", subCategory: "rings" },
    { content: "💎", name: "Kim Cương", subCategory: "rings" },
    { content: "👑", name: "Vương Miện", subCategory: "badges" },
    { content: "🕊️", name: "Bồ Câu", subCategory: "badges" },
    { content: "🥂", name: "Nâng Ly", subCategory: "badges" },
  ];

  for (let i = 0; i < stickers.length; i++) {
    const s = stickers[i];
    await prisma.asset.upsert({
      where: { id: `00000000-0000-0000-0000-0000000000${String(i + 1).padStart(2, "0")}` },
      update: {},
      create: {
        id: `00000000-0000-0000-0000-0000000000${String(i + 1).padStart(2, "0")}`,
        category: AssetCategory.STICKER,
        name: s.name,
        subCategory: s.subCategory,
        content: s.content,
        order: i,
        isActive: true,
      },
    });
  }

  // Audio BGM Tracks
  const audioTracks = [
    {
      id: "00000000-0000-0000-0000-000000000101",
      name: "Until I Found You - Wedding Acoustic",
      subCategory: "acoustic",
      url: "/audio/wedding-bgm.mp3",
      metadata: { duration: 184, artist: "Stephen Sanchez (Acoustic)" },
    },
    {
      id: "00000000-0000-0000-0000-000000000102",
      name: "A Thousand Years - Piano & Cello",
      subCategory: "piano",
      url: "/audio/thousand-years-piano.mp3",
      metadata: { duration: 245, artist: "Christina Perri Cover" },
    },
    {
      id: "00000000-0000-0000-0000-000000000103",
      name: "Canon in D - Romantic Strings",
      subCategory: "classical",
      url: "/audio/canon-in-d.mp3",
      metadata: { duration: 310, artist: "Pachelbel" },
    },
  ];

  for (const a of audioTracks) {
    await prisma.asset.upsert({
      where: { id: a.id },
      update: {},
      create: {
        id: a.id,
        category: AssetCategory.AUDIO,
        name: a.name,
        subCategory: a.subCategory,
        url: a.url,
        metadata: a.metadata,
        isActive: true,
      },
    });
  }

  // ── 4. Seed Templates ──
  console.log("4️⃣ Seeding Templates...");
  const templates = [
    {
      slug: "royal-luxury",
      title: "Hoàng Gia Sang Trọng",
      description: "Phong cách cổ điển Châu Âu với font Playfair Display và bảng màu vàng hoàng kim sang trọng.",
      category: "wedding",
      thumbnailUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop",
      previewSlug: "minh-linh",
      isPremium: true,
      isPopular: true,
      tags: ["Playfair", "Vàng Gold", "Cổ Điển", "3D Envelope"],
      themeConfig: {
        fontIds: ["playfair", "greatVibes", "montserrat"],
        primaryColor: "#B78628",
        secondaryColor: "#E8C872",
        accentColor: "#6B1D2F",
        backgroundColor: "#FAF8F5",
        envelopeColor: "#EADCC9",
        autoPlayMusic: true,
        bgMusicUrl: "/audio/wedding-bgm.mp3",
      },
    },
    {
      slug: "minimalist-rose",
      title: "Hồng Pastel Tối Giản",
      description: "Thiết kế tối giản thanh lịch với tông hồng pastel nhẹ nhàng, phù hợp phong cách hiện đại.",
      category: "wedding",
      thumbnailUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600&auto=format&fit=crop",
      previewSlug: "minh-linh",
      isPremium: false,
      isPopular: true,
      tags: ["Tối Giản", "Pastel", "Hiện Đại"],
      themeConfig: {
        fontIds: ["montserrat", "greatVibes"],
        primaryColor: "#E58B7B",
        secondaryColor: "#F7D8D3",
        accentColor: "#8B4F58",
        backgroundColor: "#FFF9F8",
        envelopeColor: "#F7E8E5",
        autoPlayMusic: false,
      },
    },
    {
      slug: "golden-elegance",
      title: "Ánh Kim Quý Phái",
      description: "Sự kết hợp hoàn hảo giữa nhung đỏ rượu vang và viền vàng kim quý phái.",
      category: "wedding",
      thumbnailUrl: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=600&auto=format&fit=crop",
      previewSlug: "minh-linh",
      isPremium: true,
      isPopular: false,
      tags: ["Rượu Vang", "Hoàng Kim", "Quý Tộc"],
      themeConfig: {
        fontIds: ["playfair", "greatVibes"],
        primaryColor: "#851C24",
        secondaryColor: "#D4AF37",
        accentColor: "#EBDBC8",
        backgroundColor: "#FBF7F2",
        envelopeColor: "#851C24",
        autoPlayMusic: true,
      },
    },
  ];

  for (const t of templates) {
    await prisma.template.upsert({
      where: { slug: t.slug },
      update: t,
      create: t,
    });
  }

  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });