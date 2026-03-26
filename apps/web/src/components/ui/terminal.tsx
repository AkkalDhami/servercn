"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import CopyButton from "@/components/docs/copy-button";

function useInView(ref: React.RefObject<HTMLElement | null>, once = true) {
  const [inView, setInView] = useState(false);
  const triggered = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || (once && triggered.current)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered.current) {
          setInView(true);
          if (once) {
            triggered.current = true;
            observer.disconnect();
          }
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, once]);

  return inView;
}

interface TerminalLine {
  type: "command" | "output";
  content: string;
}

export interface TerminalProps {
  commands: string[];
  outputs?: Record<number, string[]>;
  command?: string;
  className?: string;
  containerClassName?: string;
  typingSpeed?: number;
  delayBetweenCommands?: number;
  initialDelay?: number;
}

export function Terminal({
  commands = ["npx servercn-cli init"],
  outputs = {},
  command = "npx servercn-cli init",
  className,
  typingSpeed = 50,
  delayBetweenCommands = 800,
  containerClassName,
  initialDelay = 500
}: TerminalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef);

  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [currentText, setCurrentText] = useState("");
  const [commandIdx, setCommandIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [outputIdx, setOutputIdx] = useState(-1);
  const [phase, setPhase] = useState<
    "idle" | "typing" | "executing" | "outputting" | "pausing" | "done"
  >("idle");
  const [, setCursorVisible] = useState(true);

  const [copied, setCopied] = useState<boolean>(false);
  const inputRef = useRef<HTMLDivElement>(null);

  const handleCopy = () => {
    if (inputRef.current) {
      navigator.clipboard.writeText(inputRef.current.innerText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const currentCommand = commands[commandIdx] || "";
  const currentOutputs = useMemo(
    () => outputs[commandIdx] || [],
    [outputs, commandIdx]
  );
  const isLastCommand = commandIdx === commands.length - 1;

  useEffect(() => {
    if (!inView || phase !== "idle") return;
    const t = setTimeout(() => setPhase("typing"), initialDelay);
    return () => clearTimeout(t);
  }, [inView, phase, initialDelay]);

  useEffect(() => {
    if (phase !== "typing") return;

    if (charIdx < currentCommand.length) {
      const t = setTimeout(
        () => {
          setCurrentText(currentCommand.slice(0, charIdx + 1));
          setCharIdx(c => c + 1);
        },
        typingSpeed + Math.random() * 30
      );
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setPhase("executing");
      }, 80);
      return () => clearTimeout(t);
    }
  }, [phase, charIdx, currentCommand, typingSpeed]);

  useEffect(() => {
    if (phase !== "executing") return;

    const updateLines = () => {
      setLines(prev => [...prev, { type: "command", content: currentCommand }]);
      setCurrentText("");
    };

    // Use requestAnimationFrame to defer state update
    requestAnimationFrame(updateLines);

    requestAnimationFrame(() => {
      if (currentOutputs.length > 0) {
        setOutputIdx(0);

        setPhase("outputting");
      } else if (isLastCommand) {
        setPhase("done");
      } else {
        setPhase("pausing");
      }
    });
  }, [phase, currentCommand, currentOutputs.length, isLastCommand]);

  useEffect(() => {
    if (phase !== "outputting") return;

    if (outputIdx >= 0 && outputIdx < currentOutputs.length) {
      const t = setTimeout(() => {
        setLines(prev => [
          ...prev,
          { type: "output", content: currentOutputs[outputIdx] }
        ]);
        setOutputIdx(i => i + 1);
      }, 150);
      return () => clearTimeout(t);
    } else if (outputIdx >= currentOutputs.length) {
      const t = setTimeout(() => {
        if (isLastCommand) {
          setPhase("done");
        } else {
          setPhase("pausing");
        }
      }, 300);
      return () => clearTimeout(t);
    }
  }, [phase, outputIdx, currentOutputs, isLastCommand]);

  useEffect(() => {
    if (phase !== "pausing") return;
    const t = setTimeout(() => {
      setCharIdx(0);
      setOutputIdx(-1);
      setCommandIdx(c => c + 1);
      setPhase("typing");
    }, delayBetweenCommands);
    return () => clearTimeout(t);
  }, [phase, delayBetweenCommands]);

  useEffect(() => {
    const interval = setInterval(() => setCursorVisible(v => !v), 530);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [lines, phase]);

  const prompt = <span className="text-muted-primary">$ </span>;

  return (
    <div
      ref={containerRef}
      className={cn(
        "mx-auto w-full px-4 font-mono text-sm sm:text-base",
        className
      )}>
      <div className="border-edge bg-background overflow-hidden rounded-lg border">
        {/* Title Bar */}
        <div className="flex items-center justify-between gap-2 px-4 py-3">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500 transition-colors hover:bg-red-600" />
            <div className="h-3 w-3 rounded-full bg-yellow-500 transition-colors hover:bg-yellow-600" />
            <div className="h-3 w-3 rounded-full bg-green-500 transition-colors hover:bg-green-600" />
          </div>

          <div className="flex items-center gap-2">
            <p
              ref={inputRef}
              className={cn(
                "text-muted-secondary font-mono text-base",
                "group-hover:text-accent-foreground duration-200",
                copied && "text-accent-foreground"
              )}>
              {command}
            </p>
            <CopyButton
              handleCopy={handleCopy}
              copied={copied}
              className="group-hover:text-accent-foreground relative"
            />
          </div>
        </div>

        {/* Terminal Content */}
        <div
          ref={contentRef}
          className={cn(
            "no-visible-scrollbar min-h-60 overflow-y-auto p-4 font-mono",
            containerClassName
          )}>
          {lines.map((line, i) => (
            <div key={i} className="leading-relaxed whitespace-pre-wrap">
              {line.type === "command" ? (
                <span className="text-primary">
                  {prompt}
                  <span className="text-primary">{line.content}</span>
                </span>
              ) : (
                <span className="text-muted-foreground">{line.content}</span>
              )}
            </div>
          ))}

          {phase === "typing" && (
            <div className="leading-relaxed whitespace-pre-wrap">
              {prompt} <span className="text-primary">{currentText}</span>
              <span className="bg-primary ml-0.5 inline-block h-4 w-2 align-middle" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
