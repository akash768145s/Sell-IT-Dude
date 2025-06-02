// src/app/layout.tsx (Server Component)

import "./globals.css";
import "@uploadthing/react/styles.css";
import { Oswald } from "next/font/google";
import ClientLayout from "./ClientLayout";

const inter = Oswald({ subsets: ["latin"] });

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
