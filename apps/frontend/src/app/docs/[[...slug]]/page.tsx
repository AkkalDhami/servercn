import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import matter from "gray-matter";
import { mdxComponents } from "@/components/docs/mdx-components";
import rehypePrettyCode from "rehype-pretty-code";
import { PRIMRY_CODE_BLACK_THEME } from "@/components/docs/code-block";
import { OnThisPage } from "@/components/docs/on-this-page";
import type { FileNode } from "@/components/file-viewer/file-tree";
import BackendStructureViewer from "@/components/file-viewer/backend-structure-viewer";
import ArchitectureTabs from "@/components/docs/architecture-tabs";
import PackageManagerTabs from "@/components/docs/package-manager-tabs";
import { Metadata } from "next";
import {
  findNeighbour,
  IRegistryItems,
  RESTRICTED_FOLDER_STRUCTURE_PAGES,
} from "@/lib/source";
import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

import registry from '@/data/registry.json';

export const revalidate = false;
export const dynamic = "force-static";
export const dynamicParams = false;

const DOCS_PATH = path.join(process.cwd(), "src/content/docs");

export async function generateStaticParams() {
  const registryParams = registry.items.map(({ docs }) => {
    const slugArray = docs.replace("/docs/", "").split("/").filter(Boolean);
    return { slug: slugArray };
  });

  // Include special routes
  const specialRoutes = [
    { slug: [] }, // Root/introduction
    { slug: ["introduction"] },
    { slug: ["components"] },
    { slug: ["installation"] },
    { slug: ["project-structure"] },
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
      title: "Not Found · ServerCN Docs",
    };
  }

  const source = fs.readFileSync(filePath, "utf8");
  const { data } = matter(source);
  return {
    title: data.title ?? "Documentation",
    description:
      data.description ??
      "ServerCN documentation for building modern Node.js backends.",
    openGraph: {
      title: data.title ?? "ServerCN Docs",
      description:
        data.description ??
        "ServerCN documentation for backend components and guides.",
      url: `/docs/${slug.length > 0 ? slug.join("/") : ""}`,
      siteName: "ServerCN",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: data.title ?? "ServerCN Docs",
      description: data.description ?? "ServerCN backend documentation.",
    },
  };
}

const prettyCodeOptions = {
  theme: {
    dark: PRIMRY_CODE_BLACK_THEME,
    light: "github-dark-high-contrast",
  },
  keepBackground: true,
  defaultLang: "plaintext",
  grid: true,
  lineNumbers: true,
  defaultLanguage: "ts",
};

function getDocPath(slug?: string[]) {
  if (!slug || slug.length === 0 || slug[0] === "introduction") {
    return path.join(DOCS_PATH, "guides", "getting-started.mdx");
  } else if (slug.length === 1 && slug[0] === "components") {
    return path.join(DOCS_PATH, "guides", `${slug[0]}.mdx`);
  } else if (slug.length === 1 && slug[0] === "installation") {
    return path.join(DOCS_PATH, "guides", "installation.mdx");
  } else if (slug.length === 1 && slug[0] === "project-structure") {
    return path.join(DOCS_PATH, "guides", "project-structure.mdx");
  }
  return path.join(DOCS_PATH, `${slug.join("/")}.mdx`);
}

export default async function DocsPage(props: {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<{ arch?: string }>;
}) {
  const params = await props.params;
  const slug = params.slug ?? [];

  const filePath = getDocPath(slug);
  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const lastComponentIndex = slug.length > 0 ? slug.length - 1 : -1;
  const lastSlug = lastComponentIndex >= 0 ? slug[lastComponentIndex] : undefined;

  const { next, prev } = lastSlug ? findNeighbour(lastSlug as string) : { next: undefined, prev: undefined };

  const currentArch = await props.searchParams;
  if (!currentArch.arch) {
    currentArch.arch = "mvc";
    console.log({ currentArch });
  }

  const source = fs.readFileSync(filePath, "utf8");
  const { content, data } = matter(source);

  const mvcStructure = (data.mvc_structure as FileNode[]) || [];
  const featureStructure = (data.feature_structure as FileNode[]) || [];

  const currentArchStructure =
    currentArch.arch === "mvc" ? mvcStructure : featureStructure;

  console.log({ currentArch });

  return (
    <div className="flex w-full max-w-6xl gap-8 px-3 sm:p-0">
      <div className="flex-1">
        <article className="prose prose-neutral dark:prose-invert mb-6 max-w-none [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6">
          <MDXRemote
            source={content}
            components={mdxComponents}
            options={{
              mdxOptions: {
                rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]],
              },
            }}
          />
        </article>
        <div>
          {currentArchStructure &&
            lastSlug &&
            !RESTRICTED_FOLDER_STRUCTURE_PAGES.includes(
              lastSlug,
            ) && (
              <>
                <h2 className="mt-8 text-2xl font-semibold tracking-tight">
                  File &amp; Folder Structure
                </h2>
                <ArchitectureTabs current={currentArch.arch || "mvc"} />
                <BackendStructureViewer
                  structure={
                    currentArch.arch === "mvc" ? mvcStructure : featureStructure
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
      <aside className="no-scrollbar sticky top-20 hidden max-h-[calc(100vh-2rem)] min-w-56 shrink-0 overflow-y-auto xl:block">
        <OnThisPage />
      </aside>
    </div>
  );
}

const NextSteps = ({
  next,
  prev,
}: {
  next?: IRegistryItems;
  prev?: IRegistryItems;
}) => {
  return (
    <div className="mt-8">
      {prev && (
        <div className="flex items-center justify-start">
          <Link
            href={`${prev.docs}`}
            className="bg-muted text-muted-foreground hover:text-foreground flex items-center gap-2 rounded-md px-3 py-1.5 text-base font-medium"
          >
            <ArrowLeftIcon className="size-4" />
            {prev.title}
          </Link>
        </div>
      )}
      {next && (
        <div className="flex items-center justify-end">
          <Link
            href={`${next.docs}`}
            className="bg-muted text-muted-foreground hover:text-foreground flex items-center gap-2 rounded-md px-3 py-1.5 text-base font-medium"
          >
            {next.title} <ArrowRightIcon className="size-4" />
          </Link>
        </div>
      )}
    </div>
  );
};
