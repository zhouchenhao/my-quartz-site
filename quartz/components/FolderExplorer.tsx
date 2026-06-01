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

    for (const file of allFiles) {
      const slug = file.slug ?? ""

      // 跳过全站 index
      if (slug === "index") continue

      const parts = slug.split("/")
      const folder = parts[0]

      const isIndexFile = slug.endsWith("/index")

      // 初始化计数
      if (!folderCounts[folder]) {
        folderCounts[folder] = 0
      }

      // 只统计非 index 文件
      if (!isIndexFile) {
        folderCounts[folder]++
      }

      // 只用 folder/index 作为入口
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

    // 按时间排序（新 → 旧）
    folders.sort((a, b) => b.date - a.date)

    return (
      <div class={classNames(displayClass, "folder-explorer")}>

        <h3>目录</h3>

        <div class="folder-list">

          {/* 首页 */}
          <a href="/" class="folder-link">
            <span class="folder-arrow">▶</span>
            <span class="folder-name">主页</span>
          </a>

          {/* 文件夹 */}
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
      overflow-y: auto;
      padding-right: 0.25rem;
    }

    .folder-explorer h3 {
      margin-bottom: 0.8rem;
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

      transition:
        background-color 0.16s ease,
        transform 0.16s ease,
        opacity 0.16s ease;
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

    .folder-explorer::-webkit-scrollbar {
      width: 6px;
    }

    .folder-explorer::-webkit-scrollbar-thumb {
      background: rgba(255,255,255,0.08);
      border-radius: 999px;
    }

    .folder-explorer::-webkit-scrollbar-track {
      background: transparent;
    }
  `

  return FolderExplorer
}) satisfies QuartzComponentConstructor