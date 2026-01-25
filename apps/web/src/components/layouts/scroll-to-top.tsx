"use client";
import { ArrowUp } from "lucide-react";
import { motion } from "motion/react";
import React, { useEffect, useState } from "react";

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const handleOnclick = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
  };

  const watchScroll = () => {
    const hiddenHeight = 200;
    const winscroll =
      document.body.scrollTop || document.documentElement.scrollTop;

    if (winscroll > hiddenHeight) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", watchScroll);
    return () => window.removeEventListener("scroll", watchScroll);
  }, []);
  return (
    isVisible && (
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        onClick={handleOnclick}
        className="bg-primary hover:bg-primary/80 text-primary-foreground fixed right-4 bottom-3 z-40 cursor-pointer rounded-md p-3 duration-300">
        <ArrowUp className="size-4" />
      </motion.button>
    )
  );
}
