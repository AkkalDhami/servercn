import { Heading } from "../ui/heading";
import { SubHeading } from "../ui/sub-heading";
import React from "react";
import { AnimatedSpan, Terminal, TypingAnimation } from "../ui/terminal";

export default function Working() {
  return (
    <section id="feature" className="py-20">
      <div className="w-full">
        <div className="mb-12 text-center">
          <Heading className="text-3xl font-bold">
            Initialize Once. Decide Intentionally.
          </Heading>
          <SubHeading className="text-muted-foreground mt-4">
            ServerCN configures your backend around your architecture, stack,
            and conventions—right from the start.
          </SubHeading>
          <p className="text-muted-foreground mt-3 text-sm">
            ServerCN configures your project. It does not generate or own your
            application.
          </p>
        </div>

        <div className="w-full">
          <Terminal className="mx-auto max-h-150 max-w-2xl text-lg">
            <TypingAnimation className="text-xl">
              &gt; npx servercn init
            </TypingAnimation>

            <AnimatedSpan>
              ✔ Project root directory:{" "}
              <span className="text-muted-primary">my-app</span>
            </AnimatedSpan>
            <AnimatedSpan>
              ✔ Source directory:{" "}
              <span className="text-muted-primary">src</span>
            </AnimatedSpan>
            <AnimatedSpan>
              ✔ Architecture selected:{" "}
              <span className="text-muted-primary">MVC</span>
            </AnimatedSpan>
            <AnimatedSpan>
              ✔ Language selected:{" "}
              <span className="text-muted-primary">TypeScript</span>
            </AnimatedSpan>
            <AnimatedSpan>
              ✔ Backend framework selected:{" "}
              <span className="text-muted-primary">Express</span>
            </AnimatedSpan>
            <AnimatedSpan>
              ✔ Database selected:{" "}
              <span className="text-muted-primary">MongoDB</span>
            </AnimatedSpan>
            <AnimatedSpan>
              ✔ ODM selected:{" "}
              <span className="text-muted-primary">Mongoose</span>
            </AnimatedSpan>
            <AnimatedSpan>
              ✔ Package manager selected:{" "}
              <span className="text-muted-primary">npm</span>
            </AnimatedSpan>
            <AnimatedSpan>
              ✔ File & function naming conventions applied
            </AnimatedSpan>

            <TypingAnimation className="text-lg text-green-600">
              Success! ServerCN initialized successfully.
            </TypingAnimation>
            <TypingAnimation className="text-muted-primary text-lg">
              You may now add components by running:
            </TypingAnimation>
            <TypingAnimation className="text-muted-primary text-lg">
              &gt; npx servercn add &lt;component&gt;
            </TypingAnimation>
          </Terminal>
        </div>
      </div>
    </section>
  );
}
