import React from "react";

export default async function PublicLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="max-w-svw w-full overflow-x-hidden">
        {children}
      </div>
    </>
  );
}
