export type Lang = "en" | "zh";

export const SITE = {
  url: "https://genisisiq.com",
  analyticsId: "G-B3FDBWD72F",
  newsletterApi: "https://newsletter-worker.wlfjck.workers.dev",
  copyright: "©2026 Yingting Huang",
} as const;

export const STRINGS = {
  en: {
    siteName: "AI Pulse Daily",
    siteDescription:
      "AI Pulse Daily — surfacing themes, pain points, and more from the social web.",
    rss: "AI Pulse Daily RSS",
    home: "Home",
    subscribe: "Subscribe",
    search: "Search",
    latestReports: "Latest Reports",
    viewAll: "All",
    viewAllTitle: "View all",
    heroTagline:
      "Daily AI pulse from the social web — trends, breakthroughs, pain points, and emerging topics.",
    homeTitle: "AI Pulse Daily",
    langSwitchLabel: "中文",
    langSwitchHref: "/zh/",
    confirmed: "✓ Subscription confirmed! Welcome aboard.",
    alreadySubscribed: "You're already subscribed.",
    topicCalendarHint:
      "Click a highlighted date to view the report.",
  },
  zh: {
    siteName: "AI趋势速递",
    siteDescription:
      "AI趋势速递 — 从 Reddit、Twitter 和 HackerNews 挖掘主题、痛点和新兴话题。",
    rss: "AI趋势速递 RSS",
    home: "首页",
    subscribe: "订阅",
    search: "搜索",
    latestReports: "最新报告",
    viewAll: "全部",
    viewAllTitle: "查看全部",
    heroTagline:
      "每日AI趋势速递 — 洞察社交网络，捕捉趋势、热点、痛点与新兴话题。",
    homeTitle: "AI趋势速递",
    langSwitchLabel: "English",
    langSwitchHref: "/",
    confirmed: "✓ 订阅已确认！欢迎加入。",
    alreadySubscribed: "你已经订阅过了。",
    topicCalendarHint: "点击高亮日期查看报告。",
  },
} as const;

export type SourceKey = "reddit" | "twitter" | "hackernews" | "youtube";
export type TopicKey = "ai" | "ai-agent" | "ai-coding";

export interface SourceMeta {
  key: SourceKey;
  label: string;
  labelZh: string;
  iconSvg: string;
}

export interface TopicMeta {
  key: TopicKey;
  label: string;
  labelZh: string;
  description: string;
  descriptionZh: string;
}

// SVG icons inlined (replaces Material's :fontawesome-brands-...: shortcodes)
const ICON_REDDIT = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M22 12a2.55 2.55 0 0 0-4.32-1.83A12.18 12.18 0 0 0 11 8.45L12.16 3l3.83.83a1.79 1.79 0 1 0 .18-1L11.74 2a.5.5 0 0 0-.59.38L9.84 8.45a12.07 12.07 0 0 0-6.66 1.71A2.55 2.55 0 1 0 1 12.93a4.79 4.79 0 0 0 0 .76c0 3.94 4.59 7.14 10.25 7.14s10.25-3.2 10.25-7.14a4.79 4.79 0 0 0 0-.76A2.55 2.55 0 0 0 22 12Zm-17 1.5A1.5 1.5 0 1 1 6.5 15 1.5 1.5 0 0 1 5 13.5Zm10.74 4a6.34 6.34 0 0 1-3.74.86 6.34 6.34 0 0 1-3.74-.86.59.59 0 1 1 .67-1 5.51 5.51 0 0 0 3.07.7 5.51 5.51 0 0 0 3.07-.7.59.59 0 1 1 .67 1ZM15.5 15a1.5 1.5 0 1 1 1.5-1.5 1.5 1.5 0 0 1-1.5 1.5Z"/></svg>`;
const ICON_TWITTER = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8l164.9-188.5L26.8 48h145.6l100.5 132.9L389.2 48zm-24.8 373.8h39.1L151.1 88h-42l255.3 333.8z"/></svg>`;
const ICON_HACKERNEWS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M0 32v448h448V32H0zm21.2 197.2H21c-.3-3.3-.6-6.6-.8-9.9 6.4-1.5 13-3.1 19.5-4.6 1.7 6.1 3.4 12.2 5 18.2-7.6-1.2-15.2-2.4-22.9-3.7zm203.2 173.4h-.5c-21.8-26-43.5-52.1-65.3-78.1 26.1-39.4 52.2-78.8 78.3-118.3 9.1-13.7 18.2-27.4 27.4-41.1 7.9-11.9 15.8-23.8 23.8-35.7l3.2-1.7c-39.2 56.7-78.6 113.3-117.9 170 21.8 28 43.6 56 65.4 84 9.1-11.7 18.3-23.3 27.4-35 9.1 11.7 18.3 23.3 27.4 35-21.8 28-43.6 56-65.4 84zM352 257H192v-32l160 1v31z"/></svg>`;
const ICON_YOUTUBE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="18" height="14" fill="currentColor" aria-hidden="true"><path d="M549.7 124.1c-6.3-23.7-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5c-23.5 6.3-42 24.9-48.3 48.6-11.4 42.9-11.4 132.3-11.4 132.3s0 89.4 11.4 132.3c6.3 23.7 24.8 41.5 48.3 47.8C117.2 448 288 448 288 448s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zm-317.5 213.5V175.2l142.7 81.2-142.7 81.2z"/></svg>`;

export const SOURCES: SourceMeta[] = [
  {
    key: "twitter",
    label: "Twitter",
    labelZh: "Twitter",
    iconSvg: ICON_TWITTER,
  },
  {
    key: "reddit",
    label: "Reddit",
    labelZh: "Reddit",
    iconSvg: ICON_REDDIT,
  },
  {
    key: "hackernews",
    label: "HackerNews",
    labelZh: "HackerNews",
    iconSvg: ICON_HACKERNEWS,
  },
  {
    key: "youtube",
    label: "YouTube",
    labelZh: "YouTube",
    iconSvg: ICON_YOUTUBE,
  },
];

export const TOPICS: TopicMeta[] = [
  {
    key: "ai",
    label: "AI",
    labelZh: "AI",
    description: "Broad AI trends, breakthroughs, and industry shifts.",
    descriptionZh: "AI 前沿趋势、行业动态与重大变革。",
  },
  {
    key: "ai-agent",
    label: "AI Agent",
    labelZh: "AI 智能体",
    description: "Autonomous agents, tool use, and agentic workflows.",
    descriptionZh: "自主智能体、工具调用与智能体工作流。",
  },
  {
    key: "ai-coding",
    label: "AI Coding",
    labelZh: "AI 编程",
    description:
      "AI-assisted development, code generation, and developer tooling.",
    descriptionZh: "AI 辅助开发、代码生成与开发者工具。",
  },
];

export function sourceMeta(key: string): SourceMeta | undefined {
  return SOURCES.find((s) => s.key === key);
}

export function topicMeta(key: string): TopicMeta | undefined {
  return TOPICS.find((t) => t.key === key);
}

export function sourceLabel(meta: SourceMeta, lang: Lang): string {
  return lang === "zh" ? meta.labelZh : meta.label;
}

export function topicLabel(meta: TopicMeta, lang: Lang): string {
  return lang === "zh" ? meta.labelZh : meta.label;
}

export function topicDescription(meta: TopicMeta, lang: Lang): string {
  return lang === "zh" ? meta.descriptionZh : meta.description;
}
