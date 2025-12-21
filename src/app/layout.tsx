import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "아마추어 축구 기록 관리 플랫폼 | League Maker",
  description: "경기 기록, 리그 운영, 팀 찾기까지. 아마추어 축구의 모든 것을 한곳에서 관리하세요.",
  keywords: ["아마추어 축구", "축구 팀", "경기 기록", "리그 관리", "풋살", "축구 용병", "경기 일정"],
  authors: [{ name: "League Maker" }],
  creator: "League Maker",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://leaguemaker.com",
    title: "아마추어 축구 기록 관리 플랫폼 | League Maker",
    description: "경기 기록, 리그 운영, 팀 찾기까지. 아마추어 축구의 모든 것을 한곳에서 관리하세요.",
    siteName: "League Maker",
  },
  twitter: {
    card: "summary_large_image",
    title: "아마추어 축구 기록 관리 플랫폼 | League Maker",
    description: "경기 기록, 리그 운영, 팀 찾기까지. 아마추어 축구의 모든 것을 한곳에서 관리하세요.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={geistSans.className}>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
