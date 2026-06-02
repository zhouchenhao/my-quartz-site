import {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "./types"

import { classNames } from "../util/lang"

type FolderItem = {
  name: string
  slug: string
  date: number
  count: number
}

export default (() => {
  const FolderExplorer: QuartzComponent = ({
    allFiles,
    displayClass,
  }: QuartzComponentProps) => {

    const folderCounts: Record<string, number> = {}
    const folderMeta: Record<string, FolderItem> = {}

    // ⭐ 全部文章数量（排除 index）
    const totalPosts = allFiles.filter(f => {
  const slug = f.slug ?? ""

  return !(
    slug === "index" ||
    slug.endsWith("/index") ||
    slug.startsWith("all-notes")
  )
}).length

    for (const file of allFiles) {
      const slug = file.slug ?? ""

      if (slug === "index") continue

      const parts = slug.split("/")
      const folder = parts[0]
      const isIndexFile = slug.endsWith("/index")

      if (!folderCounts[folder]) {
        folderCounts[folder] = 0
      }

      if (!isIndexFile) {
        folderCounts[folder]++
      }

      if (!isIndexFile) continue

      const rawDate =
        file.frontmatter?.date ??
        file.dates?.created ??
        file.dates?.modified

      const time = new Date(rawDate).getTime()

      folderMeta[folder] = {
        name: folder,
        slug: "/" + folder,
        date: Number.isFinite(time) ? time : 0,
        count: 0,
      }
    }

    const folders: FolderItem[] = Object.keys(folderMeta).map((folder) => ({
      ...folderMeta[folder],
      count: folderCounts[folder] ?? 0,
    }))

    // ⭐ 按时间排序（新 → 旧）
    folders.sort((a, b) => b.date - a.date)

    return (
      <div class={classNames(displayClass, "folder-explorer")}>

        <h3>目录</h3>

        <div class="folder-list">

          {/* 主页 */}
          <a href="/" class="folder-link">
            <span class="folder-arrow">▶</span>
            <span class="folder-name">主页</span>
          </a>

          {/* ⭐ 全部文章（带数量） */}
          <a href="/all-notes" class="folder-link all-notes">
            <span class="folder-arrow">▶</span>
            <span class="folder-name">
              全部文章 ({totalPosts})
            </span>
          </a>

          {/* 文件夹列表 */}
          {folders.map((folder) => (
            <a href={folder.slug} class="folder-link">
              <span class="folder-arrow">▶</span>
              <span class="folder-name">
                {folder.name} ({folder.count})
              </span>
            </a>
          ))}

        </div>

      </div>
    )
  }

  FolderExplorer.css = `
    .folder-explorer {
      font-size: 0.92rem;
      max-height: calc(100vh - 6rem);
      overflow: visible !important;
      padding-right: 0.25rem;
    }

    .folder-list {
      display: flex;
      flex-direction: column;
      gap: 0.08rem;
    }

    .folder-link {
      display: flex;
      align-items: center;
      gap: 0.45rem;

      text-decoration: none;
      color: inherit;

      font-size: 1rem;
      font-weight: 700;
      line-height: 1.35;

      padding: 0.32rem 0.55rem;
      border-radius: 6px;

      transition: all 0.16s ease;
    }

    .folder-link:hover {
      background: rgba(255, 255, 255, 0.03);
      transform: translateX(1px);
    }

    .folder-link:active {
      opacity: 0.7;
    }

    .folder-arrow {
      font-size: 0.72rem;
      opacity: 0.6;
    }

    .folder-name {
      flex: 1;
    }

    .all-notes {
      font-weight: 800;
      background: none;
      border-radius: 8px;
    }

    .all-notes-page a {
      font-size: 1.05rem;
      line-height: 1.9;
      display: block;
      padding: 0.15rem 0;
    }

    @media (max-width: 768px) {

      .folder-list {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 0.25rem;
      }

      .folder-link {
        width: 100%;
        font-size: 1rem;
        padding: 0.4rem 0.5rem;
        border-radius: 8px;
      }

      .folder-arrow {
        font-size: 0.6rem;
        opacity: 0.7;
      }

      .folder-name {
        font-size: 1rem;
        flex: unset;
        line-height: 1.1;
      }

      .folder-explorer {
        width: 100%;
        padding-left: 0;
        padding-right: 0;
      }
    }
  `

  return FolderExplorer
}) satisfies QuartzComponentConstructor