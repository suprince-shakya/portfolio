import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import RootProvider from "@/lib/providers/RootProvider";
import { ToastContainer } from "react-toastify";

const custom = Poppins({
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portfolio | Full Stack Developer",
  description: "Portfolio of a Full Stack Developer showcasing projects and skills",
  openGraph: {
    title: "Portfolio | Full Stack Developer",
    url: `${process.env.NEXT_PUBLIC_APP_URL}`,
    siteName: "Portfolio | Suprince shakya",
    type: "website",
    // images: [
    //   {
    //     url: `${process.env.NEXT_PUBLIC_APP_URL}/opengraph-image.png`,
    //   },
    // ],
    description: "",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${custom.className} antialiased`}>
        <ToastContainer />
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
