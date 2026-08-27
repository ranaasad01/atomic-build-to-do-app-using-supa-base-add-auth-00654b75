"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { navLinks, BRAND } from "@/lib/data";
import { Sparkles, Code2 as Github, MessageCircle as Twitter, Briefcase as Linkedin } from 'lucide-react';

export default function Footer() {
  const t = useTranslations();
  const pathname = usePathname();
  const navT = t.raw("nav") as Record<string, string>;

  function handleLinkClick(
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) {
    if (href.startsWith("#")) {
      if (pathname === "/") {
        e.preventDefault();
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }

  function getLinkHref(href: string) {
    if (href.startsWith("#")) {
      return pathname === "/" ? href : "/" + href;
    }
    return href;
  }

  const socialLinks = [
    { icon: Github, label: "GitHub", href: "https://github.com" },
    { icon: Twitter, label: "Twitter", href: "https://twitter.com" },
    { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com" },
  ];

  return (
    <footer className="border-t border-[var(--border)] bg-white/60 backdrop-blur-sm mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="w-7 h-7 rounded-lg bg-[var(--primary)] flex items-center justify-center shadow-[0_2px_8px_rgba(99,102,241,0.3)] group-hover:shadow-[0_4px_12px_rgba(99,102,241,0.4)] transition-all duration-300">
                <Sparkles className="w-3.5 h-3.5 text-white" aria-hidden="true" />
              </div>
              <span className="font-bold text-[var(--foreground)] text-sm tracking-tight">
                {BRAND.name}
              </span>
            </Link>
            <p className="text-[var(--muted-foreground)] text-sm leading-relaxed max-w-xs">
              {t("footer.tagline")}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs font-semibold text-[var(--foreground)] uppercase tracking-wider mb-4">
              {t("footer.navHeading")}
            </h3>
            <nav className="flex flex-col gap-2" aria-label="Footer navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.key}
                  href={getLinkHref(link.href)}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className="text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors duration-200 w-fit"
                >
                  {navT[link.key] ?? link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-xs font-semibold text-[var(--foreground)] uppercase tracking-wider mb-4">
              {t("footer.socialHeading")}
            </h3>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 rounded-xl bg-[var(--background)] border border-[var(--border)] flex items-center justify-center text-[var(--muted-foreground)] hover:text-[var(--primary)] hover:border-[var(--primary)] transition-colors duration-200"
                >
                  <social.icon className="w-4 h-4" aria-hidden="true" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[var(--muted-foreground)]">
            {t("footer.copyright")}
          </p>
          <p className="text-xs text-[var(--muted-foreground)]">
            {t("footer.madeWith")}
          </p>
        </div>
      </div>
    </footer>
  );
}