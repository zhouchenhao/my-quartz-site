import { QuartzComponent, QuartzComponentConstructor } from "./types"

export default (() => {
  const HomeBanner: QuartzComponent = (props) => {
    const isHome = props?.fileData?.slug === "index"
    if (!isHome) return null

    return (
      <div class="home-banner">
        <img
          src="/static/banner.png"
          alt="home banner"
        />
      </div>
    )
  }

  return HomeBanner
}) satisfies QuartzComponentConstructor