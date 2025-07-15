import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "provider/ThemeProvider";
import { ConnectionProvider } from "provider/ConnectionProvider";

export const metadata: Metadata = {
  title: "Desafio STW",
  description: "Desenvolver uma solução de monitoramento",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="bg-white text-gray-900 dark:bg-black dark:text-white">
        <ThemeProvider>
          <ConnectionProvider>{children}</ConnectionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
