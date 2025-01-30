import { Footer } from "@/components/Footer";
import MessageCard from "@/components/MessageCard";
import Navbar from "@/components/Navbar";
import { Geist, Geist_Mono } from "next/font/google";
import { ToastContainer } from "react-toastify";
// import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "GhostlyWords 👻📝",
  description: "Step into the shadows of secrecy with GhostlyWords, the app that lets you send and receive mysterious messages through a hidden link. Whether it’s an anonymous confession, a cryptic clue, or a surprise note, GhostlyWords keeps your identity shrouded in mystery.",
};

export default function RootLayout({ children }) {
  return (
    // <html lang="en">
    //   <body
    //     className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    //   >
    <main className="">
      <Navbar />
      {children}
      <Footer />
      <ToastContainer />
    </main>
    //   </body>
    // </html>
  );
}
