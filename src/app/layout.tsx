import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { GlobalHeadersProvider } from "@/context/GlobalHeadersContext";
import { SecretsProvider } from "@/context/SecretsContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "API Go!",
  description:
    "Open-source, cloud-synced API testing workspace. Organize collections, manage environments, share with your team.",
  icons: {
    icon: "/apigo-icon.svg",
    shortcut: "/apigo-icon.svg",
    apple: "/apigo-icon.svg",
  },
};

import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <ThemeProvider>
            <GlobalHeadersProvider>
              <SecretsProvider>{children}</SecretsProvider>
            </GlobalHeadersProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
