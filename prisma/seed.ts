import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding templates...");

  const royalLuxury = await prisma.template.upsert({
    where: { slug: "royal-luxury" },
    update: {},
    create: {
      slug: "royal-luxury",
      title: "Hoàng Gia Sang Trọng",
      description: "Phong cách cổ điển Châu Âu với font Playfair Display và bảng màu vàng hoàng kim sang trọng.",
      category: "wedding",
      thumbnailUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop",
      previewSlug: "minh-linh",
      isPremium: true,
      isPopular: true,
      tags: ["Playfair", "Vàng Gold", "Cổ Điển"],
      themeConfig: {
        fontIds: ["playfair", "greatVibes", "montserrat"],
        primaryColor: "#B78628",
        secondaryColor: "#E8C872",
        accentColor: "#6B1D2F",
        backgroundColor: "#FAF8F5",
        autoPlayMusic: false,
      },
    },
  });

  const minimalistRose = await prisma.template.upsert({
    where: { slug: "minimalist-rose" },
    update: {},
    create: {
      slug: "minimalist-rose",
      title: "Hồng Pastel Tối Giản",
      description: "Thiết kế tối giản thanh lịch với tông hồng pastel nhẹ nhàng, phù hợp phong cách hiện đại.",
      category: "wedding",
      thumbnailUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600&auto=format&fit=crop",
      previewSlug: "minh-linh",
      isPremium: false,
      isPopular: false,
      tags: ["Tối Giản", "Pastel", "Hiện Đại"],
      themeConfig: {
        fontIds: ["montserrat", "greatVibes"],
        primaryColor: "#E58B7B",
        secondaryColor: "#F7D8D3",
        accentColor: "#8B4F58",
        backgroundColor: "#FFF9F8",
        autoPlayMusic: false,
      },
    },
  });

  console.log("Seeding finished successfully.", { royalLuxury, minimalistRose });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });