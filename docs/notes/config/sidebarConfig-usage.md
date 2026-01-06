---
title: 侧边栏配置
createTime: 2025/10/11 18:38:14
permalink: /config/sidebarConfig-usage/
---
# 侧边栏配置

## 📝 这是什么？

侧边栏是博客两侧的区域，用于展示个人资料、目录、公告、分类标签等小组件。你可以自由决定它们的位置和顺序。

## 📂 文件位置

```
src/config/sidebarConfig.ts
```

## 🛠️ 配置详解

### 1. 布局设置 (Layout)

首先决定你的博客要有几个侧边栏。

```typescript
export const sidebarLayoutConfig: SidebarLayoutConfig = {
  // 总开关：是否启用侧边栏
  enable: true,

  // 侧边栏位置：
  // "left" = 只有左侧边栏 (经典布局)
  // "both" = 双侧边栏 (左侧导航，右侧目录/统计)
  // ⚠️ 注意：开启 "both" 后，文章列表将强制为单列模式
  position: "both", 

  // ...
};
```

### 2. 组件管理 (Components)

侧边栏由一个个 `Widget` (组件) 组成。你可以分别配置左侧 (`leftComponents`) 和右侧 (`rightComponents`)。

#### 通用配置项

每个组件都有以下通用属性：

-   `enable`: `true`/`false`，是否开启。
-   `order`: 数字，决定显示顺序，数字越小越靠前。
-   `position`:
    -   `"top"`: 固定在顶部，页面滚动时会消失。
    -   `"sticky"`: 粘性定位，页面滚动时会吸附在屏幕上 (适合目录、标签)。
-   `type`: 组件类型 (见下文)。

#### 可用组件类型 (`type`)

| 类型 | 说明 | 常用位置 |
| :--- | :--- | :--- |
| `profile` | **个人资料卡**：头像、名字、社交链接 | 左侧顶部 |
| `announcement` | **公告栏**：显示重要通知 | 左侧/右侧顶部 |
| `categories` | **分类列表**：显示文章分类 | 左侧/右侧 Sticky |
| `tags` | **标签云**：显示文章标签 | 左侧/右侧 Sticky |
| `advertisement` | **广告/自定义卡片**：展示图片或推广 | 任意位置 |
| `toc` | **文章目录**：自动生成文章目录 (仅在文章页显示) | 右侧 Sticky |

### 3. 配置示例

```typescript
leftComponents: [
  // 1. 个人资料
  {
    type: "profile",
    enable: true,
    order: 1,
    position: "top",
    class: "onload-animation", // 进场动画类名
    animationDelay: 0, // 动画延迟
  },
  
  // 2. 分类列表 (带自动折叠功能)
  {
    type: "categories",
    enable: true,
    order: 3,
    position: "sticky", // 吸附效果
    responsive: {
      collapseThreshold: 5, // 如果分类超过 5 个，自动折叠显示
    },
  },
  
  // 3. 广告/自定义图片
  {
    type: "advertisement",
    enable: false, // 默认关闭
    order: 5,
    position: "sticky",
    configId: "ad1", // 对应 adConfig.ts 中的配置 ID
  },
],
```

## 💡 小贴士

-   **Sticky (粘性定位)**：建议将 `categories` (分类)、`tags` (标签) 或 `toc` (目录) 设置为 `sticky`，这样当用户阅读长文章时，这些导航工具会一直停留在视野中。
-   **响应式**：在移动端，侧边栏会自动隐藏到汉堡菜单中，或者显示在页面底部，无需额外配置。

  // 2. 文章目录 (TOC) - 非常重要！
  // 建议开启，方便读者快速跳转
  {
    type: "sidebarToc",
    enable: true,
    order: 2,
    position: "sticky",
    class: "onload-animation",
    animationDelay: 250,
    showOnPostPage: true, // 只在看文章时显示
  },
],
```

## 3. 常见修改

### Q: 我想把侧边栏关掉，只看文章？
A: 把 `enable` 改为 `false` 即可。

### Q: 手机上侧边栏去哪了？
A: 为了保证阅读体验，手机上侧边栏会自动隐藏或变成底部抽屉。你可以在 `responsive` 中配置：
```typescript
responsive: {
  layout: {
    mobile: "sidebar", // 强制在手机上也显示 (不推荐，屏幕太小)
    // 或者 "drawer" (抽屉模式)
  },
},
```

### Q: 怎么添加广告？
A: 使用 `advertisement` 组件，并指定 `configId`（对应 `adConfig.ts` 中的配置）。
```typescript
{
  type: "advertisement",
  enable: true,
  configId: "ad1", // 对应 adConfig.ts 中的 adConfig1
  // ...
}
```
