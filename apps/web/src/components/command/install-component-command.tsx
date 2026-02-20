"use client";
import { cn } from "@/lib/utils";
import {
  AnimatedSpan,
  Terminal,
  TypingAnimation
} from "@/components/ui/terminal";

const files = [
  "src/app.ts",
  "src/configs/env.ts",
  "src/configs/passport.ts",
  "src/constants/status-codes.ts",
  "src/controllers/auth.controller.ts",
  "src/middlewares/error-handler.ts",
  "src/middlewares/not-found-handler.ts",
  "src/routes/auth.routes.ts",
  "src/utils/api-error.ts",
  "src/utils/api-response.ts",
  "src/utils/async-handler.ts",
  "src/utils/logger.ts"
];

export default function InstallComponentCommands({
  className
}: {
  className?: string;
}) {
  return (
    <div className={cn("h-full", className)}>
      <Terminal className="mx-auto h-full min-h-140 min-w-xl text-sm sm:text-lg">
        <TypingAnimation className="text-sm sm:text-lg">
          &gt; npx servercn-cli add google-oauth
        </TypingAnimation>

        {files.map((file, index) => (
          <AnimatedSpan key={index} delay={index * 50} className="text-sm">
            <p>Created: {file}</p>
          </AnimatedSpan>
        ))}

        <TypingAnimation className="text-sm text-green-600 sm:text-lg">
          Success! Component Google OAuth added successfully
        </TypingAnimation>
      </Terminal>
    </div>
  );
}
