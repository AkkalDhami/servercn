import React from "react";

export default async function PublicLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="w-full max-w-svw overflow-x-hidden">{children}</div>
    </>
  );
}
