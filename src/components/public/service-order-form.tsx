"use client";

import { useMemo, useState } from "react";
import { MdIcon } from "@/components/md3/icon";
import { formatMoney } from "@/lib/utils";

type ServiceOrderFormProps = {
  serviceId: string;
  serviceName: string;
  categoryName: string;
  icon: string;
  providerType: string;
  min: number;
  max: number;
  unitPrice: string;
  originalRate: string;
  description: string;
  warningText?: string | null;
  dripfeed?: boolean;
  refill?: boolean;
  cancel?: boolean;
};

function serviceFields(providerType: string) {
  const value = providerType.toLocaleLowerCase("tr");
  return {
    packageMode: value.includes("package") || value.includes("paket"),
    comments: value.includes("comment") || value.includes("yorum"),
    usernames: value.includes("mention") || value.includes("custom list") || value.includes("kullanıcı listesi"),
    username: value.includes("user followers") || value.includes("followers"),
    mediaUrl: value.includes("media likers") || value.includes("media"),
    poll: value.includes("poll") || value.includes("anket"),
    seo: value.includes("seo")
  };
}

const TURKISH_CITIES = [
  "Adana",
  "Adıyaman",
  "Afyonkarahisar",
  "Ağrı",
  "Amasya",
  "Ankara",
  "Antalya",
  "Artvin",
  "Aydın",
  "Balıkesir",
  "Bilecik",
  "Bingöl",
  "Bitlis",
  "Bolu",
  "Burdur",
  "Bursa",
  "Çanakkale",
  "Çankırı",
  "Çorum",
  "Denizli",
  "Diyarbakır",
  "Edirne",
  "Elazığ",
  "Erzincan",
  "Erzurum",
  "Eskişehir",
  "Gaziantep",
  "Giresun",
  "Gümüşhane",
  "Hakkari",
  "Hatay",
  "Isparta",
  "Mersin",
  "İstanbul",
  "İzmir",
  "Kars",
  "Kastamonu",
  "Kayseri",
  "Kırklareli",
  "Kırşehir",
  "Kocaeli",
  "Konya",
  "Kütahya",
  "Malatya",
  "Manisa",
  "Kahramanmaraş",
  "Mardin",
  "Muğla",
  "Muş",
  "Nevşehir",
  "Niğde",
  "Ordu",
  "Rize",
  "Sakarya",
  "Samsun",
  "Siirt",
  "Sinop",
  "Sivas",
  "Tekirdağ",
  "Tokat",
  "Trabzon",
  "Tunceli",
  "Şanlıurfa",
  "Uşak",
  "Van",
  "Yozgat",
  "Zonguldak",
  "Aksaray",
  "Bayburt",
  "Karaman",
  "Kırıkkale",
  "Batman",
  "Şırnak",
  "Bartın",
  "Ardahan",
  "Iğdır",
  "Yalova",
  "Karabük",
  "Kilis",
  "Osmaniye",
  "Düzce"
];

export function ServiceOrderForm({
  serviceId,
  serviceName,
  categoryName,
  icon,
  providerType,
  min,
  max,
  unitPrice,
  originalRate,
  description,
  warningText,
  dripfeed,
  refill
}: ServiceOrderFormProps) {
  const fields = useMemo(() => serviceFields(providerType), [providerType]);
  const [targetUrl, setTargetUrl] = useState("");
  const [quantity, setQuantity] = useState(fields.packageMode ? 1 : min);
  const [gender, setGender] = useState("all");
  const [comments, setComments] = useState("");
  const [usernames, setUsernames] = useState("");
  const [username, setUsername] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [answerNumber, setAnswerNumber] = useState("");
  const [perDayEnabled, setPerDayEnabled] = useState(false);
  const [specialCommentEnabled, setSpecialCommentEnabled] = useState(fields.comments);
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [perDay, setPerDay] = useState("");
  const [include, setInclude] = useState("");
  const [exclude, setExclude] = useState("");
  const [moderatorNote, setModeratorNote] = useState("");
  const [allCities, setAllCities] = useState(true);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [cityQuery, setCityQuery] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const numericUnit = Number(unitPrice);
  const numericOriginal = Number(originalRate);
  const total = Number((numericUnit * (fields.packageMode ? 1 : quantity || 0)).toFixed(2));
  const oldTotal = numericOriginal > numericUnit ? Number((numericOriginal * (fields.packageMode ? 1 : quantity || 0)).toFixed(2)) : null;
  const filteredCities = useMemo(() => {
    const query = cityQuery.trim().toLocaleLowerCase("tr");
    if (!query) return TURKISH_CITIES;
    return TURKISH_CITIES.filter((city) => city.toLocaleLowerCase("tr").includes(query));
  }, [cityQuery]);

  function toggleCity(city: string, checked: boolean) {
    setAllCities(false);
    setSelectedCities((cities) => checked ? [...new Set([...cities, city])] : cities.filter((item) => item !== city));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accepted) {
      setMessage("Siparişi tamamlamak için sözleşme onayını işaretleyin.");
      return;
    }
    setSubmitting(true);
    setMessage("");

    const response = await fetch("/api/user/orders", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        serviceId,
        targetUrl,
        quantity: fields.packageMode ? 1 : quantity,
        gender,
        comments: specialCommentEnabled ? comments || undefined : undefined,
        usernames: usernames || undefined,
        username: username || undefined,
        mediaUrl: mediaUrl || undefined,
        answerNumber: answerNumber || undefined,
        perDay: perDayEnabled ? perDay : undefined,
        include: include || undefined,
        exclude: exclude || undefined,
        notificationEnabled,
        moderatorNote: moderatorNote || undefined,
        cities: allCities ? [] : selectedCities
      })
    });

    setSubmitting(false);
    if (response.redirected || response.status === 401) {
      window.location.assign("/login");
      return;
    }
    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setMessage(data?.error ?? "Sipariş oluşturulamadı. Bakiye ve alanları kontrol edin.");
      return;
    }
    window.location.assign("/panel/siparisler");
  }

  return (
    <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1fr_390px]">
      <section className="grid gap-5">
        <div className="relative overflow-hidden rounded-[16px] border border-orange-300/18 bg-[linear-gradient(135deg,rgba(255,122,26,0.13),rgba(255,255,255,0.04)_42%,rgba(18,23,32,0.9))] p-5 sm:p-6">
          <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-orange-400/20 blur-3xl" />
          <div className="relative flex items-start gap-4">
            <span className="grid h-14 w-14 place-items-center rounded-[14px] border border-orange-300/18 bg-orange-500/12 text-[color:var(--sf-primary-soft)]">
              <MdIcon name={icon} className="text-3xl" />
            </span>
            <div>
              <h1 className="text-2xl font-black sm:text-4xl">{serviceName}</h1>
              <p className="mt-2 text-sm text-[color:var(--sf-muted)]">{categoryName} · {providerType}</p>
            </div>
          </div>
        </div>

        <div className="rounded-[14px] border-l-4 border-emerald-300 bg-white/[0.045] p-4 text-sm leading-7 text-white/72">
          {description}
        </div>

        <div className="sf-card grid gap-4 p-5">
          <Field label="Görev Linki">
            <input value={targetUrl} onChange={(event) => setTargetUrl(event.target.value)} required type="url" placeholder="https://..." className="sf-input" />
          </Field>

          <div className="grid gap-4 md:grid-cols-2">
            {!fields.packageMode ? (
              <Field label="İstediğiniz Adet">
                <input value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} required type="number" min={min} max={max} placeholder={`${min} - ${max}`} className="sf-input" />
              </Field>
            ) : null}
            <Field label="Cinsiyet Filtresi">
              <select value={gender} onChange={(event) => setGender(event.target.value)} className="sf-input">
                <option value="all">Tümü</option>
                <option value="male">Erkek</option>
                <option value="female">Kadın</option>
              </select>
            </Field>
          </div>

          {refill ? (
            <div className="grid gap-3 rounded-[14px] border border-white/10 bg-white/[0.035] p-4 sm:grid-cols-[52px_1fr_auto] sm:items-center">
              <span className="grid h-12 w-12 place-items-center rounded-[12px] bg-orange-500/12 text-[color:var(--sf-primary-soft)]">
                <MdIcon name="verified" />
              </span>
              <span>
                <span className="block font-black">Garanti Seçeneği</span>
                <span className="mt-1 block text-sm leading-6 text-white/55">Düşüş olması durumunda telafi desteklidir. Sağlayıcı refill desteği aktiftir.</span>
              </span>
              <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-sm font-black text-emerald-200">Önerilen</span>
            </div>
          ) : null}

          {fields.usernames ? (
            <Field label="Kullanıcı Listesi">
              <textarea value={usernames} onChange={(event) => setUsernames(event.target.value)} placeholder="Her satıra bir kullanıcı adı yazın" className="sf-input min-h-32 py-3" />
            </Field>
          ) : null}

          {fields.username ? (
            <Field label="Kullanıcı Adı">
              <input value={username} onChange={(event) => setUsername(event.target.value)} placeholder="@kullanici" className="sf-input" />
            </Field>
          ) : null}

          {fields.mediaUrl ? (
            <Field label="Medya URL">
              <input value={mediaUrl} onChange={(event) => setMediaUrl(event.target.value)} type="url" placeholder="https://..." className="sf-input" />
            </Field>
          ) : null}

          {fields.poll ? (
            <Field label="Anket Cevap Numarası">
              <input value={answerNumber} onChange={(event) => setAnswerNumber(event.target.value)} type="number" min={1} placeholder="1" className="sf-input" />
            </Field>
          ) : null}

          <div className="grid gap-3">
            <Toggle checked={perDayEnabled} onChange={setPerDayEnabled}>Günlere Böl</Toggle>
            {perDayEnabled ? (
              <div className="grid gap-2">
                <Field label="Günlük Adet">
                  <input value={perDay} onChange={(event) => setPerDay(event.target.value)} type="number" min={1} className="sf-input" />
                </Field>
                {!dripfeed ? <p className="text-xs leading-5 text-white/42">Bu seçenek seçildiğinde siparişe günlere böl parametresi olarak eklenir.</p> : null}
              </div>
            ) : null}
            <Toggle checked={specialCommentEnabled} onChange={setSpecialCommentEnabled}>Özel Yorum</Toggle>
            {specialCommentEnabled ? (
              <Field label="Özel Yorumlar">
                <textarea value={comments} onChange={(event) => setComments(event.target.value)} placeholder="Her satıra bir yorum yazın" className="sf-input min-h-32 py-3" />
              </Field>
            ) : null}
            <Toggle checked={notificationEnabled} onChange={setNotificationEnabled}>Bildirim Gönder</Toggle>
          </div>

          <Field label="Moderatörlere Notunuz (Opsiyonel)">
            <textarea value={moderatorNote} onChange={(event) => setModeratorNote(event.target.value)} placeholder="Belirtmek istedikleriniz..." className="sf-input min-h-28 py-3" />
          </Field>

          <details className="rounded-[14px] border border-white/10 bg-white/[0.035] p-4">
            <summary className="cursor-pointer font-black text-white">
              <span className="inline-flex items-center gap-2"><MdIcon name="keyboard_arrow_up" /> Gelişmiş Ayarlar</span>
            </summary>
            <div className="mt-4 grid gap-4">
              <div className="grid gap-3">
                <span className="text-sm font-black text-white/82">Şehir Seçimi</span>
                <label className="inline-flex w-fit items-center gap-3 text-sm font-bold text-white/68">
                  <input
                    type="checkbox"
                    checked={allCities}
                    onChange={(event) => {
                      setAllCities(event.target.checked);
                      if (event.target.checked) setSelectedCities([]);
                    }}
                    className="h-5 w-5 rounded accent-[color:var(--sf-primary)]"
                  />
                  Tümü
                </label>
                <input value={cityQuery} onChange={(event) => setCityQuery(event.target.value)} placeholder="Şehir ara..." className="sf-input" />
                <div className="max-h-56 overflow-y-auto rounded-[14px] border border-white/10 bg-black/18 p-3">
                  <div className="grid gap-2 sm:grid-cols-2">
                    {filteredCities.map((city) => (
                      <label key={city} className={`inline-flex items-center gap-3 rounded-[10px] px-2 py-1.5 text-sm transition ${allCities ? "text-white/28" : "text-white/66 hover:bg-white/5"}`}>
                        <input
                          type="checkbox"
                          disabled={allCities}
                          checked={!allCities && selectedCities.includes(city)}
                          onChange={(event) => toggleCity(city, event.target.checked)}
                          className="h-4 w-4 rounded accent-[color:var(--sf-primary)]"
                        />
                        {city}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <Field label="Görev Dahil Et">
                <input value={include} onChange={(event) => setInclude(event.target.value)} placeholder="Sadece seçilen kullanıcı/görev koşulları" className="sf-input" />
              </Field>
              <Field label="Görev Hariç Bırak">
                <input value={exclude} onChange={(event) => setExclude(event.target.value)} placeholder="Bu koşulları hariç tut" className="sf-input" />
              </Field>
            </div>
          </details>
        </div>

        {warningText ? <div className="rounded-[14px] border-l-4 border-orange-300 bg-orange-300/10 p-4 text-sm leading-7 text-orange-100">{warningText}</div> : null}
      </section>

      <aside className="h-fit rounded-[16px] border border-white/10 bg-[#0b1017] shadow-[0_22px_70px_rgba(0,0,0,0.3)] lg:sticky lg:top-24">
        <div className="rounded-t-[16px] bg-[linear-gradient(135deg,#ff9a2e,#ff7a1a,#b3261e)] p-5">
          <h2 className="text-2xl font-black text-white">Sipariş Özeti</h2>
        </div>
        <div className="grid gap-4 p-5">
          <SummaryRow label="Adet fiyatı">
            {oldTotal ? <span className="mr-2 text-sm text-white/38 line-through">{formatMoney(numericOriginal)}</span> : null}
            <strong>{formatMoney(numericUnit)}</strong>
          </SummaryRow>
          <SummaryRow label="Alacağınız adet">{fields.packageMode ? "Paket" : quantity}</SummaryRow>
          <SummaryRow label="Cinsiyet filtresi">{gender === "all" ? "Tümü" : gender === "male" ? "Erkek" : "Kadın"}</SummaryRow>
          {refill ? <SummaryRow label="Garanti seçeneği">%0,00</SummaryRow> : null}
          <div className="rounded-[12px] border border-orange-300/16 bg-orange-500/10 p-4">
            <div className="flex items-end justify-between gap-3">
              <span className="font-black">Toplam Tutar</span>
              <span className="text-2xl font-black text-[color:var(--sf-primary-soft)]">
                {oldTotal ? <span className="mr-2 text-sm text-white/36 line-through">{formatMoney(oldTotal)}</span> : null}
                {formatMoney(total)}
              </span>
            </div>
          </div>
          <label className="grid grid-cols-[22px_1fr] gap-3 rounded-[12px] border border-white/10 bg-white/[0.035] p-4 text-sm leading-6 text-white/68">
            <input type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} className="mt-1 h-5 w-5 accent-[color:var(--sf-primary)]" />
            <span>Mesafeli Satış Sözleşmesi ve Kullanım Şartları’nı okudum, kabul ediyorum.</span>
          </label>
          {message ? <p className="rounded-[12px] border border-orange-300/20 bg-orange-400/10 p-3 text-sm text-orange-100">{message}</p> : null}
          <button disabled={submitting} className="inline-flex min-h-13 items-center justify-center gap-2 rounded-[14px] bg-[linear-gradient(135deg,#ff9a2e,#ff7a1a,#b3261e)] px-5 font-black text-white shadow-[0_18px_44px_rgba(255,122,26,0.24)] disabled:opacity-60">
            <MdIcon name="shopping_bag" /> {submitting ? "İşleniyor..." : "Siparişi Tamamla"}
          </button>
        </div>
      </aside>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 text-sm font-black text-white/82">
      <span>{label}</span>
      {children}
    </label>
  );
}

function Toggle({ checked, onChange, children }: { checked: boolean; onChange: (checked: boolean) => void; children: React.ReactNode }) {
  return (
    <label className="inline-flex items-center gap-3 text-sm font-bold text-white/62">
      <span className={`relative h-6 w-11 rounded-full transition ${checked ? "bg-[color:var(--sf-primary)]" : "bg-white/16"}`}>
        <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="sr-only" />
        <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${checked ? "left-6" : "left-1"}`} />
      </span>
      {children}
    </label>
  );
}

function SummaryRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-white/62">{label}</span>
      <span className="text-right text-white">{children}</span>
    </div>
  );
}
