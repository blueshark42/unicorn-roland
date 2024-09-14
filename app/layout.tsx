import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";

import Header from "./components/Header";

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
  <html lang="en">
    <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <AntdRegistry>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#00b96b",
              borderRadius: 2,

              colorBgContainer: "#f6ffed",
            },
          }}
        >
          <Header />
          <div>{children}</div>
        </ConfigProvider>
      </AntdRegistry>
    </body>
  </html>
);

export default RootLayout;
