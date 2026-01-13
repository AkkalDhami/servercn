"use client";

import { Heading } from "@/components/ui/heading";
import { SubHeading } from "@/components/ui/sub-heading";

export default function Error() {
  return (
    <div className="flex flex-col space-y-2.5 h-screen items-center justify-center">
      <Heading as="h1">Something went wrong!</Heading>
      <SubHeading>Try again later.</SubHeading>
    </div>
  );
}
