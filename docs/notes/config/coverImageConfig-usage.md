---
title: 随机封面图配置
createTime: 2025/01/27 18:38:13
permalink: /config/coverImageConfig-usage/
---

# 随机封面图配置

配置文章封面图的显示策略，以及随机封面图 API。

## 配置文件

文件路径：`src/config/coverImageConfig.ts`

## 配置详解

### 1. 基础开关

```typescript
export const coverImageConfig: CoverImageConfig = {
  // 是否在文章详情页顶部显示封面图
  enableInPost: true,
  
  // ...
};
```

### 2. 随机封面图配置

当文章 Frontmatter 中的 `image` 字段设置为 `"api"` 时，将使用此处的配置。

```typescript
randomCoverImage: {
  // 随机封面图功能总开关
  enable: false,

  // 随机图 API 列表
  // 系统会按顺序尝试加载，直到成功
  apis: [
    "https://t.alcy.cc/pc",
    "https://www.dmoe.cc/random.php",
    "https://uapis.cn/api/v1/random/image?category=acg&type=pc",
  ],

  // 备用图片路径
  // 当所有 API 都请求失败时显示的图片
  fallback: "/assets/images/cover.webp",

  // 加载状态配置
  loading: {
    // 是否显示加载指示器
    enable: true,
    // 加载动画图片路径
    image: "/assets/images/loading.gif",
    // 加载时的背景颜色 (建议与 loading 图片背景一致)
    backgroundColor: "#fefefe",
  },

  // 水印配置
  // 仅在随机图加载成功时显示
  watermark: {
    // 是否显示水印
    enable: true,
    // 水印文本
    text: "Random Cover",
    // 水印位置
    // 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'center'
    position: "bottom-right",
    // 透明度
    opacity: 0.6,
    // 字体大小
    fontSize: "0.75rem",
    // 字体颜色
    color: "#ffffff",
    // 背景颜色
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
},
```


