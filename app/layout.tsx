import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Tabs } from "./components/Tabs";
import { ThemeToggle } from "./components/ThemeToggle";

export const metadata: Metadata = {
  title: "Casa",
  description: "Menú compartido y gastos del hogar",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f3ee" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1816" },
  ],
};

// Aplica el tema guardado antes del hydrate para evitar flash
const themeInitScript = `
(function(){
  try {
    var t = localStorage.getItem('casa-theme');
    if (t === 'light' || t === 'dark') {
      document.documentElement.setAttribute('data-theme', t);
    }
  } catch(e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <header className="topbar">
          <div className="brand">
            <span className="brand-mark">●</span>
            <span className="brand-name">Casa</span>
          </div>
          <div className="topbar-right">
            <Tabs />
            <ThemeToggle />
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
