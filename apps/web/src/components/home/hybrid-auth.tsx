"use client";

import { Heading } from "@/components/ui/heading";
import { SubHeading } from "@/components/ui/sub-heading";
import { Section } from "@/components/ui/section";
import { Terminal } from "@/components/ui/terminal";
import { cn } from "@/lib/utils";
import ComponentFileViewer from "../file-viewer";
export default function HybridAuthSection() {
  return (
    <Section id="hybrid-auth-section" className="">
      <div className="mb-12 text-center">
        <Heading className="text-3xl font-bold">Hybrid Authentication</Heading>
        <SubHeading className="text-muted-foreground mt-4">
          MongoDB implementation of hybrid authentication using Mongoose for
          users and Redis for session tracking and refresh token rotation.
        </SubHeading>
      </div>

      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-5">
        <div className="col-span-2 h-full min-h-144">
          <Terminal
            command="npx servercn-cli add bp hybrid-auth"
            containerClassName={cn("min-h-144 h-full")}
            commands={["npx servercn-cli add bp hybrid-auth"]}
            outputs={{
              0: [
                "src/services/otp.service.ts",
                "src/services/oauth.service.ts",
                "src/services/auth.service.ts",
                "src/routes/oauth.routes.ts",
                "src/routes/index.ts",
                "src/routes/auth.routes.ts",
                "src/helpers/token.helpers.ts",
                "src/helpers/cookie.helper.ts",
                "src/helpers/auth.helpers.ts",
                "src/models/user.model.ts",
                "src/middlewares/verify-auth.ts",
                "src/middlewares/validate-request.ts",
                "src/middlewares/upload-file.ts",
                "src/middlewares/security-header.ts",
                "src/middlewares/rate-limiter.ts",
                "src/middlewares/not-found-handler.ts",
                "src/middlewares/error-handler.ts",
                "Scaffolding files successfully!",
                "✔ Successfully installed dependencies",
                "✔ Successfully installed devDependencies",
                "✔ Blueprint: hybrid-auth added successfully"
              ]
            }}
            typingSpeed={45}
            delayBetweenCommands={1000}
          />
        </div>
        <div className="col-span-3">
          <ComponentFileViewer
            from="structure"
            slug={"hybrid-auth"}
            architecture={"feature"}
            framework={"express"}
            type={"blueprint"}
          />
        </div>
      </div>
    </Section>
  );
}
