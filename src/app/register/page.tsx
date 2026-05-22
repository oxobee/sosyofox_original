import Image from "next/image";
import Link from "next/link";
import { AuthForm } from "@/components/public/auth-form";

export default function RegisterPage() {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <section className="sf-card w-full max-w-md p-6">
        <Image src="/brand/logo.png" alt="Sosyofox" width={210} height={43} className="mb-8 h-10 w-auto" priority />
        <h1 className="text-3xl font-black">Hesap oluştur</h1>
        <p className="mt-2 text-sm leading-6 text-[color:var(--sf-muted)]">Mobil ve web uyumlu panelde bakiye, sipariş ve destek akışlarını takip edin.</p>
        <div className="mt-6">
          <AuthForm mode="register" />
        </div>
        <p className="mt-5 text-sm text-[color:var(--sf-muted)]">Zaten hesabınız var mı? <Link className="font-bold text-[color:var(--sf-primary-soft)]" href="/login">Giriş yapın</Link></p>
      </section>
    </main>
  );
}
