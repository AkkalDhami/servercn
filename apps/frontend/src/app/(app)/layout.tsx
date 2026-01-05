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
      <div className="p-4 max-w-360 mx-auto">
        <Navbar />
        {children}
        <Footer />
      </div>
    </>
  );
}
