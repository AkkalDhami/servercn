"use client";
import React, { SVGProps, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { cn } from "@/lib/utils";

export const StickyBanner = ({
  className,
  children
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(true);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", latest => {
    setOpen(latest === 0);
  });

  return (
    <motion.div
      className={cn(
        "sticky inset-x-0 top-0 z-40 min-h-14 w-full items-center justify-center bg-transparent px-4 py-1",
        open ? "flex flex-col gap-4" : "hidden",
        className
      )}
      initial={{
        y: -100,
        opacity: 0
      }}
      animate={{
        y: open ? 0 : -100,
        opacity: open ? 1 : 0
      }}
      transition={{
        duration: 0.25,
        ease: "easeInOut"
      }}>
      {children}

      <button
        className="absolute top-1/2 right-2 -translate-y-1/2"
        onClick={() => setOpen(false)}>
        <CloseIcon className="h-5 w-5 text-white" />
      </button>
    </motion.div>
  );
};

const CloseIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}>
    <path d="M18 6 6 18" />
    <path d="M6 6 18 18" />
  </svg>
);
