import {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "./types"

import { classNames } from "../util/lang"

type FolderMap = Record<
  string,
  {
    title: string
    slug: string
    date: number
  }[]
>

export default (() => {
  const FolderExplorer: QuartzComponent = ({
    allFiles,
    displayClass,
  }: QuartzComponentProps) => {

    const folders: FolderMap = {}

    for (const file of allFiles) {
      const slug = file.slug ?? ""

      // 跳过首页
      if (slug === "index") continue

      const parts = slug.split("/")

      // 必须在文件夹里
      if (parts.length < 2) continue

      // 跳过文件夹 index
      if (parts[parts.length - 1] === "index") continue

      const folder = parts[0]

      const rawDate =
        file.frontmatter?.date ??
        file.dates?.created ??
        file.dates?.modified

      const time = new Date(rawDate).getTime()

      if (!folders[folder]) {
        folders[folder] = []
      }

      folders[folder].push({
        title:
          file.frontmatter?.title ??
          parts[parts.length - 1],

        slug: "/" + slug,

        date: Number.isFinite(time) ? time : 0,
      })
    }

    // 文件夹内部按时间排序
    for (const key in folders) {
      folders[key].sort((a, b) => b.date - a.date)
    }

    const folderNames = Object.keys(folders).sort()

    return (
      <div class={classNames(displayClass, "folder-explorer")}>

        <h3>目录</h3>

        <div class="folder-groups">

          {folderNames.map((folder) => (
            <details class="folder-block">

              <summary class="folder-title">
                {folder}
              </summary>

              <ul class="folder-list">

                {folders[folder].map((post) => (
                  <li class="folder-item">

                    <a
                      href={post.slug}
                      class="folder-link"
                    >
                      {post.title}
                    </a>

                  </li>
                ))}

              </ul>

            </details>
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
      margin-bottom: 1rem;
    }

.folder-groups {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.folder-block {
  border: none;
  border-radius: 0;
  padding: 0;
  background: transparent;

  margin: 0;
}

.folder-title {
  cursor: pointer;
  user-select: none;

  font-size: 1rem;
  font-weight: 700;

  padding: 0.2rem 0.2rem;
  border-radius: 1px;

  transition:
    background-color 0.18s ease,
    transform 0.18s ease,
    opacity 0.18s ease;
}

.folder-title:hover {
  background: rgba(255, 255, 255, 0.06);
  transform: translateX(2px);
}

.folder-title:active {
  transform: scale(0.98);
}

  .folder-list {
  list-style: none;
  padding: 0;
  margin-top: 0.1rem;
}

.folder-item {
  list-style: none;
  margin: 0;
  padding: 0;
}

.folder-item + .folder-item {
  margin-top: 0rem;
}

.folder-link {
  display: block;
  text-decoration: none;

  font-size: 0.88rem;
  font-weight: 400;
  line-height: 1.3;

  padding: 0.18rem 0.6rem;
  border-radius: 6px;

  opacity: 0.85;

  transition:
    background-color 0.18s ease,
    opacity 0.18s ease;
}

.folder-link:hover {
  background: rgba(255, 255, 255, 0.06);
  transform: translateX(1.5px);
  opacity: 1;
}

.folder-link:active {
  transform: scale(0.98);
}
  `

  return FolderExplorer
}) satisfies QuartzComponentConstructor