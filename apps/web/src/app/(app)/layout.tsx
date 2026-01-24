import Footer from "@/components/layouts/footer";
import React from "react";

export default async function PublicLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="mx-auto max-w-360 p-3 sm:p-4">
        {children}
        <Footer />
      </div>
    </>
  );
}
