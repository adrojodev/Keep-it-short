import { Metadata } from "./components/Metadata";

import "./globals.css";
import { Work_Sans } from "next/font/google";

const workSans = Work_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "Keep it short!",
  description: "Find if today is a good day to wear shorts.",
  icon: {
    icon: "favicon.ico",
    apple: "images/app-icon.png",
  },
  twitter: {
    images: "images/share-image.png",
  },
  appleWebApp: {
    capable: true,
    title: "Keep it short!",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    title: "Keep it short!",
    description: "Find if today is a good day to wear shorts.",
    images: "images/share-image.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={workSans.className}>{children}</body>
    </html>
  );
}
