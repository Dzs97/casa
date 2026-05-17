"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/menu", label: "Menú" },
  { href: "/gastos", label: "Gastos" },
];

export function Tabs() {
  const pathname = usePathname();
  return (
    <nav className="tabs">
      {TABS.map((t) => {
        const active = pathname?.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`tab ${active ? "tab-active" : ""}`}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
