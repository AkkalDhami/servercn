import type { MDXComponents } from "mdx/types";
import { Pre } from "./pre";

import PackageManagerTabs from "./package-manager-tabs";
import FileTree from "@/components/file-viewer/file-tree";
import BackendStructureViewer from "@/components/file-viewer/backend-structure-viewer";
import Code from "./custom-code";
import Note from "./note";
import LNote from "./list-note";
import Warning from "./warning";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getIconForLanguageExtension } from "./icons/language-icons";
import { Table, THead, TBody, TR, TH, TD } from "./table";
import { Method, Endpoint, Auth } from "./api-table";
import { JSGuideVideo } from "@/components/home/js-guide-video";

export const mdxComponents: MDXComponents = {
  pre: Pre,
  FileTree,
  PackageManagerTabs,
  BackendStructureViewer,
  Code,
  Note,
  LNote,
  Warning,
  JSGuideVideo,

  Table,
  THead,
  TBody,
  TR,
  TH,
  TD,

  Method,
  Endpoint,
  Auth,
  h1: props => (
    <h1 className="text-3xl font-semibold tracking-tight" {...props} />
  ),
  h2: props => (
    <h2 className="mt-5 mb-4 text-2xl font-medium tracking-tight" {...props} />
  ),
  h3: props => (
    <h3
      className="this-page-link my-3 text-[22px] font-normal tracking-tight"
      {...props}
    />
  ),
  h4: props => (
    <h4 className="my-3 text-xl font-normal tracking-tight" {...props} />
  ),
  h5: props => (
    <h5 className="my-2.5 text-lg font-normal tracking-tight" {...props} />
  ),
  p: ({ className, ...props }) => (
    <p
      className={cn(
        "text-muted-primary mt-4 mb-3 leading-relaxed not-first:mt-4",
        className
      )}
      {...props}
    />
  ),
  figure: ({ className, ...props }: React.ComponentProps<"figure">) => {
    return <figure className={cn(className)} {...props} />;
  },
  figcaption: ({
    className,
    children,
    ...props
  }: React.ComponentProps<"figcaption">) => {
    const iconExtension =
      "data-language" in props && typeof props["data-language"] === "string"
        ? getIconForLanguageExtension(props["data-language"])
        : null;

    return (
      <figcaption
        className={cn(
          "text-code-foreground text-muted-primary font-code [&_svg]:text-code-foreground border-edge flex items-center gap-2 border-b px-3 py-2 text-base [&_svg]:size-4 [&_svg]:opacity-100",
          className
        )}
        {...props}>
        {iconExtension}
        {children}
      </figcaption>
    );
  },
  code: ({ className, ...props }) => (
    <code
      className={cn(
        "thin-scrollbar max-h-120 overflow-x-auto px-0 py-2.5 font-mono leading-relaxed",
        className
      )}
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
  li: props => (
    <li className="text-muted-primary first:mt-2 mb-3 space-y-3 pl-2" {...props} />
  ),
  ul: props => (
    <ul
      className="text-muted-primary mb-3 list-disc space-y-3 pl-2"
      {...props}
    />
  ),
  ol: props => (
    <ol
      className="text-muted-primary mb-3 list-decimal space-y-3 pl-2"
      {...props}
    />
  ),
  strong: props => <strong className="text-primary" {...props} />,
  blockquote: ({ className, ...props }: React.ComponentProps<"blockquote">) => (
    <blockquote
      className={cn(
        "mt-6 border-l-2 border-l-neutral-500 pl-4 font-mono",
        className
      )}
      {...props}
    />
  ),
  Step: ({ className, ...props }: React.ComponentProps<"h3">) => (
    <h3
      className={cn(
        "mt-4 mb-3 scroll-m-32 text-[19px] font-medium tracking-tight",
        className
      )}
      {...props}
    />
  ),
  Steps: ({ className, ...props }: React.ComponentProps<"div">) => (
    <div
      className={cn(
        "[&>h3]:step steps relative mb-12 w-fit [counter-reset:step] md:ml-2 md:border-l md:pl-8",
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
        "text-muted-foreground data-[state=active]:text-primary data-[state=active]:border-primary dark:data-[state=active]:border-primary hover:text-primary rounded-none border-0 border-b-2 border-transparent bg-transparent px-0 pb-4 text-base font-medium data-[state=active]:bg-transparent data-[state=active]:shadow-none! dark:data-[state=active]:bg-transparent",
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
