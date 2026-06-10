import { Copyright } from 'lucide-react';
import Link from 'next/link';

const footerLinks = [
  { href: 'https://github.com/inkeep/open-knowledge', label: 'GitHub' },
  { href: 'https://www.linkedin.com/company/inkeep/', label: 'LinkedIn' },
  { href: 'https://x.com/inkeep', label: 'X' },
];

export function SiteFooter() {
  return (
    <footer className="px-6 py-10">
      <div className="mx-auto flex container flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="flex items-center gap-6 text-sm text-slide-muted">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-slide-text"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <p className="flex items-center gap-2 text-xs font-medium text-slide-muted/60">
          <Copyright className="size-3" aria-hidden="true" />
          <span>2026 Inkeep. AI Agents you can trust.</span>
        </p>
      </div>
    </footer>
  );
}
