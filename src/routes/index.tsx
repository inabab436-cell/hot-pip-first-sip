import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import bottle from "@/assets/hotpip-bottle.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hot pip | أناناس ساخن — مشروب الشتاء القادم" },
      { name: "description", content: "Hot pip مشروب الأناناس الساخن، مشروب الشتاء القادم. سجّل اهتمامك وكن من أوائل من يجربه في مدينتك." },
      { property: "og:title", content: "Hot pip | أناناس ساخن — مشروب الشتاء القادم" },
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
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "تحقق من البيانات");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("waitlist_signups").insert(parsed.data);
    setLoading(false);
    if (error) {
      toast.error("حصلت مشكلة، حاول مرة أخرى");
      return;
    }
    setDone(true);
    setCount((c) => (c ?? 0) + 1);
  }

  const shareText = encodeURIComponent("اكتشفت Hot pip — أول مشروب أناناس ساخن! سجّل اهتمامك معايا: ");
  const shareUrl = typeof window !== "undefined" ? encodeURIComponent(window.location.origin) : "";

  return (
    <main className="min-h-screen bg-background font-sans text-foreground">
      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-16 pt-12 md:grid-cols-2 md:pt-20">
        <div className="text-center md:text-start">
          <p className="font-display text-lg font-bold tracking-wide text-muted-foreground" dir="ltr">Hot pip</p>
          <h1 className="mt-3 font-display text-5xl font-black leading-tight text-foreground md:text-7xl">
            أناناس ساخن
          </h1>
          <p className="mt-4 text-2xl font-bold text-primary md:text-3xl">مشروب الشتاء القادم</p>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-muted-foreground md:mx-0 mx-auto">
            دفء الشتاء بطعم استوائي. أناناس حقيقي، يتشرب سخن، ويغيّر فكرتك عن العصير.
          </p>
          {count !== null && count > 0 && (
            <p className="mt-6 text-lg text-muted-foreground">
              <b className="text-primary">{count}</b> شخص سجّلوا اهتمامهم حتى الآن
            </p>
          )}
          <a href="#join" className="mt-8 inline-block rounded-full bg-primary px-10 py-4 text-lg font-bold text-primary-foreground shadow-gold transition hover:bg-primary/90">
            سجّل اهتمامك
          </a>
        </div>
        <div className="relative flex justify-center">
          <div className="absolute inset-4 bg-glow" />
          <img src={bottle.url} alt="زجاجة Hot pip مشروب الأناناس الساخن" className="relative w-64 rounded-[2.5rem] animate-floaty md:w-80" />
        </div>
      </section>

      {/* Why */}
      <section className="mx-auto max-w-6xl px-6 pb-6">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            ["🍍", "أناناس حقيقي", "مصنوع من فاكهة طبيعية بدون نكهات صناعية."],
            ["♨️", "يتشرب سخن", "بديل جديد للشاي والقهوة في الأيام الباردة."],
            ["✨", "تجربة مختلفة", "طعم استوائي دافئ لم تجربه من قبل."],
          ].map(([icon, t, d]) => (
            <div key={t} className="rounded-3xl border border-border bg-card p-7">
              <div className="text-3xl">{icon}</div>
              <h3 className="mt-3 text-xl font-bold">{t}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Form */}
      <section id="join" className="mx-auto max-w-xl px-6 py-14">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-gold md:p-10">
          {done ? (
            <div className="text-center">
              <div className="text-6xl">🎉</div>
              <h2 className="mt-4 text-3xl font-black">أنت من الأوائل!</h2>
              <p className="mt-3 text-muted-foreground">هنبلغك أول ما Hot pip يوصل {form.city}. شارك الخبر مع أصحابك:</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <a className="rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground" target="_blank" rel="noreferrer"
                  href={`https://wa.me/?text=${shareText}${shareUrl}%3Futm_source%3Dwhatsapp%26utm_medium%3Dsocial`}>واتساب</a>
                <a className="rounded-full border border-input px-6 py-3 font-bold" target="_blank" rel="noreferrer"
                  href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}%3Futm_source%3Dfacebook%26utm_medium%3Dsocial`}>فيسبوك</a>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              <div className="text-center">
                <h2 className="text-3xl font-black">كن أول من يجربه</h2>
                <p className="mt-2 text-muted-foreground">سجّل وهنبلغك أول ما ينزل في مدينتك</p>
              </div>
              <Field label="الاسم">
                <input className="w-full rounded-xl border border-input bg-muted px-4 py-3 outline-none focus:border-ring" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
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
                      className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${form.expected_price === p ? "border-primary bg-primary text-primary-foreground" : "border-input bg-muted hover:border-ring"}`}>
                      {p}
                    </button>
                  ))}
                </div>
              </Field>
              <button disabled={loading} className="w-full rounded-full bg-primary py-4 text-lg font-bold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60">
                {loading ? "جاري التسجيل..." : "سجّلني"}
              </button>
            </form>
          )}
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Hot pip — أناناس ساخن، مشروب الشتاء القادم
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
