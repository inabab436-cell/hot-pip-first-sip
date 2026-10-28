import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowUpLeft, ArrowLeft, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import heroPair from "@/assets/hotpip-hero-pair-v4.jpg";
import logoAsset from "@/assets/hotpip-logo.png";


export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Hot pip | أناناس ساخن، مشروب الشتاء القادم" },
    { name: "description", content: "Hot pip، أناناس ساخن ومشروب الشتاء القادم. سجّل اهتمامك ومدينتك والسعر المتوقع." },
    { property: "og:title", content: "Hot pip | أناناس ساخن، مشروب الشتاء القادم" },
    { property: "og:description", content: "تجربة شتوية بطعم استوائي. كن من أوائل المهتمين بمشروب Hot pip." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});

const CITIES = ["القاهرة", "الجيزة", "الإسكندرية", "المنصورة", "طنطا", "الزقازيق", "أسيوط", "الأقصر", "أسوان", "بورسعيد", "الإسماعيلية", "السويس", "الغردقة"];
const schema = z.object({
  email: z.string().trim().email("بريد إلكتروني غير صحيح").max(255),
  city: z.string().trim().min(2, "اختر مدينتك").max(100),
  expected_price: z.string().trim().min(1, "اكتب السعر المتوقع").max(50),
});

function Index() {
  const [form, setForm] = useState({ email: "", city: "", expected_price: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [count, setCount] = useState<number | null>(null);
  const [shareUrl, setShareUrl] = useState("");
  useEffect(() => {
    setShareUrl(encodeURIComponent(window.location.origin));
    supabase.rpc("waitlist_count").then(({ data }) => typeof data === "number" && setCount(data));
  }, []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) { toast.error(parsed.error.issues[0]?.message ?? "تحقق من البيانات"); return; }
    setLoading(true);
    try {
      const { error } = await supabase.from("waitlist_signups").insert(parsed.data);
      if (error) { toast.error("حصلت مشكلة، حاول مرة أخرى"); return; }
      setDone(true);
      setCount((c) => (c ?? 0) + 1);
    } catch { toast.error("حصلت مشكلة، حاول مرة أخرى"); }
    finally { setLoading(false); }
  }
  const shareText = encodeURIComponent("اكتشفت Hot pip — مشروب أناناس ساخن! سجّل اهتمامك معايا: ");

  return (
    <main className="min-h-screen bg-background font-sans text-foreground">
      <header className="simple-header page-width">
        <a href="#" aria-label="Hot pip الرئيسية" className="brand-link">
          <img src={logoAsset} alt="" width={44} height={36} className="brand-logo" />
          <span className="wordmark" dir="ltr">Hot pip</span>
        </a>

        <span className="text-xs text-muted-foreground">قريبًا</span>
      </header>

      <section className="simple-intro page-width">
        <div className="simple-copy">
          <h1>أناناس ساخن</h1>
          <p>مشروب الشتاء القادم</p>
        </div>
        <img src={heroPair} alt="زجاجة Hot pip بجانب كوب دافئ من مشروب الأناناس وقطعة أناناس مقطعة" width={1536} height={768} fetchPriority="high" className="hero-pair" />
      </section>

      <section id="join" className="simple-join page-width">
          <div className="waitlist-panel">
            {done ? <div className="py-8 text-center" aria-live="polite">
              <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-secondary"><Check className="size-8 text-primary" /></span>
              <h3 className="mt-6 text-3xl font-bold">أنت من الأوائل!</h3>
              <p className="mt-4 text-sm text-muted-foreground">هنبلغك عند الإطلاق في {form.city}.</p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Button asChild className="h-11"><a target="_blank" rel="noreferrer" href={`https://wa.me/?text=${shareText}${shareUrl}%3Futm_source%3Dwhatsapp%26utm_medium%3Dsocial`}>شارك على واتساب <ArrowUpLeft /></a></Button>
                <Button asChild variant="outline" className="h-11"><a target="_blank" rel="noreferrer" href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}%3Futm_source%3Dfacebook%26utm_medium%3Dsocial`}>فيسبوك</a></Button>
              </div>
            </div> : <form onSubmit={submit} className="space-y-5">
              <div className="join-heading"><h2>سجّل اهتمامك</h2>{count !== null && count > 0 && <span className="text-xs text-muted-foreground">{count} مهتم</span>}</div>
              <div className="signup-fields">
              <Field label="البريد الإلكتروني" id="email"><Input id="email" type="email" dir="ltr" autoComplete="email" placeholder="you@example.com" className="form-input text-right" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
              <Field label="المدينة" id="city"><Input id="city" list="cities" autoComplete="address-level2" placeholder="اختر أو اكتب مدينتك" className="form-input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /><datalist id="cities">{CITIES.map(c => <option key={c} value={c} />)}</datalist></Field>
              <Field label="السعر المتوقع للزجاجة" id="price"><Input id="price" inputMode="decimal" placeholder="اكتب السعر المتوقع بالجنيه" className="form-input" value={form.expected_price} onChange={(e) => setForm({ ...form, expected_price: e.target.value })} /></Field>
              </div>
              <Button type="submit" disabled={loading} className="h-13 w-full gap-5 text-base">{loading ? "جاري التسجيل..." : "سجّلني في القائمة"}{!loading && <ArrowLeft />}</Button>
              <p className="text-center text-xs text-muted-foreground">بدون شراء أو التزام</p>
            </form>}
          </div>
      </section>
      <footer className="simple-footer text-xs text-muted-foreground" dir="ltr">© {new Date().getFullYear()} Hot pip</footer>
    </main>
  );
}
function Field({ label, id, children }: { label: string; id: string; children: ReactNode }) {
  return <div><label htmlFor={id} className="mb-2 block text-sm font-semibold">{label}</label>{children}</div>;
}
