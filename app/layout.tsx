import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BakeHouse | Freshly Baked, Made with Love",
  description: "A neighbourhood bakery bringing fresh bakes, celebration cakes and warm service to the community."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
