import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSelector } from "@/components/LanguageSelector";
import { AccountMenu } from "@/components/AccountMenu";
import { CoverPreview } from "@/components/CoverPreview";
import { TEMPLATES } from "@/lib/templates";
import { EMPTY_COVER } from "@/lib/cover-types";
import {
  Sparkles,
  Palette as PaletteIcon,
  Download,
  Wand2,
  Moon,
  ImageIcon,
  ArrowRight,
  GraduationCap,
  ShieldCheck,
  Zap,
  BarChart3,
  Settings as SettingsIcon,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CoverCraft — Assignment Cover Page Maker" },
      { name: "description", content: "Design assignment cover pages from 500+ templates with AI artwork, live preview and one-click PDF or PNG download." },
      { property: "og:title", content: "CoverCraft — Assignment Cover Page Maker" },
      { property: "og:description", content: "500+ templates, AI cover artwork, live preview and print-ready PDF or PNG exports." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const DEMO = {
  ...EMPTY_COVER,
  studentName: "Ayesha Rahman",
  roll: "17",
  section: "A",
  className: "10",
  studentId: "STU-2026-0417",
  schoolName: "Cambridge International School",
  teacherName: "Dr. Karim Hasan",
  subject: "Physics",
  assignmentTitle: "Waves, Light & the Nature of Reality",
  submissionDate: "19 July 2026",
  academicYear: "2025 – 2026",
};

const FEATURES = [
  { icon: PaletteIcon, title: "500+ Elegant Templates", body: "Handcrafted layouts across school, college, thesis, lab report and more — with trending, newest and recently used sections." },
  { icon: Sparkles, title: "Live Preview", body: "See your cover page update instantly as you type." },
  { icon: Download, title: "PDF & PNG Export", body: "Print-ready A4 PDF or high-resolution PNG in one click." },
  { icon: Wand2, title: "AI Cover Artwork", body: "Describe the look you want and get custom, text-free artwork rendered behind any template." },
  { icon: Moon, title: "Dark & Light Mode", body: "Beautiful in either mode. Fully responsive on any device." },
  { icon: ImageIcon, title: "Photo & Logo Upload", body: "Add a student photo and institution logo up to 10 MB." },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-hero text-white shadow-glow">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="font-serif text-xl font-bold tracking-tight">CoverCraft</span>
          </Link>
          <div className="flex items-center gap-2">
            <LanguageSelector />
            <ThemeToggle />
            <AccountMenu />
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link to="/dashboard"><BarChart3 className="mr-1 h-4 w-4" />Insights</Link>
            </Button>
            <Button asChild variant="ghost" size="icon" aria-label="Settings" className="hidden sm:inline-flex">
              <Link to="/settings"><SettingsIcon className="h-4 w-4" /></Link>
            </Button>
            <Button asChild size="sm" className="bg-gradient-hero text-white shadow-glow hover:opacity-95">
              <Link to="/create">Start creating <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-subtle" />
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 py-16 md:grid-cols-2 md:py-24">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent-foreground">
              <Sparkles className="h-3.5 w-3.5" /> New · 500+ designer templates
            </span>
            <h1 className="mt-5 font-serif text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
              Beautiful assignment <span className="bg-gradient-hero bg-clip-text text-transparent">cover pages</span> in seconds.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
              Type your details once, pick a template, and download a print-ready PDF or high-resolution PNG. Elegant fonts, live preview, and a photo of you if you'd like.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="bg-gradient-hero text-white shadow-glow transition hover:scale-[1.02]">
                <Link to="/create">Create your cover <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
              </Button>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-accent" /> Print-ready A4 · No watermarks
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[380px] animate-in fade-in zoom-in-95 duration-1000">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-hero opacity-30 blur-2xl" />
            <div className="relative aspect-[794/1123] w-full overflow-hidden rounded-xl bg-white shadow-elegant ring-1 ring-black/5 transition-transform hover:-rotate-1">
              <div className="absolute left-0 top-0 origin-top-left" style={{ transform: "scale(0.48)" }}>
                <CoverPreview data={DEMO} templateId={TEMPLATES[11].id} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl font-bold sm:text-4xl">Everything you need. Nothing you don't.</h2>
          <p className="mt-3 text-muted-foreground">A thoughtful tool for students who care how their work looks.</p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="group rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-elegant">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-gold text-primary shadow-sm">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-serif text-lg font-bold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* GALLERY PREVIEW */}
      <section className="border-y border-border bg-gradient-subtle">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-serif text-3xl font-bold sm:text-4xl">Templates for every subject</h2>
            <p className="mt-3 text-muted-foreground">A peek at some of the {TEMPLATES.length} designs waiting inside.</p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {[0, 8, 15, 23, 31, 42, 51, 55].map((i) => {
              const t = TEMPLATES[i % TEMPLATES.length];
              return (
                <div key={t.id} className="group aspect-[794/1123] overflow-hidden rounded-lg bg-white shadow-paper ring-1 ring-black/5 transition-transform hover:-translate-y-1 hover:rotate-1">
                  <div className="origin-top-left" style={{ transform: "scale(0.25)" }}>
                    <CoverPreview data={DEMO} templateId={t.id} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-10 text-center">
            <Button asChild size="lg" className="bg-gradient-hero text-white shadow-glow">
              <Link to="/create">Browse all templates <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="overflow-hidden rounded-3xl bg-gradient-hero p-10 text-center text-white shadow-elegant sm:p-16">
          <Zap className="mx-auto h-10 w-10 text-accent" />
          <h2 className="mt-4 font-serif text-3xl font-bold sm:text-4xl">Your next cover page is 60 seconds away.</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/85">Fill in your details, pick a template, and download. That's it.</p>
          <Button asChild size="lg" variant="secondary" className="mt-8 shadow-glow">
            <Link to="/create">Get started <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        Made with care · CoverCraft © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
