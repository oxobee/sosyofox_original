import { getPrisma, hasDatabaseUrl } from "@/lib/db/prisma";
import { WesosyalAdapter } from "./adapter";

export async function getWesosyalAdapter() {
  if (!hasDatabaseUrl()) {
    return new WesosyalAdapter({
      encryptedApiKey: null,
      baseUrl: null
    });
  }

  const provider = await getPrisma().apiProvider.findUnique({
    where: { name: "wesosyal" },
    include: { credentials: { where: { isActive: true }, take: 1 } }
  });

  return new WesosyalAdapter({
    encryptedApiKey: provider?.credentials[0]?.encryptedValue,
    baseUrl: provider?.baseUrl
  });
}
