import type { MDXComponents } from "mdx/types";
import { Pre } from "./pre";

import PackageManagerTabs from "./package-manager-tabs";
import FileTree from "../file-viewer/file-tree";
import BackendStructureViewer from "../file-viewer/backend-structure-viewer";
import Code from "./custom-code";
import Note from "./note";
import LNote from "./list-note";
import Warning from "./warning";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export const mdxComponents: MDXComponents = {
  pre: Pre,
  FileTree,
  PackageManagerTabs,
  BackendStructureViewer,
  Code,
  Note,
  LNote,
  Warning,
  h1: props => <h1 className="text-3xl font-bold tracking-tight" {...props} />,
  h2: props => (
    <h2
      className="mt-8 mb-4 text-2xl font-semibold tracking-tight"
      {...props}
    />
  ),
  h3: props => (
    <h3
      className="this-page-link my-3.5 text-xl font-medium tracking-tight"
      {...props}
    />
  ),
  h4: props => (
    <h4 className="my-3.5 text-lg font-medium tracking-tight" {...props} />
  ),
  h5: props => (
    <h5 className="my-3 text-[17px] font-medium tracking-tight" {...props} />
  ),
  p: props => (
    <p className="text-muted-primary mt-4 mb-3 leading-7" {...props} />
  ),
  code: props => (
    <code
      className="thin-scrollbar max-h-120 max-w-[400.5px] overflow-x-auto rounded-lg px-3 py-2.5 font-mono leading-relaxed sm:max-w-200"
      {...props}
    />
  ),
  a: props => (
    <a
      target="_blank"
      className="text-muted-primary hover:text-foreground font-medium underline underline-offset-1"
      {...props}
    />
  ),
  ul: props => (
    <ul className="text-muted-primary list-disc space-y-3 pl-2" {...props} />
  ),
  ol: props => (
    <ol className="text-muted-primary list-decimal space-y-3 pl-2" {...props} />
  ),
  strong: props => <strong className="text-primary" {...props} />,
  blockquote: ({ className, ...props }: React.ComponentProps<"blockquote">) => (
    <blockquote
      className={cn("mt-6 border-l-2 pl-6 italic", className)}
      {...props}
    />
  ),
  Step: ({ className, ...props }: React.ComponentProps<"h3">) => (
    <h3
      className={cn(
        "mt-8 scroll-m-32 text-lg font-medium tracking-tight",
        className
      )}
      {...props}
    />
  ),
  Steps: ({ className, ...props }: React.ComponentProps<"div">) => (
    <div
      className={cn(
        "[&>h3]:step steps mb-12 [counter-reset:step] md:ml-4 md:border-l md:pl-8",
        className
      )}
      {...props}
    />
  ),
  Tabs: ({ className, ...props }: React.ComponentProps<typeof Tabs>) => {
    return (
      <Tabs className={cn("relative mt-6 w-full", className)} {...props} />
    );
  },
  TabsList: ({
    className,
    ...props
  }: React.ComponentProps<typeof TabsList>) => (
    <TabsList
      className={cn(
        "justify-start gap-4 rounded-none bg-transparent px-0",
        className
      )}
      {...props}
    />
  ),
  TabsTrigger: ({
    className,
    ...props
  }: React.ComponentProps<typeof TabsTrigger>) => (
    <TabsTrigger
      className={cn(
        "text-muted-foreground data-[state=active]:text-foreground data-[state=active]:border-primary dark:data-[state=active]:border-primary hover:text-primary rounded-none border-0 border-b-2 border-transparent bg-transparent px-0 pb-3 text-base font-medium data-[state=active]:bg-transparent data-[state=active]:shadow-none! dark:data-[state=active]:bg-transparent",
        className
      )}
      {...props}
    />
  ),
  TabsContent: ({
    className,
    ...props
  }: React.ComponentProps<typeof TabsContent>) => (
    <TabsContent
      className={cn(
        "relative [&_h3.font-heading]:text-base [&_h3.font-heading]:font-medium *:[figure]:first:mt-0 [&>.steps]:mt-6",
        className
      )}
      {...props}
    />
  ),
  Tab: ({ className, ...props }: React.ComponentProps<"div">) => (
    <div className={cn(className)} {...props} />
  )
};
