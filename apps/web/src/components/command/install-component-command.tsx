"use client";
import { cn } from "@/lib/utils";
import { Terminal } from "@/components/ui/terminal";


export default function InstallComponentCommands({
  className
}: {
  className?: string;
}) {
  return (
    <div className={cn("h-full", className)}>
      <Terminal
        command="npx servercn-cli add oauth"
        containerClassName="min-h-140"
        commands={[
          "npx servercn-cli add oauth",
          "? Select OAuth provider:\n> Google\n  GitHub"
        ]}
        outputs={{
          1: [
            "CREATE: src/app.ts",
            "CREATE: src/configs/env.ts",
            "CREATE: src/configs/passport.ts",
            "CREATE: src/constants/status-codes.ts",
            "CREATE: src/controllers/oauth.controller.ts",
            "CREATE: src/middlewares/error-handler.ts",
            "CREATE: src/middlewares/not-found-handler.ts",
            "CREATE: src/routes/auth.routes.ts",
            "CREATE: src/utils/api-error.ts",
            "CREATE: src/utils/api-response.ts",
            "CREATE: src/utils/async-handler.ts",
            "CREATE: src/utils/logger.ts",
            "✔ Scaffolding files successfully!",
            "✔ Successfully installed 6 dependencies",
            "✔ Successfully installed 2 devDependencies",
            "✔ Env keys added to .env",
            "✔ OAuth component added successfully!"
          ]
        }}
        typingSpeed={45}
        delayBetweenCommands={1000}
      />
    </div>
  );
}
