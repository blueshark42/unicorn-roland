import type { Metadata } from "next";
import localFont from "next/font/local";

import { ConfigProvider } from "antd";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { TRPCProvider } from "@/trpc/client";

import Header from "./components/Header";

import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Unicorn Analytics",
  description: "Unicorn Analytics App",
};

const RootLayout = ({ children }: React.PropsWithChildren) => (
  <TRPCProvider>
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AntdRegistry>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "var(--primary)",
                borderRadius: 2,

                colorBgContainer: "#ffffff",
              },
            }}
          >
            <Header />
            <div>{children}</div>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  </TRPCProvider>
);

export default RootLayout;
