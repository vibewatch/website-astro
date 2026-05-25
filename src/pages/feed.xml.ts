import type { APIRoute } from "astro";
import { SITE, STRINGS, type Lang } from "~/data/site";
import {
  buildReportMeta,
  extractTitle,
  getReportsByLang,
  reportUrl,
} from "~/lib/reports";

function rssDate(date: string): string {
  const d = new Date(`${date}T00:00:00Z`);
  return d.toUTCString();
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function buildFeed(lang: Lang, items: string[]): string {
  const t = STRINGS[lang];
  const homepage = lang === "zh" ? `${SITE.url}/zh/` : `${SITE.url}/`;
  const feedHref = lang === "zh"
    ? `${SITE.url}/zh/feed.xml`
    : `${SITE.url}/feed.xml`;
  const language = lang === "zh" ? "zh-CN" : "en";
  const buildDate = new Date().toUTCString();
  return `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(t.siteName)}</title>
    <link>${escapeXml(homepage)}</link>
    <description>${escapeXml(t.siteDescription)}</description>
    <language>${language}</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${escapeXml(feedHref)}" rel="self" type="application/rss+xml" />
${items.join("\n")}
  </channel>
</rss>
`;
}

export async function buildItems(lang: Lang): Promise<string[]> {
  const reports = await getReportsByLang(lang);
  const top = reports.slice(0, 20);
  return top.map((r) => {
    const body = r.entry.body ?? "";
    const meta = buildReportMeta(r, body);
    const title = extractTitle(body) ?? meta.title;
    const link = `${SITE.url}${reportUrl(r)}`;
    return `    <item>
      <title>${escapeXml(title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <description>${escapeXml(meta.description)}</description>
      <pubDate>${rssDate(r.date)}</pubDate>
    </item>`;
  });
}

export const GET: APIRoute = async () => {
  const items = await buildItems("en");
  return new Response(buildFeed("en", items), {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
