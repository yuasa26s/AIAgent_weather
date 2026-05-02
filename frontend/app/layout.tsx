import type { Metadata } from "next";
import { M_PLUS_Rounded_1c } from "next/font/google";
import "./globals.css";

const mplus = M_PLUS_Rounded_1c({
  subsets: ["latin"], // ← これでOK（日本語も含まれます）
  weight: ["400", "500", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "コーデ日和",
  description: "今日の服装をご提案",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={`${mplus.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
