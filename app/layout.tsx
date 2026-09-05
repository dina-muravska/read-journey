import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import { AuthProvider } from "@/components/AuthProvider/AuthProvider";
import { Toaster } from "sonner";

export const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-gilroy",
  display: "swap",
});

// const SITE_URL = ;

export const metadata: Metadata = {
  title: "Read Journey | Personal Reading Tracker & Book Finder",
  description:
    "Log your reading habits, monitor real-time progress, and set custom goals. Discover your next favorite book and analyze your reading insights seamlessly.",
  openGraph: {
    type: "website",
    title: "Read Journey | Personal Reading Tracker & Book Finder",
    description:
      "Log your reading habits, monitor real-time progress, and set custom goals. Discover your next favorite book and analyze your reading insights seamlessly.",
    // url: `${SITE_URL}/`,
    siteName: "Read Journey",
    images: [
      // {
      //   // // url: ``,
      //   // width: 1200,
      //   // height: 630,
      //   // alt: "Read Journey App Preview",
      // },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Read Journey | Personal Reading Tracker & Book Finder",
    description:
      "Log your reading habits, monitor real-time progress, and set custom goals. Discover your next favorite book and analyze your reading insights seamlessly.",
    // images: ,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jakarta.variable} antialiased`}>
        <TanStackProvider>
          <AuthProvider>{children}</AuthProvider>
        </TanStackProvider>
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
