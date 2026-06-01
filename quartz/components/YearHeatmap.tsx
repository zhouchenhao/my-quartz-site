import { QuartzComponent, QuartzComponentConstructor } from "./types"

export default (() => {
  const YearHeatmap: QuartzComponent = (props) => {

    const allFiles = props?.allFiles ?? []

    // 🟢 获取日期（兼容 Quartz）
    const getDate = (f: any) => {
      const raw =
        f.date ??
        f.data?.date ??
        f.frontmatter?.date ??
        f.dates?.created

      const d = new Date(raw)
      if (isNaN(d.getTime())) return null
      return d
    }

    // 🟢 最近15年（3×5）
    const now = new Date().getFullYear()
    const years = Array.from({ length: 15 }, (_, i) => now - i)

    // 🟢 统计
    const stats: Record<number, number> = {}

    for (const y of years) {
      stats[y] = 0
    }

    for (const f of allFiles) {
      const d = getDate(f)
      if (!d) continue

      const y = d.getFullYear()
      if (stats[y] !== undefined) {
        stats[y]++
      }
    }

    const max = Math.max(...Object.values(stats))

    // 🟢 分成 3 行 × 5 列
    const rows: number[][] = []
    for (let i = 0; i < years.length; i += 5) {
      rows.push(years.slice(i, i + 5))
    }

    const intensity = (count: number) =>
      max === 0 ? 0 : count / max

    return (
      <div class="year-grid-wrapper">
        <h3>年度文章密度</h3>

        {rows.map((row, i) => (
          <div class="year-grid-row" key={i}>
            {row.map((year) => {
              const count = stats[year]

              return (
                <div
                  class="year-cell"
                  key={year}
                  title={`${year} | ${count} posts | intensity ${(intensity(count) * 100).toFixed(0)}%`}
                >
                  <div
                    class="year-box"
                    style={{
                      backgroundColor:
                        count === 0
                          ? "#e5e5e5"
                          : `rgba(239, 68, 68, ${0.2 + intensity(count) * 0.8})`,
                    }}
                  />
                  <div class="year-label">{year}</div>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    )
  }

  return YearHeatmap
}) satisfies QuartzComponentConstructor