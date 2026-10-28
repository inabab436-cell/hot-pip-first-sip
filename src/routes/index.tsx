import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowUpLeft, ArrowLeft, Check, Leaf, Flame, Sparkles, Mail, MapPin, ShieldCheck, Coffee } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import bottle from "@/assets/hotpip-bottle.png.asset.json";
import editorial from "@/assets/pineapple-editorial.jpg";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Hot pip | أناناس ساخن، مشروب الشتاء القادم" },
    { name: "description", content: "دفء جديد بطعم الأناناس. اكتشف Hot pip، مشروب الشتاء القادم، وسجّل اهتمامك ليصلك خبر إطلاقه في مدينتك." },
    { property: "og:title", content: "Hot pip | أناناس ساخن، مشروب الشتاء القادم" },
    { property: "og:description", content: "تجربة شتوية بطعم استوائي. كن من أوائل المهتمين بمشروب Hot pip." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
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
      <header className="site-header">
        <div className="page-width flex h-20 items-center justify-between gap-4">
          <a href="#" aria-label="Hot pip الرئيسية" className="wordmark" dir="ltr">hot pip<span className="text-brand-fruit">.</span></a>
          <nav aria-label="التنقل الرئيسي" className="hidden items-center gap-9 text-sm font-semibold md:flex">
            <a href="#story" className="nav-link">حكاية المشروب</a>
            <a href="#experience" className="nav-link">تجربة مختلفة</a>
            <a href="#questions" className="nav-link">أسئلة شائعة</a>
          </nav>
          <Button asChild className="h-10 gap-3 px-5"><a href="#join">كن من الأوائل <ArrowUpLeft /></a></Button>
        </div>
      </header>

      <section className="campaign-hero relative isolate overflow-hidden">
        <img src={editorial} alt="تصوّر تقديم مشروب أناناس ساخن مع قطع الأناناس" width={1536} height={1024} fetchPriority="high" className="campaign-image" />
        <div className="page-width relative z-10">
          <div className="hero-copy">
            <p className="eyebrow flex items-center gap-2"><span className="status-dot" /> قريبًا… بطعم مختلف</p>
            <h1 className="hero-title">أناناس ساخن<span className="mt-3 block text-primary">مشروب الشتاء القادم</span></h1>
            <p className="mt-6 max-w-md text-lg leading-loose text-muted-foreground">طعم استوائي، ولحظة دافئة.<br />مع <span dir="ltr" className="font-bold text-foreground">Hot pip</span>، للشتاء حكاية جديدة.</p>
            <Button asChild size="lg" className="mt-7 h-14 gap-6 px-7 text-base"><a href="#join">سجّل اهتمامك <ArrowLeft /></a></Button>
            <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground"><Check className="size-3.5" /> تسجيل اهتمام فقط، بدون شراء أو التزام</p>
          </div>
        </div>
        <div className="hero-caption">تصوّر لتقديم المشروب</div>
      </section>

      <section id="experience" className="border-b border-border bg-card">
        <div className="page-width grid grid-cols-3 py-7 md:py-9">
          {[[Leaf, "طعم الأناناس", "روح استوائية"], [Flame, "يتشرب ساخن", "دفء كل رشفة"], [Sparkles, "شيء مختلف", "خارج المعتاد"]].map(([Icon, title, subtitle], i) => {
            const FeatureIcon = Icon as typeof Leaf;
            return <div key={String(title)} className={`flex flex-col items-center gap-2 text-center md:flex-row md:justify-center md:gap-4 ${i < 2 ? "border-e border-border" : ""}`}>
              <FeatureIcon strokeWidth={1.4} className="size-6 text-primary md:size-8" />
              <div><h2 className="text-sm font-bold md:text-lg">{String(title)}</h2><p className="mt-1 hidden text-sm text-muted-foreground sm:block">{String(subtitle)}</p></div>
            </div>;
          })}
        </div>
      </section>

      <section id="story" className="page-width story-section grid items-center gap-10 py-16 md:grid-cols-2 md:gap-20 md:py-24">
        <div className="product-stage relative flex items-center justify-center overflow-hidden rounded-lg bg-secondary">
          <span className="product-stage-label" dir="ltr">A NEW WINTER RITUAL</span>
          <img src={bottle.url} alt="زجاجة Hot pip مشروب الأناناس الساخن" width={640} height={960} loading="lazy" className="relative h-[330px] w-auto max-w-[75%] object-contain md:h-[410px]" />
          <span className="product-stage-bottom">أناناس. دفء. مزاج جديد.</span>
        </div>
        <div>
          <p className="eyebrow">الحكاية بدأت بسؤال</p>
          <h2 className="section-title mt-4">مين قال إن الأناناس<br />لازم يتشرب بارد؟</h2>
          <p className="mt-6 text-base leading-loose text-muted-foreground md:text-lg">كل شتاء له مشروبه. فكرنا نغيّر المعتاد، ونجمع طعم الأناناس اللي بنحبه مع الدفء اللي بندوّر عليه.</p>
          <p className="mt-4 text-base leading-loose text-muted-foreground md:text-lg">دي بداية <span dir="ltr" className="font-bold text-foreground">Hot pip</span>. لسه ما نزلش الأسواق، لكن حكايتنا ممكن تبدأ معاك من دلوقتي.</p>
          <div className="mt-8 border-s-2 border-brand-fruit ps-5"><p className="text-xl font-bold leading-relaxed">رشفة دافية.<br />وفكرة مش على بالك.</p></div>
        </div>
      </section>

      <section id="join" className="join-section bg-secondary py-16 md:py-24">
        <div className="page-width grid items-start gap-10 md:grid-cols-2 md:gap-20">
          <div className="md:pt-9">
            <p className="eyebrow">القائمة الأولى لـ Hot pip</p>
            <h2 className="section-title mt-4">الحلو لسه جاي.<br /><span className="text-primary">خليك من الأوائل.</span></h2>
            <p className="mt-6 max-w-md text-base leading-loose text-muted-foreground">سجّل اهتمامك، وقول لنا مدينتك والسعر اللي تتوقعه. رأيك يساعدنا نبدأ من المكان الصح.</p>
            <div className="mt-8 space-y-5">
              {[[Mail, "خبر الإطلاق على بريدك"], [MapPin, "مدينتك جزء من خطتنا"], [Coffee, "سعر مناسب يبدأ برأيك"]].map(([Icon, text]) => {
                const JoinIcon = Icon as typeof Mail;
                return <div key={String(text)} className="flex items-center gap-3 text-sm font-semibold"><span className="flex size-9 items-center justify-center rounded-full bg-card"><JoinIcon className="size-4 text-primary" /></span>{String(text)}</div>;
              })}
            </div>
            {count !== null && count > 0 && <p className="mt-8 text-sm text-muted-foreground"><span className="font-bold text-primary">{count}</span> شخص شاركونا الاهتمام لحد دلوقتي</p>}
          </div>
          <div className="rounded-lg border border-border bg-card p-6 shadow-soft md:p-9">
            {done ? <div className="py-8 text-center" aria-live="polite">
              <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-secondary"><Check className="size-8 text-primary" /></span>
              <h3 className="mt-6 text-3xl font-bold">أنت من الأوائل!</h3>
              <p className="mt-4 leading-loose text-muted-foreground">هنبلغك أول ما Hot pip يوصل {form.city}.<br />شارك الحكاية مع أصحابك.</p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Button asChild className="h-11"><a target="_blank" rel="noreferrer" href={`https://wa.me/?text=${shareText}${shareUrl}%3Futm_source%3Dwhatsapp%26utm_medium%3Dsocial`}>شارك على واتساب <ArrowUpLeft /></a></Button>
                <Button asChild variant="outline" className="h-11"><a target="_blank" rel="noreferrer" href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}%3Futm_source%3Dfacebook%26utm_medium%3Dsocial`}>فيسبوك</a></Button>
              </div>
            </div> : <form onSubmit={submit} className="space-y-5">
              <div className="mb-7"><h3 className="text-xl font-bold">مكانك في القائمة</h3><p className="mt-2 text-sm text-muted-foreground">بداية حكاية دافئة، في خطوات بسيطة.</p></div>
              <Field label="الاسم" id="name"><Input id="name" autoComplete="name" placeholder="اسمك الكريم" className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
              <Field label="البريد الإلكتروني" id="email"><Input id="email" type="email" dir="ltr" autoComplete="email" placeholder="you@example.com" className="form-input text-right" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
              <Field label="المدينة" id="city"><Input id="city" list="cities" autoComplete="address-level2" placeholder="اختر أو اكتب مدينتك" className="form-input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /><datalist id="cities">{CITIES.map(c => <option key={c} value={c} />)}</datalist></Field>
              <fieldset><legend className="mb-3 text-sm font-semibold">كم تتوقع سعر الزجاجة؟</legend><div className="grid grid-cols-2 gap-2">{PRICES.map(p => <Button type="button" variant="outline" aria-pressed={form.expected_price === p} key={p} onClick={() => setForm({ ...form, expected_price: p })} className={`h-12 whitespace-normal px-2 text-xs sm:text-sm ${form.expected_price === p ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground" : "bg-background shadow-none"}`}>{form.expected_price === p && <Check className="size-3" />}{p}</Button>)}</div></fieldset>
              <Button type="submit" disabled={loading} className="h-13 w-full gap-5 text-base">{loading ? "جاري التسجيل..." : "سجّلني في القائمة"}{!loading && <ArrowLeft />}</Button>
              <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground"><ShieldCheck className="size-3.5 shrink-0" /> تسجيل اهتمام، مش طلب شراء</p>
            </form>}
          </div>
        </div>
      </section>

      <section id="questions" className="page-width grid gap-8 py-16 md:grid-cols-[0.8fr_1.2fr] md:gap-20 md:py-24">
        <div><p className="eyebrow">قبل أول رشفة</p><h2 className="section-title mt-4">أكيد عندك<br />كام سؤال.</h2></div>
        <Accordion type="single" collapsible dir="rtl" className="w-full">
          {[
            ["هو Hot pip إيه بالضبط؟", "مشروب أناناس ساخن، بفكرة مختلفة لمشروبات الشتاء. المنتج حاليًا في مرحلة ما قبل الإطلاق."],
            ["هل المشروب متاح للشراء حاليًا؟", "لسه مش متاح في الأسواق. سجّل اهتمامك وهنبلغك على بريدك عند الإطلاق."],
            ["ليه بتسألوا عن المدينة والسعر؟", "عشان نعرف فين الاهتمام الأكبر، وإيه السعر اللي الناس تتوقعه. رأيك يساعدنا نخطط لإطلاق المنتج."],
            ["هل التسجيل يلزمني بالشراء؟", "لا، التسجيل للتعبير عن اهتمامك فقط. مفيش دفع أو التزام بالشراء."],
          ].map(([q, a], i) => <AccordionItem key={q} value={`question-${i}`}><AccordionTrigger className="gap-5 py-6 text-start text-base font-bold hover:no-underline">{q}</AccordionTrigger><AccordionContent className="text-base leading-loose text-muted-foreground">{a}</AccordionContent></AccordionItem>)}
        </Accordion>
      </section>

      <footer className="border-t border-border bg-card">
        <div className="page-width flex flex-col items-center justify-between gap-5 py-9 md:flex-row">
          <a href="#" className="wordmark" dir="ltr">hot pip<span className="text-brand-fruit">.</span></a>
          <p className="text-sm text-muted-foreground">أناناس ساخن. مشروب الشتاء القادم.</p>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Hot pip. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </main>
  );
}
function Field({ label, id, children }: { label: string; id: string; children: ReactNode }) {
  return <div><label htmlFor={id} className="mb-2 block text-sm font-semibold">{label}</label>{children}</div>;
}
