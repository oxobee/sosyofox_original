"use client";

import { useMemo, useState } from "react";
import { MdIcon } from "@/components/md3/icon";
import { formatMoney } from "@/lib/utils";

type AdminCategory = {
  id: string;
  providerCategoryName: string | null;
  sosyofoxCategoryName: string;
  description: string | null;
  icon: string;
  isVisible: boolean;
  isFeatured: boolean;
  serviceCount: number;
};

type AdminService = {
  id: string;
  providerServiceId: string | null;
  providerCategoryName: string | null;
  providerServiceName: string | null;
  sosyofoxCategoryName: string | null;
  sosyofoxServiceName: string;
  description: string | null;
  customDescription: string | null;
  icon: string;
  min: number;
  max: number;
  originalRate: string;
  finalPrice: string;
  profitValue: string;
  isVisible: boolean;
  isFeatured: boolean;
};

type TabKey = "categories" | "services" | "storefront";
type PricingOperation = "match_original" | "increase_percent" | "decrease_percent";

const tabs: Array<{ key: TabKey; label: string; icon: string; help: string }> = [
  { key: "categories", label: "Kategoriler", icon: "category", help: "Kategori adı, açıklama, ikon ve görünürlük." },
  { key: "services", label: "Servisler", icon: "hub", help: "Orijinal servis mapping, toplu seçim ve fiyat işlemleri." },
  { key: "storefront", label: "Hizmetler", icon: "storefront", help: "Kullanıcıya görünen hizmet adı, açıklama ve vitrin düzeni." }
];

function adjustedPrice(originalRate: string, operation: PricingOperation, percent: number) {
  const rate = Number(originalRate);
  if (operation === "match_original") return Number(rate.toFixed(4)).toString();
  const sign = operation === "increase_percent" ? 1 : -1;
  return Number((rate * (1 + sign * percent / 100)).toFixed(4)).toString();
}

export function ServiceManager({ categories, services }: { categories: AdminCategory[]; services: AdminService[] }) {
  const [activeTab, setActiveTab] = useState<TabKey>("categories");
  const [categoryRows, setCategoryRows] = useState(categories);
  const [serviceRows, setServiceRows] = useState(services);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [bulkPercent, setBulkPercent] = useState("10");
  const [message, setMessage] = useState("");

  const filteredServices = useMemo(() => {
    const value = query.trim().toLocaleLowerCase("tr");
    if (!value) return serviceRows;
    return serviceRows.filter((service) =>
      [service.sosyofoxServiceName, service.providerServiceName, service.providerServiceId, service.providerCategoryName, service.sosyofoxCategoryName]
        .filter(Boolean)
        .some((item) => String(item).toLocaleLowerCase("tr").includes(value))
    );
  }, [query, serviceRows]);

  const selectedServiceCount = selectedServices.length;
  const selectedCategoryCount = selectedCategories.length;

  function updateService(id: string, patch: Partial<AdminService>) {
    setServiceRows((rows) => rows.map((row) => row.id === id ? { ...row, ...patch } : row));
  }

  function updateCategory(id: string, patch: Partial<AdminCategory>) {
    setCategoryRows((rows) => rows.map((row) => row.id === id ? { ...row, ...patch } : row));
  }

  function toggleAllServices(checked: boolean) {
    setSelectedServices(checked ? filteredServices.map((service) => service.id) : []);
  }

  function toggleAllCategories(checked: boolean) {
    setSelectedCategories(checked ? categoryRows.map((category) => category.id) : []);
  }

  async function saveService(service: AdminService) {
    const response = await fetch("/api/admin/services", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        kind: "service",
        id: service.id,
        sosyofoxServiceName: service.sosyofoxServiceName,
        sosyofoxCategoryName: service.sosyofoxCategoryName ?? "",
        customDescription: service.customDescription ?? "",
        icon: service.icon,
        finalPrice: Number(service.finalPrice),
        profitValue: Number(service.profitValue || 0),
        isVisible: service.isVisible,
        isFeatured: service.isFeatured
      })
    });
    setMessage(response.ok ? "Servis güncellendi." : "Servis güncellenemedi.");
  }

  async function saveCategory(category: AdminCategory) {
    const response = await fetch("/api/admin/services", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        kind: "category",
        id: category.id,
        sosyofoxCategoryName: category.sosyofoxCategoryName,
        description: category.description ?? "",
        icon: category.icon,
        isVisible: category.isVisible,
        isFeatured: category.isFeatured
      })
    });
    setMessage(response.ok ? "Kategori güncellendi." : "Kategori güncellenemedi.");
  }

  async function bulkVisibility(entity: "service" | "category", ids: string[], isVisible: boolean) {
    if (!ids.length) {
      setMessage("Önce kayıt seçin.");
      return;
    }
    const response = await fetch("/api/admin/services", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ entity, ids, isVisible })
    });
    if (!response.ok) {
      setMessage("Toplu işlem tamamlanamadı.");
      return;
    }
    if (entity === "service") {
      setServiceRows((rows) => rows.map((row) => ids.includes(row.id) ? { ...row, isVisible } : row));
      setSelectedServices([]);
    } else {
      setCategoryRows((rows) => rows.map((row) => ids.includes(row.id) ? { ...row, isVisible } : row));
      setSelectedCategories([]);
    }
    setMessage(isVisible ? "Seçili kayıtlar yayına alındı." : "Seçili kayıtlar gizlendi.");
  }

  async function bulkPricing(operation: PricingOperation) {
    if (!selectedServices.length) {
      setMessage("Önce servis seçin.");
      return;
    }
    const percent = Number(bulkPercent || 0);
    const response = await fetch("/api/admin/services", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "pricing", ids: selectedServices, operation, percent })
    });
    if (!response.ok) {
      setMessage("Toplu fiyat işlemi tamamlanamadı.");
      return;
    }
    setServiceRows((rows) => rows.map((row) => {
      if (!selectedServices.includes(row.id)) return row;
      const signedPercent = operation === "increase_percent" ? percent : operation === "decrease_percent" ? -percent : 0;
      return {
        ...row,
        finalPrice: adjustedPrice(row.originalRate, operation, percent),
        profitValue: signedPercent.toString()
      };
    }));
    setMessage("Seçili servislerin fiyatları güncellendi.");
  }

  async function rewriteDescription(service: AdminService) {
    const response = await fetch("/api/admin/services", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id: service.id })
    });
    const data = await response.json().catch(() => null);
    if (!response.ok || !data?.description) {
      setMessage("Açıklama özgünleştirilemedi.");
      return;
    }
    updateService(service.id, { customDescription: data.description });
    setMessage("Açıklama Sosyofox diliyle özgünleştirildi.");
  }

  return (
    <div className="grid gap-6">
      {message ? (
        <div className="rounded-[14px] border border-orange-300/20 bg-orange-400/10 p-3 text-sm font-black text-orange-100">{message}</div>
      ) : null}

      <section className="sf-card overflow-visible p-3">
        <div className="grid gap-2 md:grid-cols-3">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-[14px] border p-4 text-left transition ${activeTab === tab.key ? "border-orange-300/35 bg-orange-500/14 shadow-[0_0_30px_rgba(255,122,26,0.14)]" : "border-white/10 bg-white/[0.035] hover:bg-white/[0.055]"}`}
            >
              <span className="inline-flex items-center gap-2 text-sm font-black text-white">
                <MdIcon name={tab.icon} className="text-[color:var(--sf-primary-soft)]" /> {tab.label}
              </span>
              <span className="mt-1 block text-xs leading-5 text-white/48">{tab.help}</span>
            </button>
          ))}
        </div>
      </section>

      {activeTab === "categories" ? (
        <section className="sf-card overflow-visible p-5">
          <SectionHead
            title="Kategori Yönetimi"
            text="Sosyofox kategori adı, açıklama, ikon ve görünürlük ayarlarını düzenleyin."
            count={`${selectedCategoryCount} seçili`}
          >
            <label className="inline-flex min-h-10 items-center gap-2 rounded-[12px] border border-white/10 bg-white/6 px-3 text-sm font-black">
              <input type="checkbox" checked={categoryRows.length > 0 && selectedCategories.length === categoryRows.length} onChange={(event) => toggleAllCategories(event.target.checked)} className="accent-[color:var(--sf-primary)]" />
              Tümünü seç
            </label>
            <BulkButton tone="orange" onClick={() => bulkVisibility("category", selectedCategories, true)}>Göster</BulkButton>
            <BulkButton onClick={() => bulkVisibility("category", selectedCategories, false)}>Gizle</BulkButton>
          </SectionHead>
          <div className="grid gap-3">
            {categoryRows.map((category) => (
              <div key={category.id} className="grid gap-3 rounded-[14px] border border-white/10 bg-white/[0.035] p-4 xl:grid-cols-[28px_1.1fr_1fr_90px_120px_auto] xl:items-center">
                <input type="checkbox" checked={selectedCategories.includes(category.id)} onChange={(event) => setSelectedCategories((ids) => event.target.checked ? [...ids, category.id] : ids.filter((id) => id !== category.id))} className="h-5 w-5 accent-[color:var(--sf-primary)]" />
                <InlineInput value={category.sosyofoxCategoryName} onChange={(value) => updateCategory(category.id, { sosyofoxCategoryName: value })} />
                <InlineInput value={category.description ?? ""} placeholder="Açıklama" onChange={(value) => updateCategory(category.id, { description: value })} />
                <InlineInput value={category.icon} onChange={(value) => updateCategory(category.id, { icon: value })} />
                <Toggle checked={category.isVisible} onChange={(checked) => updateCategory(category.id, { isVisible: checked })}>Yayında</Toggle>
                <BulkButton tone="primary" onClick={() => saveCategory(category)}>Kaydet</BulkButton>
                <p className="text-xs text-white/42 xl:col-span-5 xl:col-start-2">Orijinal: {category.providerCategoryName ?? "-"} · {category.serviceCount} servis</p>
              </div>
            ))}
            {!categoryRows.length ? <EmptyAdminState text="Henüz kategori yok. Entegrasyonlar ekranından servisleri çekin." /> : null}
          </div>
        </section>
      ) : null}

      {activeTab === "services" ? (
        <section className="sf-card overflow-visible p-5">
          <SectionHead
            title="Servis Yönetimi"
            text="Orijinal sağlayıcı servisleri, service_id, maliyet ve toplu görünürlük/fiyat işlemleri."
            count={`${selectedServiceCount} seçili`}
          >
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Servis ara..." className="min-h-10 rounded-[12px] border border-white/10 bg-black/20 px-3 text-sm outline-none focus:border-[color:var(--sf-primary)]" />
            <label className="inline-flex min-h-10 items-center gap-2 rounded-[12px] border border-white/10 bg-white/6 px-3 text-sm font-black">
              <input type="checkbox" checked={filteredServices.length > 0 && selectedServices.length === filteredServices.length} onChange={(event) => toggleAllServices(event.target.checked)} className="accent-[color:var(--sf-primary)]" />
              Tümünü seç
            </label>
            <BulkButton tone="orange" onClick={() => bulkVisibility("service", selectedServices, true)}>Göster</BulkButton>
            <BulkButton onClick={() => bulkVisibility("service", selectedServices, false)}>Gizle</BulkButton>
          </SectionHead>

          <div className="mb-4 grid gap-2 rounded-[14px] border border-orange-300/16 bg-orange-500/8 p-3 lg:grid-cols-[1fr_auto_auto_auto] lg:items-center">
            <p className="text-sm text-white/62">Seçili servis fiyatlarını orijinal sağlayıcı fiyatıyla eşitleyin veya toplu yüzde artış/azalış uygulayın.</p>
            <input value={bulkPercent} onChange={(event) => setBulkPercent(event.target.value)} type="number" min={0} className="min-h-10 rounded-[12px] border border-white/10 bg-black/25 px-3 text-sm outline-none focus:border-[color:var(--sf-primary)]" placeholder="%" />
            <BulkButton tone="primary" onClick={() => bulkPricing("increase_percent")}>% artır</BulkButton>
            <BulkButton onClick={() => bulkPricing("decrease_percent")}>% azalt</BulkButton>
            <BulkButton tone="orange" onClick={() => bulkPricing("match_original")}>Orijinale eşitle</BulkButton>
          </div>

          <div className="grid gap-3">
            {filteredServices.map((service) => (
              <div key={service.id} className="rounded-[14px] border border-white/10 bg-white/[0.035] p-4">
                <div className="grid gap-3 xl:grid-cols-[28px_1.1fr_1fr_130px_130px_110px_110px] xl:items-center">
                  <input type="checkbox" checked={selectedServices.includes(service.id)} onChange={(event) => setSelectedServices((ids) => event.target.checked ? [...ids, service.id] : ids.filter((id) => id !== service.id))} className="h-5 w-5 accent-[color:var(--sf-primary)]" />
                  <div>
                    <p className="font-black">{service.providerServiceName ?? service.sosyofoxServiceName}</p>
                    <p className="mt-1 text-xs text-white/42">ID: {service.providerServiceId ?? "-"} · {service.providerCategoryName ?? "-"}</p>
                  </div>
                  <InlineInput value={service.sosyofoxServiceName} onChange={(value) => updateService(service.id, { sosyofoxServiceName: value })} />
                  <PriceInput label="Orijinal" value={service.originalRate} readOnly />
                  <PriceInput label="Satış" value={service.finalPrice} onChange={(value) => updateService(service.id, { finalPrice: value })} />
                  <PriceInput label="% kâr/azalt" value={service.profitValue} onChange={(value) => updateService(service.id, { profitValue: value })} />
                  <BulkButton tone="primary" onClick={() => saveService(service)}>Kaydet</BulkButton>
                </div>
                <div className="mt-3 grid gap-2 text-xs text-white/46 sm:grid-cols-4">
                  <p>Min/Max: <strong className="text-white/70">{service.min} / {service.max}</strong></p>
                  <p>Durum: <strong className={service.isVisible ? "text-emerald-200" : "text-white/50"}>{service.isVisible ? "Yayında" : "Gizli"}</strong></p>
                  <button type="button" onClick={() => updateService(service.id, { finalPrice: service.originalRate, profitValue: "0" })} className="text-left font-black text-[color:var(--sf-primary-soft)]">Tek fiyatı orijinale eşitle</button>
                  <Toggle checked={service.isVisible} onChange={(checked) => updateService(service.id, { isVisible: checked })}>Yayında</Toggle>
                </div>
              </div>
            ))}
            {!filteredServices.length ? <EmptyAdminState text="Servis bulunamadı. Senkronizasyon sonrası kayıtlar burada düzenlenebilir." /> : null}
          </div>
        </section>
      ) : null}

      {activeTab === "storefront" ? (
        <section className="sf-card overflow-visible p-5">
          <SectionHead
            title="Hizmet Vitrini"
            text="Kullanıcıya görünen başlık, açıklama, ikon, öne çıkan durumu ve indirimli fiyat düzeni."
            count={`${serviceRows.length} hizmet`}
          >
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Hizmet ara..." className="min-h-10 rounded-[12px] border border-white/10 bg-black/20 px-3 text-sm outline-none focus:border-[color:var(--sf-primary)]" />
          </SectionHead>
          <div className="grid gap-3">
            {filteredServices.map((service) => (
              <div key={service.id} className="rounded-[14px] border border-white/10 bg-white/[0.035] p-4">
                <div className="grid gap-3 lg:grid-cols-[1fr_1fr_90px_130px_auto] lg:items-center">
                  <InlineInput value={service.sosyofoxServiceName} onChange={(value) => updateService(service.id, { sosyofoxServiceName: value })} />
                  <InlineInput value={service.sosyofoxCategoryName ?? ""} placeholder="Sosyofox kategori" onChange={(value) => updateService(service.id, { sosyofoxCategoryName: value })} />
                  <InlineInput value={service.icon} onChange={(value) => updateService(service.id, { icon: value })} />
                  <Toggle checked={service.isFeatured} onChange={(checked) => updateService(service.id, { isFeatured: checked })}>Öne çıkan</Toggle>
                  <BulkButton tone="primary" onClick={() => saveService(service)}>Kaydet</BulkButton>
                </div>
                <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_320px] lg:items-start">
                  <textarea
                    value={service.customDescription ?? service.description ?? ""}
                    onChange={(event) => updateService(service.id, { customDescription: event.target.value })}
                    placeholder="Servis açıklaması"
                    className="min-h-32 rounded-[12px] border border-white/10 bg-black/18 p-3 text-sm leading-6 outline-none focus:border-[color:var(--sf-primary)]"
                  />
                  <div className="rounded-[12px] border border-white/8 bg-black/18 p-3 text-xs leading-5 text-white/50">
                    <p><strong className="text-white/70">Orijinal açıklama:</strong></p>
                    <p className="mt-1 line-clamp-5">{service.description || "Sağlayıcı açıklaması yok."}</p>
                    <div className="mt-3 grid gap-2">
                      <button type="button" onClick={() => updateService(service.id, { customDescription: service.description ?? "" })} className="rounded-[10px] border border-white/10 bg-white/7 px-3 py-2 text-left font-black text-white">Orijinal açıklamayı kullan</button>
                      <button type="button" onClick={() => rewriteDescription(service)} className="rounded-[10px] bg-[linear-gradient(135deg,#ff9a2e,#ff7a1a,#b3261e)] px-3 py-2 text-left font-black text-white">AI ile özgünleştir</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function SectionHead({ title, text, count, children }: { title: string; text: string; count: string; children?: React.ReactNode }) {
  return (
    <div className="mb-4 flex flex-col justify-between gap-3 lg:flex-row lg:items-end">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-xl font-black">{title}</h2>
          <span className="rounded-full border border-orange-300/20 bg-orange-400/10 px-3 py-1 text-xs font-black text-[color:var(--sf-primary-soft)]">{count}</span>
        </div>
        <p className="mt-1 text-sm text-[color:var(--sf-muted)]">{text}</p>
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function InlineInput({ value, onChange, placeholder, type = "text" }: { value: string; onChange: (value: string) => void; placeholder?: string; type?: string }) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      className="min-h-10 min-w-0 rounded-[12px] border border-white/10 bg-black/18 px-3 text-sm outline-none transition focus:border-[color:var(--sf-primary)]"
    />
  );
}

function PriceInput({ label, value, onChange, readOnly = false }: { label: string; value: string; onChange?: (value: string) => void; readOnly?: boolean }) {
  return (
    <label className="grid gap-1">
      <span className="text-[11px] font-black uppercase tracking-[0.12em] text-white/42">{label}</span>
      <input
        type="number"
        value={value}
        readOnly={readOnly}
        onChange={(event) => onChange?.(event.target.value)}
        className="min-h-10 min-w-0 rounded-[12px] border border-white/10 bg-black/18 px-3 text-sm outline-none transition focus:border-[color:var(--sf-primary)] read-only:text-white/45"
      />
      <span className="text-[11px] text-white/40">{formatMoney(value || 0)}</span>
    </label>
  );
}

function Toggle({ checked, onChange, children }: { checked: boolean; onChange: (checked: boolean) => void; children: React.ReactNode }) {
  return (
    <label className="inline-flex items-center gap-2 text-sm font-bold text-white/70">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="accent-[color:var(--sf-primary)]" />
      {children}
    </label>
  );
}

function BulkButton({ children, onClick, tone }: { children: React.ReactNode; onClick: () => void; tone?: "primary" | "orange" }) {
  const classes = tone === "primary"
    ? "bg-[color:var(--sf-primary)] text-white"
    : tone === "orange"
      ? "bg-orange-300 text-[#1b0d04]"
      : "border border-white/10 bg-white/8 text-white";
  return (
    <button type="button" onClick={onClick} className={`min-h-10 rounded-[12px] px-3 text-sm font-black ${classes}`}>
      {children}
    </button>
  );
}

function EmptyAdminState({ text }: { text: string }) {
  return (
    <div className="grid min-h-40 place-items-center rounded-[14px] border border-white/10 bg-white/[0.03] p-6 text-center">
      <div>
        <MdIcon name="deployed_code" className="text-4xl text-[color:var(--sf-primary-soft)]" />
        <p className="mt-2 text-sm text-[color:var(--sf-muted)]">{text}</p>
      </div>
    </div>
  );
}
