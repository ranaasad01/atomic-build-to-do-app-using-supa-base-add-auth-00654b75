# AGENTS.md

Project conventions for AI agents and humans editing this codebase.

## Original request
build to do app using supa base add authintication also

## Goal
Build a full-stack TaskFlow To-Do app with Supabase authentication, real-time task management, and per-user data isolation using Next.js 14 App Router and TypeScript.

## Project type
saas-app

## Design system — match this exactly
- Color tokens: `--background: #f1f5ff`, `--foreground: #0f172a`, `--card: #ffffff`, `--border: #e2e8f0`, `--muted-foreground: #64748b`, `--primary: #6366f1`, `--accent: #818cf8`, `--destructive: #dc2626`, `--ring: #6366f1`, `--muted: #ffffff`

## Existing components — reuse these, don't create near-duplicates
- Footer (components/Footer.tsx)
- LanguageToggle (components/LanguageToggle.tsx)
- LocaleProvider (components/LocaleProvider.tsx)
- Navbar (components/Navbar.tsx)

## Existing i18n namespaces
Every translation key must be namespaced (`hero.title`, never a bare `title`) so two components never collide on the same catalog slot. Reuse one of these, or pick a new, distinct name:
`auth`, `authPage`, `cta`, `dashboardPage`, `features`, `footer`, `hero`, `howItWorks`, `nav`, `stats`, `testimonials`

When editing or adding pages: preserve the design system above, reuse existing components and the shared nav data file, and keep the established structure and tone.
