import os
import re
import jieba
import numpy as np

from collections import Counter
from wordcloud import WordCloud
import matplotlib.pyplot as plt


# =========================
# 内容目录
# =========================
CONTENT_DIR = "./content"


# =========================
# 中文字体路径（改成你的）
# =========================
FONT_PATH = "/Users/chenhaozhou/Desktop/documents/Chenhao_digital_gardern_archive_and_draft/词云/LXGWWenKai-Regular.ttf"


# =========================
# 中文停用词
# =========================
STOPWORDS = {

    # 基础虚词
    "的", "了", "是", "我", "也",
    "和", "而", "都", "在", "与",
    "一个", "没有", "我们", "你",
    "他们", "她们", "它们",

    # 哲学废词
    "东西",
    "一种",
    "这个",
    "那个",
    "自己",
    "问题",
    "时候",
    "可能",
    "存在",
    "事情",
    "部分",
    "状态",
    "方式",
    "经验",
    "对象",
    "概念",
    "结构",
    "觉得",
    "可以",
    "因为",
    "这样",
    "这些",
    "还是",
    "这是",
    "已经",
    "很多",
    "对于",
    "无法",
    "作为",
    "但是",
    "一些",
    "应该",
    "不是",
    "而是",
    "那么",
    "以及",
    "一段",
    "那种",
    "就是",
    "其中",
    "这种",
    "感觉",
    "世界",
    "一样",
     "什么",
     "任何",
     "更加",
     "普洁",
     "虽然",
     "起来",
     "不会",
     "每个",
     "变得",
     "往往",
     "这里",
     "即使",
     "才能",
     "出来",
     "不过",
     "那些",
     "然后",
     "下去",
     "还有",
     "的话",
     "关野",
     "只有",
     "仅仅",
     "来说",
     "哪怕",
     "一位",
     "不能",
     "总是",
     "通过",
     "并且",
     "甚至",
     "有点",
     "有着",
     "能够",
     "之后",
     "有些",
     "如此",
     "一件",
     "是否",
     "其实",
     "其它"




    # markdown 垃圾
    "http",
    "https",
    "com",
    "png",
    "jpg",
    "md",
    "br",
}


# =========================
# 词过滤函数（核心）
# =========================
def is_valid_word(w):

    w = w.strip()

    if len(w) <= 1:
        return False

    # ❌ 全英文
    if re.fullmatch(r"[a-zA-Z]+", w):
        return False

    # ❌ 英文+数字组合
    if re.fullmatch(r"[a-zA-Z0-9]+", w):
        return False

    # ❌ 纯数字
    if re.fullmatch(r"\d+", w):
        return False

    # ❌ 含数字
    if re.search(r"\d", w):
        return False

    # ❌ 没中文
    if not re.search(r"[\u4e00-\u9fff]", w):
        return False

    return True


# =========================
# 椭圆宇宙 mask（左右长，上下短）
# =========================
width = 1600
height = 1600

y, x = np.ogrid[:height, :width]

cx = width / 2
cy = height / 2

rx = width * 0.48
ry = height * 0.48

ellipse = ((x - cx) ** 2) / (rx ** 2) + ((y - cy) ** 2) / (ry ** 2)

mask = (ellipse > 1) * 255
mask = mask.astype(int)


# =========================
# 读取所有 md（排除 index）
# =========================
all_text = ""

for root, dirs, files in os.walk(CONTENT_DIR):

    for file in files:

        if not file.endswith(".md"):
            continue

        if file == "index.md":
            continue

        path = os.path.join(root, file)

        with open(path, "r", encoding="utf-8") as f:

            text = f.read()

            # 清理 markdown 噪音
            text = re.sub(r"`.*?`", "", text)
            text = re.sub(r"\!\[.*?\]\(.*?\)", "", text)
            text = re.sub(r"<.*?>", "", text)
            text = re.sub(r"http\S+", "", text)

            all_text += text + "\n"


# =========================
# 中文分词
# =========================
words = jieba.lcut(all_text)

filtered_words = []

for w in words:

    w = w.strip()

    if w in STOPWORDS:
        continue

    if not is_valid_word(w):
        continue

    filtered_words.append(w)


# =========================
# 词频统计
# =========================
counter = Counter(filtered_words)


# =========================
# 柔和配色
# =========================
PALETTE = [
    "#6E7FF3",
    "#A88BEB",
    "#D8A7B1",
    "#A8C5B0",
    "#E6C79C",
    "#B9C8F0",
]

import random

def color_func(*args, **kwargs):
    return random.choice(PALETTE)


# =========================
# 生成词云
# =========================
wc = WordCloud(

    font_path=FONT_PATH,

    mask=mask,

    width=2400,
    height=1600,

    background_color="#FAF8F4",

    max_words=300,

    prefer_horizontal=0.9,

    relative_scaling=0.4,

    random_state=42,

    margin=2,

    color_func=color_func,

    collocations=False,
).generate_from_frequencies(counter)


# =========================
# 输出图片
# =========================
OUTPUT = "./content/assets/images/wordcloud.png"

wc.to_file(OUTPUT)

print("词云生成完成:", OUTPUT)


# =========================
# 预览
# =========================
plt.figure(figsize=(12, 8))
plt.imshow(wc, interpolation="bilinear")
plt.axis("off")
plt.tight_layout()
plt.show()