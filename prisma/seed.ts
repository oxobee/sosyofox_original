import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/auth/password";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "mail.sosyofox@gmail.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "Ugur2803*";

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: "ADMIN", status: "ACTIVE" },
    create: {
      email: adminEmail,
      passwordHash: await hashPassword(adminPassword),
      role: "ADMIN",
      profile: { create: { fullName: "Sosyofox Admin" } },
      wallet: { create: { balance: 0 } }
    }
  });

  await prisma.apiProvider.upsert({
    where: { name: "wesosyal" },
    update: {},
    create: {
      name: "wesosyal",
      displayName: "WeSosyal",
      status: "WAITING_CREDENTIALS"
    }
  });

  const category = await prisma.category.upsert({
    where: { slug: "sosyal-platform-buyume" },
    update: {},
    create: {
      sosyofoxCategoryName: "Sosyal Platform Büyüme",
      slug: "sosyal-platform-buyume",
      description: "Admin tarafından yayına alınabilecek örnek manuel kategori.",
      icon: "trending_up",
      isVisible: false
    }
  });

  await prisma.service.upsert({
    where: { slug: "ornek-buyume-hizmeti" },
    update: {},
    create: {
      categoryId: category.id,
      sosyofoxCategoryName: category.sosyofoxCategoryName,
      sosyofoxServiceName: "Örnek Büyüme Hizmeti",
      slug: "ornek-buyume-hizmeti",
      customDescription: "Seed ile gelen örnek manuel hizmet; yayında değildir.",
      icon: "rocket_launch",
      min: 10,
      max: 1000,
      originalRate: 0,
      finalPrice: 0,
      manualProcessing: true,
      isVisible: false
    }
  });

  await prisma.siteSetting.upsert({
    where: { key: "brand" },
    update: { value: { siteName: "Sosyofox", defaultTheme: "dark", minimumTopup: 50 } },
    create: { key: "brand", value: { siteName: "Sosyofox", defaultTheme: "dark", minimumTopup: 50 } }
  });

  const legalPages = [
    ["kvkk-aydinlatma-metni", "KVKK Aydınlatma Metni"],
    ["kullanim-sartlari", "Kullanım Şartları"],
    ["gizlilik-politikasi", "Gizlilik Politikası"],
    ["iade-ve-iptal-politikasi", "İade ve İptal Politikası"],
    ["cerez-politikasi", "Çerez Politikası"]
  ] as const;

  for (const [slug, title] of legalPages) {
    await prisma.legalPage.upsert({
      where: { slug },
      update: {},
      create: {
        slug,
        title,
        content: `<p>${title} admin panelinden düzenlenebilir.</p>`,
        seoTitle: `${title} | Sosyofox`,
        seoDescription: `${title} sayfası.`
      }
    });
  }

  await prisma.auditLog.create({
    data: {
      actorId: admin.id,
      action: "seed.completed",
      entity: "System",
      metadata: { adminEmail }
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
