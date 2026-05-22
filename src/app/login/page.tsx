import Image from "next/image";
import Link from "next/link";
import { AuthForm } from "@/components/public/auth-form";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <section className="sf-card w-full max-w-md p-6">
        <Image src="/brand/logo.png" alt="Sosyofox" width={210} height={43} className="mb-8 h-10 w-auto" priority />
        <h1 className="text-3xl font-black">Giriş yap</h1>
        <p className="mt-2 text-sm leading-6 text-[color:var(--sf-muted)]">Sipariş, ödeme ve destek süreçlerinizi güvenli panelden yönetin.</p>
        <div className="mt-6">
          <AuthForm mode="login" />
        </div>
        <p className="mt-5 text-sm text-[color:var(--sf-muted)]">Hesabınız yok mu? <Link className="font-bold text-[color:var(--sf-primary-soft)]" href="/register">Kayıt olun</Link></p>
      </section>
    </main>
  );
}
