import { getCollection, type CollectionEntry } from "astro:content";
import type { Lang } from "~/data/site";

export type ReportEntry = CollectionEntry<"reports">;

const DATE_RE = /^(\d{4}-\d{2}-\d{2})$/;
// Astro's glob loader slugifies entry ids, which strips the dot from
// `2026-05-12.zh`, producing `2026-05-12zh`. Match either form.
const ZH_ID_RE = /^(\d{4}-\d{2}-\d{2})\.?zh$/;

export interface ParsedReportId {
  source: string;
  topic: string;
  date: string;
  lang: Lang;
}

export function parseReportId(id: string): ParsedReportId | null {
  const parts = id.split("/");
  if (parts.length !== 3) return null;
  const [source, topic, last] = parts;
  const zhMatch = last.match(ZH_ID_RE);
  if (zhMatch) {
    return { source, topic, date: zhMatch[1], lang: "zh" };
  }
  if (!DATE_RE.test(last)) return null;
  return { source, topic, date: last, lang: "en" };
}

export interface ReportRecord {
  id: string;
  source: string;
  topic: string;
  date: string;
  lang: Lang;
  entry: ReportEntry;
}

export async function getAllReports(): Promise<ReportRecord[]> {
  const entries = await getCollection("reports");
  const out: ReportRecord[] = [];
  for (const entry of entries) {
    const parsed = parseReportId(entry.id);
    if (!parsed) continue;
    out.push({
      id: entry.id,
      source: parsed.source,
      topic: parsed.topic,
      date: parsed.date,
      lang: parsed.lang,
      entry,
    });
  }
  out.sort((a, b) =>
    a.date === b.date ? a.id.localeCompare(b.id) : b.date.localeCompare(a.date),
  );
  return out;
}

export async function getReportsByLang(lang: Lang): Promise<ReportRecord[]> {
  const all = await getAllReports();
  return all.filter((r) => r.lang === lang);
}

export async function getReportsForTopic(
  source: string,
  topic: string,
  lang: Lang,
): Promise<ReportRecord[]> {
  const all = await getAllReports();
  return all.filter(
    (r) => r.source === source && r.topic === topic && r.lang === lang,
  );
}

export interface TopicGroup {
  source: string;
  topic: string;
  reports: ReportRecord[];
}

/**
 * Returns one entry per (source, topic) pair that has at least one report
 * in the given language. Each entry includes up to `limit` of the most
 * recent reports for that pair.
 */
export async function getTopicsForLang(
  lang: Lang,
  limit = 3,
): Promise<TopicGroup[]> {
  const reports = await getReportsByLang(lang);
  const map = new Map<string, ReportRecord[]>();
  for (const r of reports) {
    const key = `${r.source}/${r.topic}`;
    const list = map.get(key) ?? [];
    list.push(r);
    map.set(key, list);
  }
  const groups: TopicGroup[] = [];
  for (const [key, list] of map.entries()) {
    const [source, topic] = key.split("/");
    groups.push({
      source,
      topic,
      reports: list.slice(0, limit),
    });
  }
  return groups;
}

/**
 * URL for a report under the given language. EN at root, ZH under /zh/.
 */
export function reportUrl(rec: ReportRecord): string {
  const base = rec.lang === "zh" ? "/zh" : "";
  return `${base}/${rec.source}/${rec.topic}/${rec.date}/`;
}

export function topicUrl(source: string, topic: string, lang: Lang): string {
  const base = lang === "zh" ? "/zh" : "";
  return `${base}/${source}/${topic}/`;
}

export function homeUrl(lang: Lang): string {
  return lang === "zh" ? "/zh/" : "/";
}

export function feedUrl(lang: Lang): string {
  return lang === "zh" ? "/zh/feed.xml" : "/feed.xml";
}

const MONTH_NAMES_EN = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
const MONTH_FULL_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const MONTH_FULL_ZH = [
  "一月", "二月", "三月", "四月", "五月", "六月",
  "七月", "八月", "九月", "十月", "十一月", "十二月",
];

export function shortLabel(date: string, lang: Lang): string {
  const [, mStr, dStr] = date.split("-");
  const m = Number(mStr);
  const d = Number(dStr);
  if (lang === "zh") {
    return `${m}月${d}日`;
  }
  return `${MONTH_NAMES_EN[m - 1]} ${d}`;
}

export function monthLabel(year: number, month: number, lang: Lang): string {
  if (lang === "zh") return `${year}年 ${MONTH_FULL_ZH[month - 1]}`;
  return `${MONTH_FULL_EN[month - 1]} ${year}`;
}

export const DAY_NAMES_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const DAY_NAMES_ZH = ["日", "一", "二", "三", "四", "五", "六"];

/**
 * Extract section-1 sub-topic titles for the page meta description.
 * Mirrors hooks/title.py.
 */
export function extractSection1Topics(markdown: string): string[] {
  const m = markdown.match(/^## 1\.\s.+?\n([\s\S]*?)(?=^## 2\.|$(?![\r\n]))/m);
  if (!m) return [];
  const body = m[1];
  const re = /^###\s+\d+\.\d+\s+(.+?)\s*(?:[（(].+?[）)])\s*$/gm;
  const out: string[] = [];
  let mm: RegExpExecArray | null;
  while ((mm = re.exec(body)) !== null) out.push(mm[1]);
  return out;
}

export function extractFirstImage(markdown: string): string | undefined {
  const m = markdown.match(/!\[.*?\]\((.+?)\)/);
  return m?.[1];
}

const HEADING_RE = /^#\s+(.+?)\s*$/m;
const SECTION_RE =
  /^##\s+1\.\s+.+?\n([\s\S]*?)(?=^##\s+2\.|$(?![\r\n]))/m;
const MARKDOWN_LINK_RE = /!?\[([^\]]*)\]\([^)]*\)/g;
const HTML_TAG_RE = /<[^>]+>/g;
const WS_RE = /\s+/g;

export function extractTitle(markdown: string): string | undefined {
  const m = markdown.match(HEADING_RE);
  return m ? cleanText(m[1]) : undefined;
}

export function extractSummary(markdown: string): string {
  const m = markdown.match(SECTION_RE);
  const source = m ? m[1] : markdown;
  const lines = source
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(
      (l) => l && !l.startsWith("#") && !l.startsWith("|") && !l.startsWith("---"),
    );
  return cleanText(lines.join(" ")).slice(0, 500);
}

export function cleanText(value: string): string {
  return value
    .replace(MARKDOWN_LINK_RE, "$1")
    .replace(HTML_TAG_RE, "")
    .replace(WS_RE, " ")
    .trim();
}

export function buildReportMeta(
  rec: ReportRecord,
  markdown: string,
): { title: string; description: string; image?: string; author: string } {
  const source = rec.source;
  const topic = rec.topic;
  const sourceLabel = source.charAt(0).toUpperCase() + source.slice(1);
  const topicLabel = topic
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
  const subTopics = extractSection1Topics(markdown);
  const description = subTopics.length
    ? `${sourceLabel} ${topicLabel} — ${rec.date}: ${subTopics.join(" · ")}`
    : `${sourceLabel} ${topicLabel} report for ${rec.date}`;
  return {
    title: rec.date,
    description,
    image: extractFirstImage(markdown),
    author: "GenisisIQ",
  };
}
