"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import { fadeInUp, staggerContainer, scaleIn } from "@/lib/motion";
import { BRAND } from "@/lib/data";
import Link from "next/link";
import { CheckCircle, Zap, Shield, RefreshCw, Star, ArrowRight, Check, Clock, Target, Users } from 'lucide-react';

const FEATURES = [
  {
    icon: Zap,
    titleKey: "features.items.0.title",
    descKey: "features.items.0.desc",
  },
  {
    icon: RefreshCw,
    titleKey: "features.items.1.title",
    descKey: "features.items.1.desc",
  },
  {
    icon: Shield,
    titleKey: "features.items.2.title",
    descKey: "features.items.2.desc",
  },
  {
    icon: Target,
    titleKey: "features.items.3.title",
    descKey: "features.items.3.desc",
  },
  {
    icon: Clock,
    titleKey: "features.items.4.title",
    descKey: "features.items.4.desc",
  },
  {
    icon: Users,
    titleKey: "features.items.5.title",
    descKey: "features.items.5.desc",
  },
];

const TESTIMONIALS = [
  {
    name: "Sarah Chen",
    role: "Product Designer",
    avatar: "/images/sarah-chen-designer.jpg",
    quoteKey: "testimonials.items.0.quote",
    rating: 5,
  },
  {
    name: "Marcus Rivera",
    role: "Engineering Lead",
    avatar: "/images/marcus-rivera-engineer.jpg",
    quoteKey: "testimonials.items.1.quote",
    rating: 5,
  },
  {
    name: "Priya Nair",
    role: "Freelance Consultant",
    avatar: "/images/priya-nair-consultant.jpg",
    quoteKey: "testimonials.items.2.quote",
    rating: 5,
  },
];

const STATS = [
  { value: "50K+", labelKey: "stats.items.0.label" },
  { value: "99.9%", labelKey: "stats.items.1.label" },
  { value: "4.9", labelKey: "stats.items.2.label" },
  { value: "2M+", labelKey: "stats.items.3.label" },
];

const HOW_IT_WORKS = [
  { step: "01", titleKey: "howItWorks.items.0.title", descKey: "howItWorks.items.0.desc" },
  { step: "02", titleKey: "howItWorks.items.1.title", descKey: "howItWorks.items.1.desc" },
  { step: "03", titleKey: "howItWorks.items.2.title", descKey: "howItWorks.items.2.desc" },
];

export default function HomePage() {
  const t = useTranslations();

  const features = (
    Array.isArray(t.raw("features.items")) ? t.raw("features.items") : []
  ) as { title: string; desc: string }[];

  const testimonials = (
    Array.isArray(t.raw("testimonials.items")) ? t.raw("testimonials.items") : []
  ) as { quote: string }[];

  const stats = (
    Array.isArray(t.raw("stats.items")) ? t.raw("stats.items") : []
  ) as { label: string }[];

  const howItWorksItems = (
    Array.isArray(t.raw("howItWorks.items")) ? t.raw("howItWorks.items") : []
  ) as { title: string; desc: string }[];

  const ICONS = [Zap, RefreshCw, Shield, Target, Clock, Users];
  const STEP_ICONS = [CheckCircle, Target, Zap];

  return (
    <main className="overflow-x-hidden">
      {/* ── Hero ── */}
      <Reveal>
        <section className="relative min-h-[92vh] flex items-center bg-[hsl(var(--background))]">
          {/* Mesh glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden"
          >
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-[var(--accent)]/10 blur-[120px]" />
            <div className="absolute bottom-0 right-0 h-[400px] w-[500px] rounded-full bg-[var(--accent)]/5 blur-[100px]" />
          </div>

          <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: copy */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-6"
            >
              <motion.div variants={fadeInUp}>
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-[var(--accent)] uppercase">
                  <Zap className="h-3.5 w-3.5" aria-hidden="true" />
                  {t("hero.badge")}
                </span>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[hsl(var(--foreground))] text-balance leading-[1.05]"
              >
                {t("hero.headline.line1")}{" "}
                <span className="text-[var(--accent)]">
                  {t("hero.headline.accent")}
                </span>{" "}
                {t("hero.headline.line2")}
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-lg text-[hsl(var(--muted-foreground))] leading-relaxed max-w-lg text-pretty"
              >
                {t("hero.subhead")}
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="flex flex-wrap gap-4 pt-2"
              >
                <Link
                  href="/auth"
                  className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-7 py-3.5 text-sm font-semibold text-[hsl(var(--background))] shadow-[0_4px_24px_-4px_var(--accent)] transition-all duration-300 hover:brightness-110 hover:shadow-[0_8px_32px_-4px_var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                >
                  {t("hero.cta.primary")}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-7 py-3.5 text-sm font-semibold text-[hsl(var(--foreground))] transition-all duration-300 hover:border-[var(--accent)]/50 hover:bg-[var(--accent)]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                >
                  {t("hero.cta.secondary")}
                </Link>
              </motion.div>

              <motion.ul
                variants={fadeInUp}
                className="flex flex-wrap gap-x-6 gap-y-2 pt-2"
              >
                {(Array.isArray(t.raw("hero.perks")) ? t.raw("hero.perks") : []).map(
                  (perk: string, i: number) => (
                    <li
                      key={i}
                      className="flex items-center gap-1.5 text-sm text-[hsl(var(--muted-foreground))]"
                    >
                      <Check
                        className="h-4 w-4 text-[var(--accent)]"
                        aria-hidden="true"
                      />
                      {perk}
                    </li>
                  )
                )}
              </motion.ul>
            </motion.div>

            {/* Right: mock task UI */}
            <motion.div
              variants={scaleIn}
              initial="hidden"
              animate="visible"
              className="relative"
            >
              <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-[0_2px_4px_rgba(0,0,0,0.04),0_24px_64px_-16px_rgba(0,0,0,0.18)] overflow-hidden">
                {/* Mock header */}
                <div className="flex items-center gap-2 border-b border-[hsl(var(--border))] px-5 py-4">
                  <div className="h-3 w-3 rounded-full bg-red-400/70" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400/70" />
                  <div className="h-3 w-3 rounded-full bg-green-400/70" />
                  <span className="ml-3 text-xs font-medium text-[hsl(var(--muted-foreground))]">
                    {t("hero.mockUI.title")}
                  </span>
                </div>
                {/* Mock tasks */}
                <div className="p-5 space-y-3">
                  {(Array.isArray(t.raw("hero.mockUI.tasks"))
                    ? t.raw("hero.mockUI.tasks")
                    : []
                  ).map(
                    (
                      task: { label: string; done: boolean; tag: string },
                      i: number
                    ) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + i * 0.12, duration: 0.4, ease: "easeOut" }}
                        className="flex items-center gap-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-3"
                      >
                        <div
                          className={`h-5 w-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            task.done
                              ? "border-[var(--accent)] bg-[var(--accent)]"
                              : "border-[hsl(var(--border))]"
                          }`}
                        >
                          {task.done && (
                            <Check
                              className="h-3 w-3 text-[hsl(var(--background))]"
                              aria-hidden="true"
                            />
                          )}
                        </div>
                        <span
                          className={`flex-1 text-sm ${
                            task.done
                              ? "line-through text-[hsl(var(--muted-foreground))]"
                              : "text-[hsl(var(--foreground))]"
                          }`}
                        >
                          {task.label}
                        </span>
                        <span className="rounded-full bg-[var(--accent)]/10 px-2.5 py-0.5 text-[10px] font-semibold text-[var(--accent)]">
                          {task.tag}
                        </span>
                      </motion.div>
                    )
                  )}
                  {/* Add task row */}
                  <div className="flex items-center gap-3 rounded-xl border border-dashed border-[hsl(var(--border))] px-4 py-3 opacity-60">
                    <div className="h-5 w-5 rounded-full border-2 border-[hsl(var(--border))] flex-shrink-0" />
                    <span className="text-sm text-[hsl(var(--muted-foreground))]">
                      {t("hero.mockUI.addPlaceholder")}
                    </span>
                  </div>
                </div>
              </div>
              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.5, ease: "easeOut" }}
                className="absolute -bottom-5 -left-5 flex items-center gap-2.5 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-3 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.14)]"
              >
                <CheckCircle
                  className="h-5 w-5 text-[var(--accent)]"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-xs font-semibold text-[hsl(var(--foreground))]">
                    {t("hero.badge2.title")}
                  </p>
                  <p className="text-[10px] text-[hsl(var(--muted-foreground))]">
                    {t("hero.badge2.sub")}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </Reveal>

      {/* ── Stats ── */}
      <Reveal>
        <section className="border-y border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <div className="mx-auto max-w-6xl px-6 py-14">
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
              {STATS.map((s, i) => (
                <div key={i} className="text-center">
                  <div className="text-4xl font-bold text-[var(--accent)]">
                    {s.value}
                  </div>
                  <div className="mt-1.5 text-sm text-[hsl(var(--muted-foreground))]">
                    {stats[i]?.label ?? ""}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── Features ── */}
      <Reveal>
        <section id="features" className="bg-[hsl(var(--background))] py-24 md:py-32">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-16 max-w-2xl">
              <span className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
                {t("features.eyebrow")}
              </span>
              <h2 className="mt-3 text-4xl font-bold tracking-tight text-[hsl(var(--foreground))] text-balance">
                {t("features.heading")}
              </h2>
              <p className="mt-4 text-[hsl(var(--muted-foreground))] leading-relaxed text-pretty">
                {t("features.subhead")}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feat, i) => {
                const Icon = ICONS[i] ?? Zap;
                const isLarge = i === 0 || i === 3;
                return (
                  <Reveal
                    key={i}
                    delay={i * 0.07}
                    className={isLarge ? "sm:col-span-2 lg:col-span-1" : ""}
                  >
                    <motion.div
                      whileHover={{ y: -4, transition: { duration: 0.2 } }}
                      className="group h-full rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.08)] transition-all duration-300 hover:border-[var(--accent)]/40 hover:shadow-[0_4px_32px_-8px_rgba(0,0,0,0.14)]"
                    >
                      <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] transition-colors duration-300 group-hover:bg-[var(--accent)]/20">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <h3 className="text-base font-semibold text-[hsl(var(--foreground))]">
                        {feat.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
                        {feat.desc}
                      </p>
                    </motion.div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── How It Works ── */}
      <Reveal>
        <section
          id="about"
          className="bg-[hsl(var(--card))] py-24 md:py-32 border-y border-[hsl(var(--border))]"
        >
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-16 text-center">
              <span className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
                {t("howItWorks.eyebrow")}
              </span>
              <h2 className="mt-3 text-4xl font-bold tracking-tight text-[hsl(var(--foreground))] text-balance">
                {t("howItWorks.heading")}
              </h2>
              <p className="mt-4 mx-auto max-w-xl text-[hsl(var(--muted-foreground))] leading-relaxed text-pretty">
                {t("howItWorks.subhead")}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {howItWorksItems.map((step, i) => {
                const Icon = STEP_ICONS[i] ?? CheckCircle;
                return (
                  <Reveal key={i} delay={i * 0.1}>
                    <div className="relative flex flex-col items-center text-center">
                      {i < howItWorksItems.length - 1 && (
                        <div
                          aria-hidden="true"
                          className="absolute top-10 left-[calc(50%+2.5rem)] hidden h-px w-[calc(100%-5rem)] border-t border-dashed border-[hsl(var(--border))] md:block"
                        />
                      )}
                      <div className="relative mb-5 flex h-20 w-20 items-center justify-center rounded-2xl border border-[var(--accent)]/20 bg-[var(--accent)]/10">
                        <Icon
                          className="h-8 w-8 text-[var(--accent)]"
                          aria-hidden="true"
                        />
                        <span className="absolute -top-2.5 -right-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent)] text-[10px] font-bold text-[hsl(var(--background))]">
                          {HOW_IT_WORKS[i]?.step}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-[hsl(var(--foreground))]">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
                        {step.desc}
                      </p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── Testimonials ── */}
      <Reveal>
        <section className="bg-[hsl(var(--background))] py-24 md:py-32">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-16 text-center">
              <span className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
                {t("testimonials.eyebrow")}
              </span>
              <h2 className="mt-3 text-4xl font-bold tracking-tight text-[hsl(var(--foreground))] text-balance">
                {t("testimonials.heading")}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {TESTIMONIALS.map((person, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <motion.div
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="flex flex-col gap-4 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.08)]"
                  >
                    <div className="flex gap-0.5">
                      {Array.from({ length: person.rating }).map((_, si) => (
                        <Star
                          key={si}
                          className="h-4 w-4 fill-[var(--accent)] text-[var(--accent)]"
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    <p className="flex-1 text-sm leading-relaxed text-[hsl(var(--foreground))]">
                      {testimonials[i]?.quote ?? ""}
                    </p>
                    <div className="flex items-center gap-3 border-t border-[hsl(var(--border))] pt-4">
                      <img
                        src={person.avatar}
                        alt={person.name}
                        className="h-10 w-10 rounded-full object-cover ring-2 ring-[var(--accent)]/20"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=random`;
                        }}
                      />
                      <div>
                        <p className="text-sm font-semibold text-[hsl(var(--foreground))]">
                          {person.name}
                        </p>
                        <p className="text-xs text-[hsl(var(--muted-foreground))]">
                          {person.role}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── CTA ── */}
      <Reveal>
        <section
          id="contact"
          className="relative overflow-hidden bg-[hsl(var(--card))] border-t border-[hsl(var(--border))] py-24 md:py-32"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
          >
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[800px] rounded-full bg-[var(--accent)]/8 blur-[100px]" />
          </div>
          <div className="relative mx-auto max-w-3xl px-6 text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
              {t("cta.eyebrow")}
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-[hsl(var(--foreground))] text-balance">
              {t("cta.heading")}
            </h2>
            <p className="mt-5 text-lg text-[hsl(var(--muted-foreground))] leading-relaxed text-pretty">
              {t("cta.subhead")}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/auth"
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-8 py-4 text-sm font-semibold text-[hsl(var(--background))] shadow-[0_4px_24px_-4px_var(--accent)] transition-all duration-300 hover:brightness-110 hover:shadow-[0_8px_32px_-4px_var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                {t("cta.button")}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl border border-[hsl(var(--border))] bg-transparent px-8 py-4 text-sm font-semibold text-[hsl(var(--foreground))] transition-all duration-300 hover:border-[var(--accent)]/50 hover:bg-[var(--accent)]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                {t("cta.secondary")}
              </Link>
            </div>
            <p className="mt-6 text-xs text-[hsl(var(--muted-foreground))]">
              {t("cta.footnote")}
            </p>
          </div>
        </section>
      </Reveal>
    </main>
  );
}