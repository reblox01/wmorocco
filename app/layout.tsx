import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

import NavBar from "./components/navbar/NavBar";
import ClientOnly from "./components/ClientOnly";

import RegisterModal from "./components/modals/RegisterModal";
import LoginModal from "./components/modals/LoginModal";
import RentModal from "./components/modals/RentModal";
import SearchModal from "./components/modals/SearchModal";

import ToasterProvider from "./providers/ToasterProvider";
import getCurrentUser from "./actions/getCurrentUser";


const font = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WMorocco",
  description: "Booking Web Application",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();

  return (
    <html lang="en">
      <head>
        <title>WMorocco | Vacation rentals, cabins, beach houses & more</title>
        <link rel="icon" type="image/svg+xml" href="/assets/favicon.svg" />
        <link rel="icon" type="image/png" href="/assets/favicon.png" />
      </head>
      <body className={font.className}>
        <div className="h-full min-h-screen w-full bg-white">
          <ClientOnly>
            <ToasterProvider />
            <RentModal />
            <SearchModal />
            <LoginModal />
            <RegisterModal />
            <NavBar currentUser={currentUser} />
          </ClientOnly>
          <div className="pb-20 pt-28">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
