import type { APIRoute } from "astro";
import { buildFeed, buildItems } from "../feed.xml";

export const GET: APIRoute = async () => {
  const items = await buildItems("zh");
  return new Response(buildFeed("zh", items), {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
