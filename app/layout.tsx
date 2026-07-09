import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Provider";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/lib/auth-context";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Big Banana Group",
  icons: { icon: "/logo/NextID-Logo-CMYK.png" },
  description: "Big Banana Group Restaurant Feedback Dashboard",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white">
        <Providers>
          <AuthProvider>
            <Toaster position="top-right" />
            {children}
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}