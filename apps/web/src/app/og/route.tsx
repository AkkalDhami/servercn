import { Grid } from "@/components/og/grid";
import { siteConfig } from "@/lib/config";
import { ImageResponse } from "next/og";

export const GET = (request: Request) => {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || siteConfig.title.template;
  const description = searchParams.get("description") || siteConfig.description;

  return new ImageResponse(
    <Grid
      brand={siteConfig.applicationName}
      description={description}
      title={title}
    />,
    { height: 630, width: 1200 }
  );
};
