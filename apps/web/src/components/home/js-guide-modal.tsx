"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";

export default function JSGuideModal({
  children
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleContinue = () => {
    router.push("/docs/guides/js-guide");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className="">
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium capitalize sm:text-2xl">
            Using {APP_NAME} with JavaScript
          </DialogTitle>
          <DialogDescription className="pt-4 text-base sm:text-lg">
            <span className="capitalize">{APP_NAME}</span> components are
            written in TypeScript.
            <br />
            <br />
            This guide will show you how to build the components and use the
            compiled JavaScript files in your Node.js project.
            <br />
            <br />
            This guide is intended for developers who use JavaScript and are not
            familiar with TypeScript.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleContinue}>Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
