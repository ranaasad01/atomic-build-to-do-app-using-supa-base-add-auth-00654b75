"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, CheckCircle, Sparkles, ArrowRight } from 'lucide-react';
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/data";
import { fadeInUp, scaleIn } from "@/lib/motion";

type AuthMode = "signin" | "signup";

export default function AuthPage() {
  const t = useTranslations();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const isSignUp = mode === "signup";

  const validate = (): string | null => {
    if (!email.trim()) return t("auth.error.emailRequired");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return t("auth.error.emailInvalid");
    if (!password) return t("auth.error.passwordRequired");
    if (password.length < 6) return t("auth.error.passwordShort");
    if (isSignUp && password !== confirmPassword) return t("auth.error.passwordMismatch");
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSuccess(true);
  };

  const switchMode = (next: AuthMode) => {
    setMode(next);
    setError(null);
    setSuccess(false);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const features = (Array.isArray(t.raw("auth.features")) ? t.raw("auth.features") : []) as {
    icon: string;
    text: string;
  }[];

  return (
    <main className="min-h-screen bg-[hsl(var(--background))] flex items-stretch">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-[var(--accent)] p-12 relative overflow-hidden">
        {/* Background texture */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.12) 0%, transparent 60%), radial-gradient(circle at 80% 80%, rgba(0,0,0,0.08) 0%, transparent 50%)",
          }}
        />

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="h-9 w-9 rounded-xl bg-black/20 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" aria-hidden="true" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">{BRAND.name}</span>
          </Link>
        </div>

        <div className="relative z-10 space-y-8">
          <motion.div variants={fadeInUp} initial="hidden" animate="visible">
            <h1 className="text-4xl font-bold text-white leading-tight tracking-tight text-balance">
              {t("auth.panel.headline")}
            </h1>
            <p className="mt-4 text-white/75 text-lg leading-relaxed text-pretty">
              {t("auth.panel.subheadline")}
            </p>
          </motion.div>

          <ul className="space-y-4">
            {features.map((f, i) => (
              <motion.li
                key={i}
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.15 + i * 0.08 }}
                className="flex items-center gap-3"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-base">
                  {f.icon}
                </span>
                <span className="text-white/90 text-sm font-medium">{f.text}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="relative z-10">
          <p className="text-white/50 text-xs">{t("auth.panel.footer")}</p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 sm:px-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="h-8 w-8 rounded-xl bg-[var(--accent)] flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" aria-hidden="true" />
            </div>
            <span className="text-lg font-bold text-[hsl(var(--foreground))] tracking-tight">
              {BRAND.name}
            </span>
          </div>

          <Reveal>
            {/* Tab switcher */}
            <div className="mb-8 flex rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))] p-1">
              {(["signin", "signup"] as AuthMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => switchMode(m)}
                  className={cn(
                    "flex-1 rounded-lg py-2 text-sm font-semibold transition-all duration-200",
                    mode === m
                      ? "bg-[hsl(var(--card))] text-[hsl(var(--foreground))] shadow-[0_1px_4px_rgba(0,0,0,0.08)]"
                      : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                  )}
                >
                  {m === "signin" ? t("auth.tab.signin") : t("auth.tab.signup")}
                </button>
              ))}
            </div>

            {/* Heading */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-[hsl(var(--foreground))] tracking-tight">
                {isSignUp ? t("auth.form.signupHeading") : t("auth.form.signinHeading")}
              </h1>
              <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
                {isSignUp ? t("auth.form.signupSub") : t("auth.form.signinSub")}
              </p>
            </div>

            {/* Success state */}
            {success ? (
              <motion.div
                variants={scaleIn}
                initial="hidden"
                animate="visible"
                className="rounded-2xl border border-[var(--accent)]/30 bg-[var(--accent)]/8 p-8 text-center"
              >
                <CheckCircle className="mx-auto h-12 w-12 text-[var(--accent)]" aria-hidden="true" />
                <h2 className="mt-4 text-lg font-semibold text-[hsl(var(--foreground))]">
                  {isSignUp ? t("auth.success.signupTitle") : t("auth.success.signinTitle")}
                </h2>
                <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
                  {isSignUp ? t("auth.success.signupBody") : t("auth.success.signinBody")}
                </p>
                <Link
                  href="/dashboard"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                >
                  {t("auth.success.cta")}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-sm font-medium text-[hsl(var(--foreground))]"
                  >
                    {t("auth.form.emailLabel")}
                  </label>
                  <div className="relative">
                    <Mail
                      className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]"
                      aria-hidden="true"
                    />
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t("auth.form.emailPlaceholder")}
                      className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] py-2.5 pl-10 pr-4 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] transition-all duration-200 focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-1.5 block text-sm font-medium text-[hsl(var(--foreground))]"
                  >
                    {t("auth.form.passwordLabel")}
                  </label>
                  <div className="relative">
                    <Lock
                      className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]"
                      aria-hidden="true"
                    />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete={isSignUp ? "new-password" : "current-password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t("auth.form.passwordPlaceholder")}
                      className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] py-2.5 pl-10 pr-11 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] transition-all duration-200 focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? t("auth.form.hidePassword") : t("auth.form.showPassword")}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <Eye className="h-4 w-4" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm password (sign up only) */}
                {isSignUp && (
                  <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                  >
                    <label
                      htmlFor="confirmPassword"
                      className="mb-1.5 block text-sm font-medium text-[hsl(var(--foreground))]"
                    >
                      {t("auth.form.confirmLabel")}
                    </label>
                    <div className="relative">
                      <Lock
                        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]"
                        aria-hidden="true"
                      />
                      <input
                        id="confirmPassword"
                        type={showConfirm ? "text" : "password"}
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder={t("auth.form.confirmPlaceholder")}
                        className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] py-2.5 pl-10 pr-11 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] transition-all duration-200 focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm((v) => !v)}
                        aria-label={showConfirm ? t("auth.form.hidePassword") : t("auth.form.showPassword")}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
                      >
                        {showConfirm ? (
                          <EyeOff className="h-4 w-4" aria-hidden="true" />
                        ) : (
                          <Eye className="h-4 w-4" aria-hidden="true" />
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Forgot password (sign in only) */}
                {!isSignUp && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="text-xs text-[var(--accent)] hover:underline focus-visible:outline-none focus-visible:underline"
                    >
                      {t("auth.form.forgotPassword")}
                    </button>
                  </div>
                )}

                {/* Error */}
                {error && (
                  <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800/40 dark:bg-red-900/20 dark:text-red-400"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.01 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent)] py-3 text-sm font-semibold text-white shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-all duration-200 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <svg
                        className="h-4 w-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                      </svg>
                      {t("auth.form.loading")}
                    </>
                  ) : (
                    <>
                      {isSignUp ? t("auth.form.signupButton") : t("auth.form.signinButton")}
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </>
                  )}
                </motion.button>

                {/* Divider */}
                <div className="relative flex items-center gap-3">
                  <div className="h-px flex-1 bg-[hsl(var(--border))]" />
                  <span className="text-xs text-[hsl(var(--muted-foreground))]">{t("auth.form.or")}</span>
                  <div className="h-px flex-1 bg-[hsl(var(--border))]" />
                </div>

                {/* Demo shortcut */}
                <Link
                  href="/dashboard"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] py-3 text-sm font-medium text-[hsl(var(--foreground))] transition-all duration-200 hover:bg-[hsl(var(--muted))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                >
                  {t("auth.form.demoButton")}
                </Link>

                {/* Switch mode */}
                <p className="text-center text-sm text-[hsl(var(--muted-foreground))]">
                  {isSignUp ? t("auth.form.hasAccount") : t("auth.form.noAccount")}{" "}
                  <button
                    type="button"
                    onClick={() => switchMode(isSignUp ? "signin" : "signup")}
                    className="font-semibold text-[var(--accent)] hover:underline focus-visible:outline-none focus-visible:underline"
                  >
                    {isSignUp ? t("auth.form.switchToSignin") : t("auth.form.switchToSignup")}
                  </button>
                </p>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </main>
  );
}