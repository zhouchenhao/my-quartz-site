import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import Heatmap from "./quartz/components/Heatmap"
import WritingStats from "./quartz/components/WritingStats"
import FolderExplorer from "./quartz/components/FolderExplorer"
import WordCloud from "./quartz/components/WordCloud"

const isHome = (page: any) =>
  page.fileData.filePath?.endsWith("index.md")

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/jackyzha0/quartz",
      "Discord Community": "https://discord.gg/cRFFHYye7t",
    },
  }),
}

// components for pages that display a single page (home + notes)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.HomeBanner(),

    // ✅ 最新笔记（放在 HomeBanner 和 index.md 中间）
    Component.RecentNotes({
      title: "最新笔记",
      limit: 5,
    }),

    Component.ArticleTitle(),

    Component.ConditionalRender({
      component: Component.ContentMeta(),
      condition: (page) => {
        const slug = page.fileData.slug ?? ""
        return slug !== "index" && !slug.startsWith("all-notes")
      },
    }),

    Component.TagList(),
  ],

  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
      ],
    }),
    FolderExplorer(),
  ],

  right: [
    Heatmap(),
    WritingStats(),
    WordCloud(),
  ],
}

// components for list pages (tags, folders, etc.)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],

  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
      ],
    }),
    FolderExplorer(),
  ],

  right: [],
}