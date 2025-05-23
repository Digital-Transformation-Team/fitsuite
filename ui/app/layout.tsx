import type React from "react";
import "@/app/globals.css";
import { Providers } from "@/app/providers";

export const metadata = {
  title: "Fitsuite Dashboard",
  description: "Admin dashboard for gym management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
