import type { Metadata } from "next";
import "./globals.css";
import { Tabs } from "./components/Tabs";

export const metadata: Metadata = {
  title: "Casa",
  description: "Menú compartido y gastos del hogar",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <header className="topbar">
          <div className="brand">
            <span className="brand-mark">●</span>
            <span className="brand-name">Casa</span>
          </div>
          <Tabs />
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
