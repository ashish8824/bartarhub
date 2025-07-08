// src/app/layout.tsx
"use client";
import { UIProvider } from "@/context/UiContext";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <UIProvider>
          {children}
          <Toaster position="top-center" />
        </UIProvider>
      </body>
    </html>
  );
}
