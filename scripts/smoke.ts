import { existsSync } from "node:fs";

const required = [
  "public/brand/logo.png",
  "public/brand/icon.png",
  "prisma/schema.prisma",
  "src/app/page.tsx",
  "src/app/admin/page.tsx",
  "src/app/panel/page.tsx"
];

for (const file of required) {
  if (!existsSync(file)) {
    throw new Error(`Missing required file: ${file}`);
  }
}

console.log("Sosyofox smoke check passed.");
