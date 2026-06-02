import { QuartzComponent, QuartzComponentConstructor } from "./types"

export default ((opts?: any) => {
  const WordCloud: QuartzComponent = ({ fileData }) => {
    // ✅ 只在主页 index 显示
    const isHome =
      fileData?.slug === "index" ||
      fileData?.slug === "/" ||
      fileData?.slug === ""

    if (!isHome) return null

    return (
      <div class="wordcloud">
        {/* 👇 小标题 */}
        <div class="wordcloud-title">实时词云</div>

        {/* 图片 */}
        <img
          src="/assets/images/wordcloud.png"
          alt="wordcloud"
        />
      </div>
    )
  }

  WordCloud.css = `
  .wordcloud {
    display: flex;
    flex-direction: column;
    position: sticky;
    top: 1rem;
    max-height: 80vh;
  }

  .wordcloud-title {
    font-size: 0.85rem;
    color: var(--text-normal);
    margin-bottom: 0.5rem;
    text-align: left;
    letter-spacing: 0.05em;
  }

  .wordcloud img {
    width: 85%;
    margin: 0 auto;
    display: block;
    height: auto;
    border-radius: 5px;
    object-fit: contain;
  }
  `
  return WordCloud
}) satisfies QuartzComponentConstructor