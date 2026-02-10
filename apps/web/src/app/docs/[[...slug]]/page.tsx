import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import matter from "gray-matter";
import { mdxComponents } from "@/components/docs/mdx-components";
import rehypePrettyCode from "rehype-pretty-code";
import { cookies } from "next/headers";
import { COOKIE_THEME_KEY, DEFAULT_CODE_THEME } from "@/lib/constants";
import { OnThisPage } from "@/components/docs/on-this-page";
import type { FileNode } from "@/components/file-viewer/file-tree";
import BackendStructureViewer from "@/components/file-viewer/backend-structure-viewer";
import ArchitectureTabs from "@/components/docs/architecture-tabs";
import PackageManagerTabs from "@/components/docs/package-manager-tabs";
import { Metadata, Route } from "next";
import { findNeighbour, RESTRICTED_FOLDER_STRUCTURE_PAGES } from "@/lib/source";
import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

import registry from "@/data/registry.json";
import { IRegistryItems } from "@/@types/registry";

export const revalidate = false;
export const dynamic = "force-dynamic";
export const dynamicParams = false;

const DOCS_PATH = path.join(process.cwd(), "src/content/docs");

export async function generateStaticParams() {
  const registryParams = registry.items.map(({ meta, docs }) => {
    const nestedSlugs =
      meta && (meta.databases || [])
        ? (meta.databases || []).map(({ slug }) => slug)
        : [];
    const slugArray = docs.replace("/docs/", "").split("/").filter(Boolean);
    return [...slugArray, ...nestedSlugs];
  });

  // Include special routes
  const specialRoutes = [
    { slug: [] },
    { slug: ["introduction"] },
    { slug: ["components"] },
    { slug: ["installation"] },
    { slug: ["project-structure"] }
  ];

  return [...specialRoutes, ...registryParams];
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const slug = params.slug ?? [];
  const filePath = getDocPath(slug);
  if (!fs.existsSync(filePath)) {
    return {
      title: "Not Found | ServerCN Docs"
    };
  }

  const source = fs.readFileSync(filePath, "utf8");
  const { data } = matter(source);
  return {
    title: data.title ?? "Documentation",
    description:
      data.description ??
      "ServerCN documentation for building modern Node.js backends.",
    keywords: data.keywords ?? [
      "ServerCN",
      "ServerCN Docs",
      "ServerCN Documentation",
      "ServerCN Backend",
      "ServerCN Backend Documentation"
    ],
    openGraph: {
      title: data.title ?? "ServerCN Docs",
      description:
        data.description ??
        "ServerCN documentation for backend components and guides.",
      url: `/docs/${slug.length > 0 ? slug.join("/") : ""}`,
      siteName: "ServerCN",
      type: "article",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "ServerCN Docs"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: data.title ?? "ServerCN Docs",
      description: data.description ?? "ServerCN backend documentation."
    }
  };
}

const getPrettyCodeOptions = (theme: string) => ({
  theme: {
    dark: theme,
    light: "github-dark-high-contrast"
  },
  keepBackground: true,
  defaultLang: "plaintext",
  grid: true,
  defaultLanguage: "ts"
});

function getDocPath(slug?: string[]) {
  if (!slug || slug.length === 0 || slug[0] === "introduction") {
    return path.join(DOCS_PATH, "guides", "getting-started.mdx");
  } else if (slug.length === 1 && slug[0] === "installation") {
    return path.join(DOCS_PATH, "guides", "installation.mdx");
  }

  if (slug.length === 2 && slug[0] === "schemas") {
    return path.join(DOCS_PATH, `${slug.join("/")}.mdx`);
  }

  return path.join(DOCS_PATH, `${slug.join("/")}.mdx`);
}

interface DocsSlugRouterProps {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DocsPage({
  params,
  searchParams
}: DocsSlugRouterProps) {
  const { slug = [] } = await params;
  const resolvedSearchParams = await searchParams;
  const currentArch = (resolvedSearchParams?.arch as string) ?? "mvc";

  const filePath = getDocPath(slug);
  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const lastComponentIndex = slug.length > 0 ? slug.length - 1 : -1;
  const lastSlug =
    lastComponentIndex >= 0 ? slug[lastComponentIndex] : undefined;

  const { next, prev } = lastSlug
    ? findNeighbour(lastSlug as string)
    : { next: undefined, prev: undefined };

  const source = fs.readFileSync(filePath, "utf8");
  const { content, data } = matter(source);

  const mvcStructure = (data.mvc_structure as FileNode[]) || [];
  const featureStructure = (data.feature_structure as FileNode[]) || [];

  const currentArchStructure =
    currentArch === "mvc" ? mvcStructure : featureStructure;

  const cookieStore = await cookies();
  const theme = cookieStore.get(COOKIE_THEME_KEY)?.value ?? DEFAULT_CODE_THEME;
  return (
    <div className="flex w-full max-w-5xl gap-8 sm:p-0 sm:px-3">
      <div id="docs-content" className="flex-1">
        <article className="prose prose-neutral dark:prose-invert mb-6 max-w-none [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6">
          <MDXRemote
            source={content}
            components={mdxComponents}
            options={{
              mdxOptions: {
                rehypePlugins: [[rehypePrettyCode, getPrettyCodeOptions(theme)]]
              }
            }}
          />
        </article>
        <div className="w-full overflow-x-auto">
          {(mvcStructure.length > 0 || featureStructure.length > 0) &&
            currentArchStructure &&
            lastSlug &&
            !RESTRICTED_FOLDER_STRUCTURE_PAGES.includes(lastSlug) && (
              <>
                <h2 className="mt-8 text-2xl font-semibold tracking-tight">
                  File &amp; Folder Structure
                </h2>
                <ArchitectureTabs current={currentArch || "mvc"} />
                <BackendStructureViewer
                  structure={
                    currentArch === "mvc" ? mvcStructure : featureStructure
                  }
                />
              </>
            )}
          {data.command && (
            <>
              <h2 className="mt-8 text-2xl font-semibold tracking-tight">
                Installation
              </h2>
              <PackageManagerTabs command={data.command} />
            </>
          )}
        </div>

        <div className="mt-14">
          <NextSteps next={next} prev={prev} />
        </div>
      </div>
      <aside className="no-scrollbar docs-content sticky top-20 hidden max-h-[calc(100vh-2rem)] min-w-64 shrink-0 overflow-y-auto xl:block">
        <OnThisPage />
      </aside>
    </div>
  );
}

const NextSteps = ({
  next,
  prev
}: {
  next?: IRegistryItems | undefined;
  prev?: IRegistryItems | undefined;
}) => {
  return (
    <div className="mt-8 flex items-center justify-between">
      {prev && (
        <div className="flex items-center justify-start">
          <Link
            href={`${prev.docs as Route}`}
            className="bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium duration-200 sm:py-1.5">
            <ArrowLeftIcon className="size-4" />
            <span className="hidden sm:inline">{prev.title}</span>
          </Link>
        </div>
      )}
      {next && (
        <div className="flex items-center justify-end">
          <Link
            href={`${next.docs as Route}`}
            className="bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium duration-200 sm:py-1.5">
            <span className="hidden sm:inline"> {next.title}</span>{" "}
            <ArrowRightIcon className="size-4" />
          </Link>
        </div>
      )}
    </div>
  );
};
