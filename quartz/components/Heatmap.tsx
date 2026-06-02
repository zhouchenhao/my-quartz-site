import { QuartzComponent, QuartzComponentConstructor } from "./types"

export default (() => {
  const Heatmap: QuartzComponent = (props) => {

    // ✅ 只在首页显示
    const isHome = props?.fileData?.slug === "index"
    if (!isHome) return null

    const allFiles = props?.allFiles ?? []

    const toDateKey = (d: any) => {
      if (!d) return null
      const date = new Date(d)
      if (isNaN(date.getTime())) return null

      const y = date.getFullYear()
      const m = String(date.getMonth() + 1).padStart(2, "0")
      const day = String(date.getDate()).padStart(2, "0")

      return `${y}-${m}-${day}`
    }

    const dateSet = new Set<string>()

    for (const f of allFiles) {

     // ❌ 排除所有 index.md
     const slug = f.slug ?? ""

     if (
       slug === "index" ||
       slug === "all-notes" ||
       slug.endsWith("/index") ||
       slug.startsWith("all-notes/")
     ) {
       continue
     }
     
     const dateKey = toDateKey(f.dates?.created)
     
     if (dateKey) {
     dateSet.add(dateKey)
     }
     }
     
    const days = Array.from({ length: 60 }).map((_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - i)

      const y = d.getFullYear()
      const m = String(d.getMonth() + 1).padStart(2, "0")
      const day = String(d.getDate()).padStart(2, "0")

      return `${y}-${m}-${day}`
    }).reverse()

    return (
      <div class="heatmap-wrapper">
        <div class="heatmap">
          <h3>过去2个月更新</h3>

          <div class="heatmap-grid">
            {days.map((day) => {
              const active = dateSet.has(day)

              return (
                <div
                  key={day}
                  class={`heat-cell ${active ? "active" : ""}`}
                  title={`${day}${active ? " ✔ note" : " —"}`}
                />
              )
            })}
          </div>
        </div>

        <div class="heatmap-legend">
       

          <div class="legend-item">
            <div class="box empty" />
            <span>无</span>
          </div>

          <div class="legend-item">
            <div class="box active" />
            <span>有</span>
          </div>
        </div>
      </div>
    )
  }

  return Heatmap
}) satisfies QuartzComponentConstructor