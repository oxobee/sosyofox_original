"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/md3/button";
import { MdIcon } from "@/components/md3/icon";
import { TextField } from "@/components/md3/text-field";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(formData: FormData) {
    setLoading(true);
    setError("");
    const payload = Object.fromEntries(formData.entries());
    const response = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await response.json().catch(() => ({}));
    setLoading(false);
    if (!response.ok) {
      setError(data.error ?? "İşlem tamamlanamadı.");
      return;
    }
    router.push(data.role === "ADMIN" ? "/admin" : "/panel");
    router.refresh();
  }

  return (
    <form action={submit} className="grid gap-4">
      {mode === "register" ? <TextField name="fullName" label="Ad soyad" autoComplete="name" required /> : null}
      <TextField name="email" label="E-posta" type="email" autoComplete="email" required />
      {mode === "register" ? <TextField name="phone" label="Cep telefonu" type="tel" autoComplete="tel" placeholder="+90 5__ ___ __ __" required /> : null}
      <TextField name="password" label="Şifre" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} required minLength={8} />
      {error ? <p className="rounded-[14px] border border-red-300/20 bg-red-400/10 p-3 text-sm text-red-100">{error}</p> : null}
      <Button type="submit" icon={mode === "login" ? "login" : "person_add"} disabled={loading}>
        {loading ? "İşleniyor..." : mode === "login" ? "Giriş yap" : "Hesap oluştur"}
      </Button>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-xs font-black uppercase tracking-[0.16em] text-[color:var(--sf-muted)]">
        <span className="h-px bg-white/10" />
        veya
        <span className="h-px bg-white/10" />
      </div>
      <a
        href="/api/auth/google"
        className="inline-flex min-h-12 items-center justify-center gap-3 rounded-[14px] border border-white/12 bg-white/7 px-4 font-black text-white transition hover:-translate-y-0.5 hover:bg-white/10"
      >
        <MdIcon name="account_circle" />
        Google ile {mode === "login" ? "giriş yap" : "kayıt ol"}
      </a>
    </form>
  );
}
