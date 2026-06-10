import {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "./types"

import { SimpleSlug, resolveRelative } from "../util/path"
import { QuartzPluginData } from "../plugins/vfile"
import { byDateAndAlphabetical } from "./PageList"
import style from "./styles/recentNotes.scss"
import { Date, getDate } from "./Date"
import { GlobalConfiguration } from "../cfg"
import { i18n } from "../i18n"
import { classNames } from "../util/lang"

interface Options {
  title?: string
  limit: number
  linkToMore: SimpleSlug | false
  filter: (f: QuartzPluginData) => boolean
  sort: (f1: QuartzPluginData, f2: QuartzPluginData) => number
}

const defaultOptions = (cfg: GlobalConfiguration): Options => ({
  limit: 3,
  linkToMore: false,
  filter: () => true,
  sort: byDateAndAlphabetical(cfg),
})

export default ((userOpts?: Partial<Options>) => {
  const RecentNotes: QuartzComponent = ({
    allFiles,
    fileData,
    displayClass,
    cfg,
  }: QuartzComponentProps) => {
    const opts = { ...defaultOptions(cfg), ...userOpts }

    const pages = allFiles
      .filter(opts.filter)
      .filter((f: any) => {
        const slug = f.slug ?? ""

        if (slug === "index") return false
        if (slug.endsWith("/index")) return false
        if (!slug.includes("/")) return false

        return true
      })
      .sort(opts.sort)

    const remaining = Math.max(0, pages.length - opts.limit)

    return (
      <div class={classNames(displayClass, "recent-notes")}>

        {/* ✅ 标题：最新笔记 */}
        <h3 class="recent-title">
          {opts.title ?? i18n(cfg.locale).components.recentNotes.title}
        </h3>

        <ul class="recent-ul">
          {pages.slice(0, opts.limit).map((page) => {
            const title =
              page.frontmatter?.title ??
              i18n(cfg.locale).propertyDefaults.title

            const slug = page.slug ?? ""

            const folder = slug.includes("/")
              ? slug.split("/").slice(0, -1).pop()
              : ""

            return (
              <li class="recent-li">
                <div class="row">

                  <a
                    href={resolveRelative(fileData.slug!, page.slug!)}
                    class="title"
                  >
                    <span class="note-title">{title}</span>

                    {folder && (
                      <span class="folder-tag">
                        {" "}{"{"}{folder}{"}"}
                      </span>
                    )}
                  </a>

                  {page.dates && (
                    <span class="meta">
                      <Date date={getDate(cfg, page)!} locale={cfg.locale} />
                    </span>
                  )}

                </div>
              </li>
            )
          })}
        </ul>

        {opts.linkToMore && remaining > 0 && (
          <p>
            <a href={resolveRelative(fileData.slug!, opts.linkToMore)}>
              {i18n(cfg.locale).components.recentNotes.seeRemainingMore({ remaining })}
            </a>
          </p>
        )}

      </div>
    )
  }

  RecentNotes.css = style + `
    /* 外层整体 */
    .recent-notes {
      font-size: 1rem;
    }

    /* ✅ 主标题：最新笔记（更大） */
    .recent-title {
      font-size: 1.1rem !important;
      font-weight: 800;
      line-height: 1.2;
      margin-bottom: 1rem;
    }

    /* ✅ 分割线（关键） */
  .recent-notes::after {
    content: "";
    display: block;
    height: 1px;
    margin-top: 2rem;
    background: rgba(120, 120, 120, 0.25);
  }

    /* 每一行布局 */
    .row {
      display: grid;
      grid-template-columns: 1fr auto;
      align-items: center;
      gap: 0.8rem;
    }

    .title {
      text-decoration: none;
      justify-self: start;
    }

    /* ✅ 文章标题（更小） */
    .note-title {
      font-size: 1rem;
      font-weight: 500;
    }

    .meta {
      justify-self: end;
      white-space: nowrap;
      opacity: 0.6;
      font-size: 0.85rem;
    }

    .folder-tag {
      color: rgba(120, 120, 120, 0.75);
      font-size: 0.85rem;
      margin-left: 0.35em;
    }
  `

  return RecentNotes
}) satisfies QuartzComponentConstructor