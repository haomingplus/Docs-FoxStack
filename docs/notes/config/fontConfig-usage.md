---
title: 字体配置
createTime: 2025/10/11 18:38:13
permalink: /config/fontConfig-usage/
---

# 字体配置

自定义网站的字体，支持系统字体、Google Fonts 和自定义网络字体。

## 配置文件

文件路径：`src/config/fontConfig.ts`

## 配置详解

### 1. 基础设置

```typescript
export const fontConfig = {
  // 是否启用自定义字体功能
  enable: true,

  // 是否预加载字体文件
  // 开启后可以提高字体加载速度，减少闪烁
  preload: true,

  // 当前选中的字体
  // 可以是一个字符串，也可以是一个数组（作为回退链）
  // 对应 fonts 对象中的 key
  selected: ["system"], 
  // 示例: selected: ["zen-maru-gothic", "system"],
  
  // ...
};
```

### 2. 字体定义 (`fonts`)

在 `fonts` 对象中定义可用的字体配置：

```typescript
fonts: {
  // 系统字体配置示例
  system: {
    id: "system",
    name: "系统字体",
    src: "", // 系统字体不需要 src
    family: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
  },

  // Google Fonts 配置示例
  "zen-maru-gothic": {
    id: "zen-maru-gothic",
    name: "Zen Maru Gothic",
    // 字体文件链接 (CSS 或 字体文件 URL)
    src: "https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@300;400;500;700;900&display=swap",
    // CSS font-family 名称
    family: "Zen Maru Gothic",
    // 字体粗细 (可选)
    weight: 400,
    // font-display 属性 (可选)
    display: "swap",
  },
  
  // 自定义网络字体示例
  "misans-normal": {
    id: "misans-normal",
    name: "MiSans Normal",
    src: "https://unpkg.com/misans@4.1.0/lib/Normal/MiSans-Normal.min.css",
    family: "MiSans",
    weight: 400,
    display: "swap",
  },
},
```

### 3. 全局回退字体 (`fallback`)

当选中的字体加载失败或缺少字符时，使用的后备字体列表：

```typescript
fallback: [
  "system-ui",
  "-apple-system",
  "BlinkMacSystemFont",
  "Segoe UI",
  "Roboto",
  "sans-serif",
],
```

