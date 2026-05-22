# Sosyofox

Sosyofox, sosyal medya, uygulama, web ve platform büyüme hizmetlerini tek panelden yönetmek için tasarlanmış Next.js tabanlı SaaS/e-ticaret uygulamasıdır.

## Stack

- Next.js 15 App Router, React, TypeScript strict
- PostgreSQL + Prisma ORM
- Custom DB session auth, argon2 password hash, RBAC
- Tailwind CSS v4 + custom Material 3 token sistemi
- Material Symbols Rounded ikonları
- Motion for React mikro/makro animasyonları
- iyzico ve Havale/EFT ödeme altyapısı

## Kurulum

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run dev
```

Geliştirme URL'i: `http://localhost:3001`

Seed admin:

- E-posta: `mail.sosyofox@gmail.com`
- Şifre: `Ugur2803*`

## Güvenlik Notları

- API anahtarları frontend'e çıkmaz.
- Sağlayıcı, iyzico ve AI anahtarları `ENCRYPTION_KEY` ile encrypted saklanır.
- Sipariş fiyatı server tarafında yeniden hesaplanır.
- Bakiye düşümü, ödeme ve sipariş işlemleri transaction mantığıyla tasarlanmıştır.
- Kritik admin ve kullanıcı işlemleri `AuditLog` tablosuna yazılır.

## Sağlayıcı Entegrasyonu

Sağlayıcı dokümantasyonu gelene kadar adapter gerçek demo dataya düşmez. Admin panelinde anahtar girilmeden senkronizasyon çalışmaz ve kullanıcı tarafında “API bağlantısı bekleniyor” boş durumu gösterilir.

## Komutlar

```bash
npm run dev
npm run lint
npm run typecheck
npm run test
npm run build
npm run smoke
```
