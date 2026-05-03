import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import matter from "gray-matter";
import { mdxComponents } from "@/components/docs/mdx-components";
import rehypePrettyCode from "rehype-pretty-code";
import { cookies } from "next/headers";
import { COOKIE_THEME_KEY, DEFAULT_CODE_THEME } from "@/lib/constants";
import { OpenInAi } from "@/components/docs/open-in-ai";
import ArchitectureTabs from "@/components/docs/architecture-tabs";
import PackageManagerTabs from "@/components/docs/package-manager-tabs";
import { Metadata, Route } from "next";
import {
  findNeighbour,
  FRAMEWORK_SECTIONS,
  injectFramework,
  RESTRICTED_FOLDER_STRUCTURE_PAGES
} from "@/lib/source";
import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import registry from "@/data/registry.json";
import { IRegistryItems, ItemType } from "@/@types/registry";
import { contributingGuides } from "@/lib/contributing";
import { FrameworkRedirect } from "@/components/docs/framework-redirect";
import { buttonVariants } from "@/components/ui/button";
import ComponentFileViewer from "@/components/file-viewer";
import { resolveRegistryItem } from "@/lib/resolver";
import { cn } from "@/lib/utils";

export const revalidate = false;
export const dynamic = "force-dynamic";
export const dynamicParams = false;

const DOCS_PATH = path.join(process.cwd(), "src/content/docs");

export async function generateStaticParams() {
  const registryParams = registry.items.flatMap(({ meta, docs }) => {
    const nestedSlugs =
      meta && (meta.databases || [])
        ? (meta.databases || []).map(({ slug }) => slug)
        : [];
    const slugArray = docs.replace("/docs/", "").split("/").filter(Boolean);
    const baseParams = [...slugArray, ...nestedSlugs];

    // Generate framework variants for framework-based sections
    const section = slugArray[0];
    if (FRAMEWORK_SECTIONS.includes(section)) {
      return [
        baseParams,
        ["express", ...baseParams],
        ["nestjs", ...baseParams]
      ];
    }

    return [baseParams];
  });

  const contributingParams = contributingGuides.map(({ docs }) => {
    const slugArray = docs.replace("/docs/", "").split("/").filter(Boolean);
    return slugArray;
  });

  const specialRoutes = [
    { slug: [] },
    { slug: ["introduction"] },
    { slug: ["cli"] },
    { slug: ["installation"] }
  ];

  return [...specialRoutes, ...registryParams, ...contributingParams];
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const slug = params.slug ?? [];
  const filePath = getDocPath(slug);
  if (!fs.existsSync(filePath)) {
    return {
      title: "Not Found | Servercn Docs"
    };
  }

  const source = fs.readFileSync(filePath, "utf8");
  const { data } = matter(source);
  return {
    title: data.title ?? "Documentation",
    description:
      data.description ??
      "Servercn documentation for building modern Node.js backends.",
    keywords: data.keywords ?? [
      "Servercn",
      "Servercn Docs",
      "Servercn Documentation",
      "Servercn Backend",
      "Servercn Backend Documentation"
    ],
    openGraph: {
      title: data.title ?? "Servercn Docs",
      description:
        data.description ??
        "Servercn documentation for backend components and guides.",
      url: `/docs/${slug.length > 0 ? slug.join("/") : ""}`,
      siteName: "Servercn",
      type: "article",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "Servercn Docs"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: data.title ?? "Servercn Docs",
      description: data.description ?? "Servercn backend documentation."
    }
  };
}

function getDocPath(slug?: string[]) {
  if (!slug || slug.length === 0 || slug[0] === "introduction") {
    return path.join(DOCS_PATH, "guides", "getting-started.mdx");
  } else if (slug.length === 1 && slug[0] === "installation") {
    return path.join(DOCS_PATH, "guides", "installation.mdx");
  }

  const actualSlug = slug;

  if (actualSlug.length === 2 && actualSlug[0] === "contributing") {
    return path.join(DOCS_PATH, `${actualSlug.join("/")}.mdx`);
  }

  if (actualSlug.length === 2 && actualSlug[0] === "schemas") {
    return path.join(DOCS_PATH, `${actualSlug.join("/")}.mdx`);
  }

  return path.join(DOCS_PATH, `${actualSlug.join("/")}.mdx`);
}

export default async function DocsPage({
  params,
  searchParams
}: PageProps<"/docs/[[...slug]]">) {
  const { slug = [] } = await params;
  const resolvedSearchParams = await searchParams;
  const filePath = getDocPath(slug);
  if (!fs.existsSync(filePath)) {
    notFound();
  }

  // Remove framework segment if present to get the actual content slug
  let actualSlug = slug;
  if (
    slug &&
    (slug[0] === "express" || slug[0] === "nestjs" || slug[0] === "nextjs")
  ) {
    actualSlug = slug.slice(1);
  }

  // Determine current architecture based on framework or URL param
  const currentArch =
    (resolvedSearchParams?.arch as string) ||
    (slug[0] === "nestjs"
      ? "modular"
      : slug[0] === "nextjs"
        ? "file-api"
        : "mvc");
  const lastComponentIndex = actualSlug.length > 0 ? actualSlug.length - 1 : -1;
  const lastSlug =
    lastComponentIndex >= 0 ? actualSlug[lastComponentIndex] : undefined;

  const { next, prev } = lastSlug
    ? findNeighbour(lastSlug as string)
    : { next: undefined, prev: undefined };

  const source = fs.readFileSync(filePath, "utf8");
  const { content, data } = matter(source);

  const cookieStore = await cookies();
  const theme = cookieStore.get(COOKIE_THEME_KEY)?.value ?? DEFAULT_CODE_THEME;

  // Extract current framework from URL if present
  const currentFramework =
    slug &&
    (slug[0] === "express" || slug[0] === "nestjs" || slug[0] === "nextjs")
      ? slug[0]
      : undefined;

  const {
    slug: blueprintSlug,
    database,
    orm,
    variant
  } = resolveRegistryItem(slug[slug.length - 1]);

  return (
    <>
      <FrameworkRedirect />
      <div className="flex w-full overflow-x-auto px-2">
        <div id="docs-content" className="flex-1">
          <article className="prose prose-neutral dark:prose-invert mb-4 max-w-none [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6">
            <div className="mb-6 flex items-center justify-between pt-6">
              <OpenInAi />

              <div className="flex items-center gap-2">
                <Link
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "primary-ring"
                  )}
                  href={
                    (prev
                      ? injectFramework(
                          prev.docs as string,
                          currentFramework || ""
                        )
                      : "") as Route
                  }>
                  <ArrowLeftIcon className="size-4" />
                </Link>
                <Link
                  href={
                    (next
                      ? injectFramework(
                          next.docs as string,
                          currentFramework || ""
                        )
                      : "") as Route
                  }
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "primary-ring"
                  )}>
                  <ArrowRightIcon className="size-4" />
                </Link>
              </div>
            </div>
            <MDXRemote
              source={content}
              components={mdxComponents}
              options={{
                mdxOptions: {
                  rehypePlugins: [
                    [
                      rehypePrettyCode,
                      {
                        theme: theme || "vesper",
                        defaultLang: {
                          block: "plaintext",
                          inline: "plaintext"
                        }
                      }
                    ]
                  ]
                }
              }}
            />
          </article>
          <div className="w-full overflow-x-auto">
            <div className="border-edge border-y py-4">
              {lastSlug &&
                FRAMEWORK_SECTIONS.includes(actualSlug[0]) &&
                !RESTRICTED_FOLDER_STRUCTURE_PAGES.includes(lastSlug) && (
                  <>
                    <h2 className="mb-2 text-2xl font-semibold tracking-tight">
                      File &amp; Folder Structure
                    </h2>
                    <ArchitectureTabs
                      current={currentArch || "mvc"}
                      framework={currentFramework}
                    />
                    <ComponentFileViewer
                      slug={blueprintSlug ?? slug[slug.length - 1]}
                      from="docs"
                      database={database}
                      orm={orm}
                      variant={variant}
                      architecture={currentArch}
                      framework={currentFramework || slug[0]}
                      type={
                        ["tooling", ""].includes(slug[1])
                          ? (slug[1] as ItemType)
                          : (slug[1]?.slice(0, -1) as ItemType)
                      }
                    />
                  </>
                )}
            </div>
            {data.command && (
              <>
                <h2 className="my-4 text-2xl font-semibold tracking-tight">
                  Installation
                </h2>
                <PackageManagerTabs command={data.command} />
              </>
            )}
          </div>

          {data?.contributor?.length > 0 && (
            <div className="mb-4 border-t pt-4">
              <p className="text-muted-foreground text-sm tracking-wide uppercase">
                {data?.contributor?.length > 1
                  ? "Contributors"
                  : "Contributed by"}
              </p>

              {data?.contributor?.map(
                (item: { name: string; url: string; avatar: string }) => (
                  <div
                    key={item.avatar}
                    className="mt-2 flex items-center gap-2">
                    <img
                      height={32}
                      width={32}
                      src={item.avatar}
                      alt={item.name}
                      className="primary-ring size-8 rounded-full object-cover p-1"
                    />

                    <Link
                      href={item.url as Route}
                      target="_blank"
                      className="text-base font-medium hover:underline">
                      {item.name}
                    </Link>
                  </div>
                )
              )}
            </div>
          )}

          <div className="border-t mb-2">
            <NextSteps
              next={next}
              prev={prev}
              currentFramework={currentFramework}
            />
          </div>
        </div>
      </div>
    </>
  );
}

const NextSteps = ({
  next,
  prev,
  currentFramework
}: {
  next?: IRegistryItems | undefined;
  prev?: IRegistryItems | undefined;
  currentFramework?: string;
}) => {
  // Helper function to inject framework into docs URL if needed

  return (
    <div className="mt-4 flex items-center justify-between">
      {prev && (
        <div className="flex items-center justify-start">
          <Link
            href={
              injectFramework(
                prev.docs as string,
                currentFramework || ""
              ) as Route
            }
            className="bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium duration-200 sm:py-1.5">
            <ArrowLeftIcon className="size-4" />
            <span className="hidden sm:inline">{prev.title}</span>
          </Link>
        </div>
      )}
      {next && (
        <div className="flex items-center justify-end">
          <Link
            href={
              injectFramework(
                next.docs as string,
                currentFramework || ""
              ) as Route
            }
            className="bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium duration-200 sm:py-1.5">
            <span className="hidden sm:inline"> {next.title}</span>{" "}
            <ArrowRightIcon className="size-4" />
          </Link>
        </div>
      )}
    </div>
  );
};
