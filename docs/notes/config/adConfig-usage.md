---
title: 广告与推广配置
createTime: 2025/10/11 18:38:13
permalink: /config/adConfig-usage/
---

# 广告与推广配置

想在侧边栏挂个"小广告"？无论是推广自己的公众号、展示一张精美的图片，还是放一个"支持博主"的按钮，`adConfig` 都能帮你轻松搞定！

文件位置：`src/config/adConfig.ts`

## 配置详解

你可以定义多个广告配置（比如 `adConfig1`, `adConfig2`），然后在侧边栏配置中按需引用。

### 1. 纯图片广告 (Banner)

最简单的形式，就是放一张图，点击跳转。

```typescript
export const adConfig1: AdConfig = {
  // 图片设置
  image: {
    src: "/assets/images/d1.webp", // 图片路径，建议放在 public 目录下
    alt: "广告横幅",               // 图片无法显示时的替代文本
    link: "#",                     // 点击图片跳转的链接
    external: true,                // 是否在新标签页打开链接
  },
  
  // 交互设置
  closable: true,   // 是否允许用户手动关闭这个广告
  displayCount: -1, // 显示次数限制：-1 代表一直显示，不自动消失
  
  // 样式设置
  padding: {
    all: "0", // 设置内边距。 "0" 表示图片无缝填满整个卡片
    // 你也可以分别设置四个方向：
    // top: "0", 
    // right: "1rem", 
    // bottom: "1rem", 
    // left: "1rem",
  },
};
```

### 2. 完整内容广告 (图文 + 按钮)

如果你想说的话比较多，可以使用这种图文并茂的形式。

```typescript
export const adConfig2: AdConfig = {
  // 标题和正文
  title: "支持博主",
  content: "如果您觉得本站内容对您有帮助，欢迎支持我们的创作！",
  
  // 配图设置
  image: {
    src: "/assets/images/d2.webp",
    alt: "支持博主",
    link: "about/",
    external: false,
  },
  
  // 底部按钮设置
  link: {
    text: "支持一下", // 按钮文字
    url: "about/",    // 按钮链接
    external: false,  // 是否在新标签页打开
  },
  
  closable: true,
  displayCount: -1,
  
  // 边距设置
  padding: {
    // 不填则使用默认边距，通常看起来更像一个标准的卡片
  },
};
```

## 关键参数说明

| 参数 | 类型 | 说明 |
| :--- | :--- | :--- |
| `image` | object | 图片配置对象，包含 `src` (路径), `alt` (描述), `link` (链接), `external` (是否外链)。 |
| `title` | string | 广告卡片的标题（可选）。 |
| `content` | string | 广告卡片的正文内容（可选）。 |
| `link` | object | 底部按钮配置，包含 `text` (按钮文字), `url` (链接), `external` (是否外链)。 |
| `closable` | boolean | 是否显示右上角的关闭按钮。 |
| `displayCount` | number | 广告显示的次数。设为 `-1` 表示永久显示。 |
| `padding` | object | 卡片内边距设置。可以设置 `all` 统一边距，或分别设置 `top`, `right`, `bottom`, `left`。 |

## 如何启用？

定义好配置后，别忘了去 `src/config/sidebarConfig.ts` 中把它们加到侧边栏里哦！
