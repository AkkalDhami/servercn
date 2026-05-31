import type { FrameworkType, RuntimeType } from "@/types";

export function getMessage({
  slug,
  framework,
  runtime
}: {
  slug: string;
  framework: FrameworkType;
  runtime: RuntimeType;
}) {
  if (runtime === "node" && framework === "nextjs") {
    switch (slug) {
      case "oauth":
        return `
The 'google-auth' component has been added. Remember to wrap your app with the 'SessionProvider' component.

---title="app/layout.tsx"
import { SessionProvider } from "@/components/providers/session-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
---
`;
        break;

      default:
        break;
    }
  }
}
