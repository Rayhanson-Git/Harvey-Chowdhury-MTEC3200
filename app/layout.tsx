// Source: Next.js create-next-app scaffold; adapted for LeaveBy. https://nextjs.org/docs/app
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JimBro — Time well lifted",
  description:
    "Know your workout window. Log your training. See your progress. Leave on time.",
  metadataBase: new URL("https://jimbro.rayhanson.tech"),
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "JimBro — Time well lifted",
    description: "One workout. The rest of your day.",
    images: [{ url: "/social.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", images: ["/social.png"] },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
