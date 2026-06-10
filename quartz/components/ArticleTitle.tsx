import {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "./types"

import { classNames } from "../util/lang"

const ArticleTitle: QuartzComponent = ({
  fileData,
  displayClass,
}: QuartzComponentProps) => {
  const title = fileData.frontmatter?.title
  const slug = fileData.slug ?? ""

  const isHome = slug === "index"

  if (!title) return null

  return (
    <h1
      class={classNames(
        displayClass,
        "article-title",
        isHome ? "article-title--home" : ""
      )}
    >
      {title}
    </h1>
  )
}

ArticleTitle.css = `
.article-title {
  margin: 2rem 0 0 0;
  font-size: 1.6rem;
  font-weight: 700; /* ✅ 普通文章：加粗 */
}

/* 只影响 index.md */
.article-title--home {
  font-size: 1.15rem !important;
  font-weight: 800 !important; /* ✅ 首页也加粗（更明显） */
  opacity: 0.9;
}
`

export default (() => ArticleTitle) satisfies QuartzComponentConstructor