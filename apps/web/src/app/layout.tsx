import type { Metadata } from "next";
import "../index.css";
import Providers from "@/components/providers";

export const metadata: Metadata = {
  title: "Thermora - Justiça climática começa com dados.",
  description: "Análise de dados de temperatura para focos de calor.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
