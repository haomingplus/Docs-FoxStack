---
title: 导航栏配置
createTime: 2025/10/11 18:38:14
permalink: /config/navBarConfig-usage/
---
# 导航栏配置

## 📝 这是什么？

导航栏是网站顶部的菜单条，是用户浏览网站的主要入口。你可以添加链接、下拉菜单，以及配置搜索功能。

## 📂 文件位置

```
src/config/navBarConfig.ts
```

## 🛠️ 配置详解

### 1. 链接管理 (Links)

你可以混合使用 **预设链接** 和 **自定义链接**。

```typescript
export const navBarConfig: NavBarConfig = {
  links: [
    // --- 使用预设 (推荐) ---
    LinkPreset.Home,    // 首页
    LinkPreset.Archive, // 归档页
    LinkPreset.About,   // 关于页
    
    // --- 自定义链接 ---
    {
      name: "我的项目",        // 显示名称
      url: "/projects/",      // 链接地址
      icon: "material-symbols:rocket", // 图标 (可选)
    },
    
    // --- 外部链接 ---
    {
      name: "GitHub",
      url: "https://github.com/yourname",
      external: true,         // ⚠️ 外部链接必须设为 true
      icon: "fa6-brands:github",
    },

    // --- 下拉菜单 (多级导航) ---
    {
      name: "更多",
      url: "#",               // 父菜单通常不跳转
      icon: "material-symbols:menu",
      children: [             // 子菜单列表
        { name: "友情链接", url: "/friends/" },
        { name: "留言板", url: "/guestbook/" },
        LinkPreset.Sponsor,   // 子菜单里也可以用预设！
      ],
    },
  ],
};
```

### 2. 搜索配置 (Search)

Firefly 支持两种搜索模式，满足不同需求。

```typescript
export const navBarSearchConfig: NavBarSearchConfig = {
  // 搜索模式选择：
  // NavBarSearchMethod.PageFind (推荐)
  // NavBarSearchMethod.MeiliSearch
  method: NavBarSearchMethod.PageFind,

  // MeiliSearch 配置 (仅当 method 选为 MeiliSearch 时需要)
  meiliSearchConfig: {
    INDEX_NAME: "posts",
    MEILI_HOST: "http://your-meilisearch-host:7700",
    PUBLIC_MEILI_SEARCH_KEY: "your-search-key",
  },
};
```

#### 🔍 模式对比

| 特性 | PageFind (推荐) | MeiliSearch |
| :--- | :--- | :--- |
| **类型** | 静态搜索 | 全文搜索引擎 |
| **部署难度** | **极低** (无需配置) | 高 (需要部署服务) |
| **资源占用** | 低 (前端运行) | 高 (需要服务器内存) |
| **适用场景** | 个人博客、静态网站 | 数据量巨大的站点 |

## 💡 小贴士

-   **LinkPreset (预设)**：我们为你准备了常用的预设，如 `Home`, `Archive`, `About`, `Friends`, `Guestbook` 等，直接导入使用即可，省去手动敲代码的麻烦。
-   **图标**：同样支持 Iconify 图标库，去 [Icones](https://icones.js.org/) 找个喜欢的图标吧！
