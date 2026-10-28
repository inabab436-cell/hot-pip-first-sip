import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import bottle from "@/assets/hotpip-bottle.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hot pip | مشروب الأناناس الساخن — قريباً" },
      { name: "description", content: "Hot pip أول مشروب أناناس ساخن. سجّل اهتمامك الآن وكن من أوائل من يجربه في مدينتك." },
      { property: "og:title", content: "Hot pip | مشروب الأناناس الساخن — قريباً" },
      { property: "og:description", content: "سجّل اهتمامك وكن من أوائل من يجرب Hot pip في مدينتك." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const CITIES = ["القاهرة", "الجيزة", "الإسكندرية", "المنصورة", "طنطا", "الزقازيق", "أسيوط", "الأقصر", "أسوان", "بورسعيد", "الإسماعيلية", "السويس", "الغردقة"];
const PRICES = ["أقل من 30 جنيه", "30 – 45 جنيه", "45 – 60 جنيه", "أكثر من 60 جنيه"];

const schema = z.object({
  name: z.string().trim().min(2, "اكتب اسمك").max(100),
  email: z.string().trim().email("بريد إلكتروني غير صحيح").max(255),
  city: z.string().trim().min(2, "اختر مدينتك").max(100),
  expected_price: z.string().min(1, "اختر السعر المتوقع"),
});

function Index() {
  const [form, setForm] = useState({ name: "", email: "", city: "", expected_price: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    supabase.rpc("waitlist_count").then(({ data }) => typeof data === "number" && setCount(data));
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    setLoading(true);
    const { error } = await supabase.from("waitlist_signups").insert(parsed.data);
    setLoading(false);
    if (error) return toast.error("حصلت مشكلة، حاول مرة أخرى");
    setDone(true);
    setCount((c) => (c ?? 0) + 1);
  }

  const shareText = encodeURIComponent("اكتشفت Hot pip — أول مشروب أناناس ساخن! سجّل اهتمامك معايا: ");
  const shareUrl = typeof window !== "undefined" ? encodeURIComponent(window.location.origin) : "";

  return (
    <main className="min-h-screen overflow-hidden bg-background font-sans text-foreground">
      {/* Hero */}
      <section className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 pt-10 md:grid-cols-2 md:pt-20">
        <div className="relative z-10 text-center md:text-start">
          <span className="inline-block rounded-full border border-primary/40 px-4 py-1 text-sm text-primary">قريباً في الأسواق</span>
          <h1 className="mt-5 font-display text-6xl font-black leading-none text-primary md:text-8xl" dir="ltr">Hot pip</h1>
          <p className="mt-4 text-2xl font-bold md:text-3xl">مشروب الأناناس الساخن</p>
          <p className="mt-4 max-w-md text-lg text-muted-foreground md:mx-0 mx-auto">
            دفء الشتاء بطعم استوائي. أناناس حقيقي، يتشرب سخن، ويغيّر فكرتك عن العصير.
          </p>
          {count !== null && count > 0 && (
            <p className="mt-6 text-primary"><b className="text-2xl">{count}</b> شخص سجّلوا اهتمامهم حتى الآن</p>
          )}
          <a href="#join" className="mt-6 inline-block rounded-full bg-primary px-8 py-4 text-lg font-bold text-primary-foreground shadow-gold transition hover:scale-105">
            سجّل اهتمامك
          </a>
        </div>
        <div className="relative flex justify-center">
          <div className="absolute inset-0 bg-glow" />
          <img src={bottle.url} alt="زجاجة Hot pip مشروب الأناناس الساخن" className="relative w-72 animate-floaty md:w-96" />
        </div>
      </section>

      {/* Why */}
      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["🍍", "أناناس حقيقي", "مصنوع من فاكهة طبيعية بدون نكهات صناعية."],
            ["♨️", "يتشرب سخن", "بديل جديد للشاي والقهوة في الأيام الباردة."],
            ["✨", "تجربة مختلفة", "طعم استوائي دافئ لم تجربه من قبل."],
          ].map(([icon, t, d]) => (
            <div key={t} className="rounded-2xl border border-border bg-card p-6">
              <div className="text-4xl">{icon}</div>
              <h3 className="mt-3 text-xl font-bold text-primary">{t}</h3>
              <p className="mt-2 text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Form */}
      <section id="join" className="mx-auto max-w-xl px-5 py-16">
        <div className="rounded-3xl border border-primary/30 bg-card p-6 shadow-gold md:p-10">
          {done ? (
            <div className="text-center">
              <div className="text-6xl">🎉</div>
              <h2 className="mt-4 text-3xl font-black text-primary">أنت من الأوائل!</h2>
              <p className="mt-3 text-muted-foreground">هنبلغك أول ما Hot pip يوصل {form.city}. شارك الخبر مع أصحابك:</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <a className="rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground" target="_blank" rel="noreferrer"
                  href={`https://wa.me/?text=${shareText}${shareUrl}%3Futm_source%3Dwhatsapp%26utm_medium%3Dsocial`}>واتساب</a>
                <a className="rounded-full border border-primary px-6 py-3 font-bold text-primary" target="_blank" rel="noreferrer"
                  href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}%3Futm_source%3Dfacebook%26utm_medium%3Dsocial`}>فيسبوك</a>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              <div className="text-center">
                <h2 className="text-3xl font-black text-primary">كن أول من يجربه</h2>
                <p className="mt-2 text-muted-foreground">سجّل وهنبلغك أول ما ينزل في مدينتك</p>
              </div>
              <Field label="الاسم">
                <input className="input-hp w-full rounded-xl border border-input bg-muted px-4 py-3 outline-none focus:border-ring" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </Field>
              <Field label="البريد الإلكتروني">
                <input type="email" dir="ltr" className="w-full rounded-xl border border-input bg-muted px-4 py-3 text-right outline-none focus:border-ring" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </Field>
              <Field label="المدينة">
                <input list="cities" placeholder="اختر أو اكتب مدينتك" className="w-full rounded-xl border border-input bg-muted px-4 py-3 outline-none focus:border-ring" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                <datalist id="cities">{CITIES.map((c) => <option key={c} value={c} />)}</datalist>
              </Field>
              <Field label="كم تتوقع سعر الزجاجة؟">
                <div className="grid grid-cols-2 gap-2">
                  {PRICES.map((p) => (
                    <button type="button" key={p} onClick={() => setForm({ ...form, expected_price: p })}
                      className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${form.expected_price === p ? "border-primary bg-primary text-primary-foreground" : "border-input bg-muted hover:border-primary"}`}>
                      {p}
                    </button>
                  ))}
                </div>
              </Field>
              <button disabled={loading} className="w-full rounded-full bg-primary py-4 text-lg font-bold text-primary-foreground transition hover:scale-[1.02] disabled:opacity-60">
                {loading ? "جاري التسجيل..." : "سجّلني"}
              </button>
            </form>
          )}
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Hot pip — مشروب الأناناس الساخن
      </footer>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block font-semibold">{label}</span>
      {children}
    </label>
  );
}
