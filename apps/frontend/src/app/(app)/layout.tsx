import Footer from "@/components/layouts/footer";
import Navbar from "@/components/layouts/navbar";
import React from "react";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="mx-auto max-w-360 p-4">
        <Navbar />
        {children}
        <Footer />
      </div>
    </>
  );
}
