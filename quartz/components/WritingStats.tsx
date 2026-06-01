import { QuartzComponent, QuartzComponentConstructor } from "./types"

export default (() => {
  const WritingStats: QuartzComponent = (props) => {

    // 🟥 只在首页显示
    const isHome = props?.fileData?.slug === "index"
    if (!isHome) return null

    const allFiles = (props?.allFiles ?? []).filter((f: any) => {
      const slug = f.slug ?? ""

      // ❌ 排除首页
      if (slug === "index") return false

      // ❌ 排除 folder/index
      if (slug.endsWith("/index")) return false

      // ❌ 排除根目录文件
      if (!slug.includes("/")) return false

      return true
    })

    const getDate = (f: any) => {
      const d = new Date(f.date ?? f.dates?.created ?? f.frontmatter?.date)
      return isNaN(d.getTime()) ? null : d
    }

    const validDates = allFiles
      .map(getDate)
      .filter(Boolean)

    const total = validDates.length

    const years = validDates.map((d: any) => d.getFullYear())

    const earliest = years.length
      ? Math.min(...years)
      : "—"

    return (
      <div class="writing-stats">
        <h3>写作统计</h3>

        <div class="stat-row">
          <span>总文章数</span>
          <span>{total}</span>
        </div>

        <div class="stat-row">
          <span>始于</span>
          <span>{earliest}</span>
        </div>
      </div>
    )
  }

  return WritingStats
}) satisfies QuartzComponentConstructor