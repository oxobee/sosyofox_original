import { getPrisma, hasDatabaseUrl } from "@/lib/db/prisma";

export async function getVisibleCatalog() {
  if (!hasDatabaseUrl()) return { categories: [], services: [] };

  try {
    const prisma = getPrisma();
    const [categories, services, categoryGroups] = await Promise.all([
      prisma.category.findMany({
        where: { isVisible: true },
        orderBy: [{ sortOrder: "asc" }, { sosyofoxCategoryName: "asc" }]
      }),
      prisma.service.findMany({
        where: { isVisible: true },
        include: { category: true },
        orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }, { sosyofoxServiceName: "asc" }],
        take: 24
      }),
      prisma.category.findMany({
        where: { isVisible: true, services: { some: { isVisible: true } } },
        include: {
          services: {
            where: { isVisible: true },
            orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }, { sosyofoxServiceName: "asc" }],
            take: 8
          }
        },
        orderBy: [{ sortOrder: "asc" }, { sosyofoxCategoryName: "asc" }],
        take: 10
      })
    ]);

    return { categories, services, categoryGroups };
  } catch {
    return { categories: [], services: [], categoryGroups: [] };
  }
}

export async function getHeaderSearchCatalog() {
  if (!hasDatabaseUrl()) return { categories: [], services: [] };

  try {
    const prisma = getPrisma();
    const [categories, services] = await Promise.all([
      prisma.category.findMany({
        where: { isVisible: true },
        select: { id: true, sosyofoxCategoryName: true, slug: true, icon: true },
        orderBy: [{ sortOrder: "asc" }, { sosyofoxCategoryName: "asc" }],
        take: 40
      }),
      prisma.service.findMany({
        where: { isVisible: true },
        select: {
          id: true,
          sosyofoxServiceName: true,
          slug: true,
          icon: true,
          finalPrice: true,
          category: { select: { sosyofoxCategoryName: true } }
        },
        orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }, { sosyofoxServiceName: "asc" }],
        take: 120
      })
    ]);

    return {
      categories: categories.map((category) => ({
        id: category.id,
        type: "category" as const,
        title: category.sosyofoxCategoryName,
        subtitle: "Kategori",
        href: `/kategori/${category.slug}`,
        icon: category.icon
      })),
      services: services.map((service) => ({
        id: service.id,
        type: "service" as const,
        title: service.sosyofoxServiceName,
        subtitle: service.category?.sosyofoxCategoryName ?? "Hizmet",
        href: `/hizmet/${service.slug}`,
        icon: service.icon,
        price: service.finalPrice.toString()
      }))
    };
  } catch {
    return { categories: [], services: [] };
  }
}

export async function getVisibleCategories() {
  if (!hasDatabaseUrl()) return [];

  try {
    return getPrisma().category.findMany({
      where: { isVisible: true, services: { some: { isVisible: true } } },
      select: { id: true, sosyofoxCategoryName: true, slug: true, icon: true },
      orderBy: [{ sortOrder: "asc" }, { sosyofoxCategoryName: "asc" }],
      take: 80
    });
  } catch {
    return [];
  }
}

export async function getCategoryBySlug(slug: string) {
  if (!hasDatabaseUrl()) return null;

  try {
    return getPrisma().category.findUnique({
      where: { slug },
      include: {
        services: {
          where: { isVisible: true },
          orderBy: [{ sortOrder: "asc" }, { sosyofoxServiceName: "asc" }]
        }
      }
    });
  } catch {
    return null;
  }
}

export async function getServiceBySlug(slug: string) {
  if (!hasDatabaseUrl()) return null;

  try {
    return getPrisma().service.findFirst({
      where: { slug, isVisible: true },
      include: { category: true, mappings: true }
    });
  } catch {
    return null;
  }
}

export async function getAdminSnapshot() {
  if (!hasDatabaseUrl()) {
    return {
      users: 0,
      orders: [],
      payments: [],
      services: [],
      categories: 0,
      providerConnected: false
    };
  }

  try {
    const prisma = getPrisma();
    const [users, orders, payments, services, categories, provider] = await Promise.all([
      prisma.user.count(),
      prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 8, include: { user: true, service: true } }),
      prisma.payment.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
      prisma.service.findMany({ orderBy: { updatedAt: "desc" }, take: 12, include: { category: true } }),
      prisma.category.count(),
      prisma.apiProvider.findUnique({ where: { name: "wesosyal" }, include: { credentials: true } })
    ]);

    return {
      users,
      orders,
      payments,
      services,
      categories,
      providerConnected: Boolean(provider?.credentials.some((credential) => credential.isActive))
    };
  } catch {
    return {
      users: 0,
      orders: [],
      payments: [],
      services: [],
      categories: 0,
      providerConnected: false
    };
  }
}

export async function getAdminUsersSnapshot() {
  if (!hasDatabaseUrl()) return { users: [], dbReady: false };

  try {
    const users = await getPrisma().user.findMany({
      orderBy: { createdAt: "desc" },
      take: 80,
      include: {
        profile: true,
        wallet: true,
        billingInfo: true,
        orders: { orderBy: { createdAt: "desc" }, take: 8, include: { service: true } },
        payments: { orderBy: { createdAt: "desc" }, take: 8 },
        tickets: { orderBy: { createdAt: "desc" }, take: 5 }
      }
    });

    return { users, dbReady: true };
  } catch {
    return { users: [], dbReady: false };
  }
}

export async function getIntegrationSnapshot() {
  if (!hasDatabaseUrl()) return { providers: [], settings: [], dbReady: false };

  try {
    const [providers, settings] = await Promise.all([
      getPrisma().apiProvider.findMany({
        orderBy: { updatedAt: "desc" },
        include: { credentials: { orderBy: { createdAt: "desc" }, take: 3 } }
      }),
      getPrisma().integrationSetting.findMany({ orderBy: { updatedAt: "desc" } })
    ]);

    return { providers, settings, dbReady: true };
  } catch {
    return { providers: [], settings: [], dbReady: false };
  }
}

export async function getAdminServicesSnapshot() {
  if (!hasDatabaseUrl()) return { categories: [], services: [], dbReady: false };

  try {
    const prisma = getPrisma();
    const [categories, services] = await Promise.all([
      prisma.category.findMany({
        orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
        include: { _count: { select: { services: true } } }
      }),
      prisma.service.findMany({
        orderBy: [{ updatedAt: "desc" }],
        take: 250,
        include: { category: true, mappings: true }
      })
    ]);

    return { categories, services, dbReady: true };
  } catch {
    return { categories: [], services: [], dbReady: false };
  }
}
