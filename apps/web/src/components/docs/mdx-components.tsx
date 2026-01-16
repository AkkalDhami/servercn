import type { MDXComponents } from "mdx/types";
import { Pre } from "./pre";

import PackageManagerTabs from "./package-manager-tabs";
import FileTree from "../file-viewer/file-tree";
import BackendStructureViewer from "../file-viewer/backend-structure-viewer";
import Code from "./custom-code";
import Note from "./note";
import Warning from "./warning";

export const mdxComponents: MDXComponents = {
  pre: Pre,
  FileTree,
  PackageManagerTabs,
  BackendStructureViewer,
  Code,
  Note,
  Warning,
  h1: props => <h1 className="text-3xl font-bold tracking-tight" {...props} />,
  h2: props => <h2 className="mt-8 mb-4 text-2xl font-semibold tracking-tight" {...props} />,
  h3: props => <h3 className="this-page-link mt-4 mb-4 text-xl font-medium tracking-tight" {...props} />,
  h4: props => <h4 className="mt-4 mb-4 text-sm font-medium tracking-tight" {...props} />,
  p: props => <p className="text-muted-primary mt-4 mb-3 leading-7" {...props} />,
  code: props => <code className="bg-muted rounded px-1.5 py-0.5" {...props} />,
  a: props => <a target="_blank" className="text-muted-primary hover:text-foreground font-medium underline underline-offset-1" {...props} />,
  ul: props => <ul className="text-muted-primary list-disc space-y-3 pl-2" {...props} />,
  ol: props => <ol className="text-muted-primary list-decimal space-y-3 pl-2" {...props} />
};
