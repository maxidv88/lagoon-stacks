
import "./globals.css";
import { Inter } from "next/font/google";


import Navbar from "../components/Navbar";
import { UserProvider } from "@/UserContext";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen text-white bg-slate-800">
          <UserProvider>
            <Navbar/>
            {children}
          </UserProvider>
        </div>
      </body>
    </html>
  );
}
