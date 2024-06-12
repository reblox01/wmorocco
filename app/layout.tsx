import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "./components/navbar/NavBar";
import ClientOnly from "./components/ClientOnly";
import Modal from "./components/modals/Modal";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WMorocco",
  description: "Booking Web Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
      <ClientOnly>
        <Modal title="hello" isOpen />
        <NavBar />
      </ClientOnly>
      {children}
    </html>
  );
}
