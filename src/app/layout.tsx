// src/app/layout.tsx (Server Component)

import "./globals.css";
import "@uploadthing/react/styles.css";
import { Inter } from "next/font/google";
import ClientLayout from "./ClientLayout";

// Use Inter with display: swap for better performance
const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata = {
  title: "Sell it Dude",
  description: "Campus Marketplace for Students",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
