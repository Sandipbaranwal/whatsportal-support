import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport = {
  // Lets the page paint under the notch and the home indicator, which is also
  // the only way `env(safe-area-inset-*)` reports anything but 0 — the widget's
  // fixed launcher and panel budget for those insets in `globals.css`.
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#2cbb67" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
  ],
};

export const metadata = {
  title: "WhatsPortal Support — Chat Widget",
  description:
    "Phase 1 UI prototype of the WhatsPortal customer-support chat widget.",
  icons: { icon: "/whatsportal-mark.svg" },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      {/* `overflow-x-clip` is a backstop, not the fix: fixed-position furniture
          is inset from the safe areas at source so nothing overflows here. */}
      <body className="flex min-h-full flex-col overflow-x-clip">{children}</body>
    </html>
  );
}
