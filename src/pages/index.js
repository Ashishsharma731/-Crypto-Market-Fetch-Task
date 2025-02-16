import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
// import CryptoSpotTable from "@/components/spot/CryptoSpotTable";
import CryptoFutureTable from "@/components/future/CryptofutureTable";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div>
      {/* <CryptoSpotTable/> */}
      <CryptoFutureTable/>
    </div>
  );
}
