import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import matter from "gray-matter";
import { mdxComponents } from "@/components/docs/mdx-components";
import rehypePrettyCode from "rehype-pretty-code";
import { PRIMRY_CODE_BLOCK_THEME } from "@/components/docs/code-block";
import { OnThisPage } from "@/components/docs/on-this-page";
import type { FileNode } from "@/components/file-viewer/file-tree";
import BackendStructureViewer from "@/components/file-viewer/backend-structure-viewer";
import ArchitectureTabs from "@/components/docs/architecture-tabs";
import PackageManagerTabs from "@/components/docs/package-manager-tabs";
import { Metadata } from "next";
import { findNeighbour, IRegistryItems } from "@/lib/source";
import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

// export const revalidate = false;
// export const dynamic = "force-static";
// export const dynamicParams = false;

const DOCS_PATH = path.join(process.cwd(), "src/content/docs");

export async function generateStaticParams() {
  const files = fs.readdirSync(DOCS_PATH);
  return files.map((file) => {
    file;
    const slug = file.split(".")[0].split("/").filter(Boolean);
    return { slug };
  });
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const filePath = getDocPath(params.slug);

  if (!fs.existsSync(filePath)) {
    return {
      title: "Not Found · ServerCN Docs",
    };
  }

  const source = fs.readFileSync(filePath, "utf8");
  const { data } = matter(source);
  console.log(data);
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
      url: `/docs/${params.slug}`,
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
    dark: PRIMRY_CODE_BLOCK_THEME,
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
  }
  return path.join(DOCS_PATH, `${slug.join("/")}.mdx`);
}

export default async function DocsPage(props: {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ arch?: string }>;
}) {
  const params = await props.params;
  const filePath = getDocPath(params.slug);
  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const { next, prev } = findNeighbour(
    params.slug[params.slug.length - 1] as string
  );

  const currentArch = await props.searchParams;
  if (!currentArch.arch) {
    currentArch.arch = "mvc";
  }
  const source = fs.readFileSync(filePath, "utf8");
  const { content, data } = matter(source);

  const mvcStructure = (data.mvc_structure as FileNode[]) || [];
  const featureStructure = (data.feature_structure as FileNode[]) || [];

  const currentArchStructure =
    currentArch.arch === "mvc" ? mvcStructure : featureStructure;

  return (
    <div className="flex max-w-6xl w-full gap-8 px-3 sm:p-0">
      <div className="flex-1">
        <article className="prose prose-neutral dark:prose-invert max-w-none [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 mb-6">
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
          {currentArchStructure && (
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
      <aside className="hidden shrink-0 xl:block min-w-56">
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
    <div className="mt-8 flex justify-between flex-wrap gap-4">
      {prev && (
        <Link
          href={`${prev.docs}`}
          className="text-base bg-muted rounded-md px-3 py-1.5 font-medium flex items-center gap-2 text-muted-foreground hover:text-foreground">
          <ArrowLeftIcon className="size-4" />
          {prev.title}
        </Link>
      )}
      {next && (
        <Link
          href={`${next.docs}`}
          className="text-base bg-muted rounded-md px-3 py-1.5 font-medium flex items-center gap-2 text-muted-foreground hover:text-foreground">
          {next.title} <ArrowRightIcon className="size-4" />
        </Link>
      )}
    </div>
  );
};
