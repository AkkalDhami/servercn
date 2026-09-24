import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import PackageManagerTabs from "./package-manager-tabs";
import FileTree from "@/components/file-viewer/file-tree";
import BackendStructureViewer from "@/components/file-viewer/backend-structure-viewer";
import { Pre } from "./pre";
import Code from "./custom-code";
import Note from "./note";
import LNote from "./list-note";
import Warning from "./warning";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { getIconForLanguageExtension } from "./icons/language-icons";
import { Table, THead, TBody, TR, TH, TD } from "./table";
import { Method, Endpoint, Auth } from "./api-table";
import { JSGuideVideo } from "@/components/home/js-guide-video";
import ComponentFileViewer from "@/components/file-viewer";
import React from "react";

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
  ComponentFileViewer,

  Table,
  THead,
  TBody,
  TR,
  TH,
  TD,

  Method,
  Endpoint,
  Auth,
  // h1: props => (
  //   <h1 className="text-3xl font-semibold tracking-tight" {...props} />
  // ),
  // h2: props => (
  //   <h2 className="mt-5 mb-4 text-2xl font-medium tracking-tight" {...props} />
  // ),
  // h3: props => (
  //   <h3
  //     className="this-page-link my-3 text-[22px] font-normal tracking-tight"
  //     {...props}
  //   />
  // ),
  // h4: props => (
  //   <h4 className="my-3 text-xl font-normal tracking-tight" {...props} />
  // ),
  // h5: props => (
  //   <h5 className="my-2.5 text-lg font-normal tracking-tight" {...props} />
  // ),

  h1: ({ children, id, ...props }: React.ComponentProps<"h1">) => {
    const headingId = id ?? getHeadingId(children);

    return (
      <h1 id={headingId} {...props}>
        <HeadingAnchor id={headingId}>{children}</HeadingAnchor>
      </h1>
    );
  },
  h2: ({ children, id, ...props }: React.ComponentProps<"h2">) => {
    const headingId = id ?? getHeadingId(children);

    return (
      <h2 id={headingId} {...props}>
        <HeadingAnchor id={headingId}>{children}</HeadingAnchor>
      </h2>
    );
  },
  h3: ({ children, id, ...props }: React.ComponentProps<"h3">) => {
    const headingId = id ?? getHeadingId(children);

    return (
      <h3 id={headingId} {...props}>
        <HeadingAnchor id={headingId}>{children}</HeadingAnchor>
      </h3>
    );
  },
  h4: ({ children, id, ...props }: React.ComponentProps<"h4">) => {
    const headingId = id ?? getHeadingId(children);

    return (
      <h4 id={headingId} {...props}>
        <HeadingAnchor id={headingId}>{children}</HeadingAnchor>
      </h4>
    );
  },
  h5: ({ children, id, ...props }: React.ComponentProps<"h5">) => {
    const headingId = id ?? getHeadingId(children);

    return (
      <h5 id={headingId} {...props}>
        <HeadingAnchor id={headingId}>{children}</HeadingAnchor>
      </h5>
    );
  },
  h6: ({ children, id, ...props }: React.ComponentProps<"h6">) => {
    const headingId = id ?? getHeadingId(children);

    return (
      <h6 id={headingId} {...props}>
        <HeadingAnchor id={headingId}>{children}</HeadingAnchor>
      </h6>
    );
  },

  p: ({ className, ...props }) => (
    <p className={cn("text-muted-primary", className)} {...props} />
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
          "text-code-foreground text-muted-primary font-code [&_svg]:text-code-foreground border-neutral-500/10 flex items-center gap-2 border-b px-3 py-2 text-base [&_svg]:size-4 [&_svg]:opacity-100",
          className
        )}
        {...props}>
        {iconExtension}
        {children}
      </figcaption>
    );
  },
  // code: ({ className, ...props }) => (
  //   <code
  //     className={cn(
  //       "thin-scrollbar max-h-120 overflow-x-auto px-0 py-2.5 font-mono leading-relaxed",
  //       className
  //     )}
  //     {...props}
  //   />
  // ),
  code: ({ className, ...props }) => {
    return (
      <code
        className={cn(
          "thin-scrollbar animate-fade-in-blur scroll-fade-y max-h-120 overflow-x-auto rounded-none py-2.5 font-mono text-base leading-relaxed sm:text-base",
          className
        )}
        {...props}
      />
    );
  },
  a: props => (
    <a
      target="_blank"
      className="text-muted-primary hover:text-foreground font-medium underline underline-offset-1"
      {...props}
    />
  ),
  strong: props => <strong className="text-primary" {...props} />,
  blockquote: ({ className, ...props }: React.ComponentProps<"blockquote">) => (
    <blockquote
      className={cn(
        "mt-6 border-l-2 border-l-neutral-500 pl-4",
        className
      )}
      {...props}
    />
  ),
  Step: (props: React.ComponentProps<"h3">) => <h3 {...props} />,
  Steps: ({ className, ...props }: React.ComponentProps<"div">) => (
    <div
      className={cn(
        "steps [&>h3]:step mb-12 [counter-reset:step] md:ml-4 md:border-l md:pl-8",
        className
      )}
      {...props}
    />
  ),

  Image: ({
    src,
    className,
    width,
    height,
    alt,
    ...props
  }: React.ComponentProps<"img">) => (
    <Image
      className={cn("mt-6 rounded-2xl border", className)}
      src={(src as string) || ""}
      width={Number(width)}
      height={Number(height)}
      alt={alt || ""}
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
        "text-muted-foreground data-[state=active]:text-primary data-[state=active]:border-primary dark:data-[state=active]:border-primary hover:text-primary data-[state=active]:[&_p]:text-accent-foreground! hover:[&_p]:text-primary! rounded-none border-0 border-b-2 border-transparent bg-transparent px-0 pb-6 text-base font-medium data-[state=active]:bg-transparent data-[state=active]:shadow-none! dark:data-[state=active]:bg-transparent",
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
        "relative my-2 [&_h3.font-heading]:text-base *:[figure]:first:mt-0",
        className
      )}
      {...props}
    />
  ),
  Tab: ({ className, ...props }: React.ComponentProps<"div">) => (
    <div className={cn(className)} {...props} />
  ),
  Accordion: ({
    className,
    ...props
  }: React.ComponentProps<typeof Accordion>) => (
    <Accordion className={cn("not-typeset", className)} {...props} />
  ),
  AccordionContent,
  AccordionItem,
  AccordionTrigger
};

function getNodeText(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(child => getNodeText(child)).join("");
  }

  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return getNodeText(node.props.children);
  }

  return "";
}

function getHeadingId(children: React.ReactNode) {
  const id = getNodeText(children)
    .trim()
    .replace(/\s+/g, "-")
    .replace(/'/g, "")
    .replace(/\?/g, "")
    .toLowerCase();

  return id || undefined;
}

function HeadingAnchor({
  id,
  children
}: {
  id?: string;
  children: React.ReactNode;
}) {
  if (!id) {
    return children;
  }

  return (
    <a className="group no-underline" href={`#${id}`}>
      <span className="underline-offset-4 group-hover:underline">
        {children}
      </span>
      <span
        aria-hidden="true"
        className="text-muted-foreground heading-anchor ml-2 opacity-0 group-hover:opacity-100">
        #
      </span>
    </a>
  );
}
