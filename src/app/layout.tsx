import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { UserProvider } from "@/components/user-provider";
import { PWARegister } from "@/components/pwa-register";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pulihku – Platform Pemulihan Digital",
  description: "Aplikasi yang membantu Anda membangun kebiasaan positif dan pulih dari kecanduan digital.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${outfit.variable} h-full antialiased`}>
      <body className="min-h-full flex font-sans bg-background text-foreground">
        <UserProvider>
          <PWARegister />
          {children}
          <Toaster />
        </UserProvider>
      </body>
    </html>
  );
}
