import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: {
    default: "ShopAura",
    template: "%s | ShopAura",
  },
  description:
    "Discover premium fashion, electronics, home essentials, and lifestyle products at ShopAura. Enjoy secure payments, fast shipping, and a seamless online shopping experience.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
