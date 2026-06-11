import { QuartzComponent, QuartzComponentConstructor } from "./types"

export default (() => {
  const WritingStats: QuartzComponent = (props) => {

    // 🟥 只在首页显示
    const isHome = props?.fileData?.slug === "index"
    if (!isHome) return null

    const allFiles = (props?.allFiles ?? []).filter((f: any) => {
      const slug = f.slug ?? ""

      if (slug === "index") return false
      if (slug.endsWith("/index")) return false
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

    /* =========================
       ⭐版本号 VYYYYMMDD-HHMM
    ========================= */
    const now = new Date()

    const version =
      "V" +
      now.getFullYear().toString() +
      String(now.getMonth() + 1).padStart(2, "0") +
      String(now.getDate()).padStart(2, "0") +
      "-" +
      String(now.getHours()).padStart(2, "0") +
      String(now.getMinutes()).padStart(2, "0")

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

        {/* ⭐版本 */}
        <div class="stat-row">
          <span>网站版本</span>
          <span>{version}</span>
        </div>
      </div>
    )
  }

  return WritingStats
}) satisfies QuartzComponentConstructor