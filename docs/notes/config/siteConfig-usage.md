---
title: 站点基本设置
createTime: 2025/01/27 18:38:13
permalink: /config/siteConfig-usage/
---

# 站点基本设置

## 📝 这是什么？

这是 Firefly 主题的核心控制台。它决定了你网站的"门面"——包括名字、描述、主题色、功能开关等。
如果你是第一次安装，**请务必优先修改这里**。

## 📂 文件位置

```
src/config/siteConfig.ts
```

## 🛠️ 配置详解

### 1. 基础信息 (Basic Info)

这些是网站最基本的身份信息，SEO (搜索引擎优化) 也会用到。

```typescript
export const siteConfig: SiteConfig = {
  // 网站标题：显示在浏览器标签页和导航栏左侧
  title: "Firefly", 
  
  // 网站副标题：通常显示在标题旁边
  subtitle: "Demo site", 
  
  // 网站地址：发布上线时请务必修改为你的实际域名！
  site_url: "https://firefly.cuteleaf.cn", 
  
  // 网站描述：简单介绍下你的博客，有助于 SEO
  description: "Firefly 是一款...", 
  
  // 关键词：方便别人搜到你的博客
  keywords: ["Firefly", "Astro", "博客"],
  
  // 网站语言：中文请填 "zh_CN"，英文填 "en"
  lang: "zh_CN", 
  
  // 站点建立日期：用于计算网站运行天数 (YYYY-MM-DD)
  siteStartDate: "2025-01-01", 
};
```

### 2. 主题外观 (Appearance)

打造你独一无二的博客风格。

#### 主题色与 Logo

```typescript
themeColor: {
  // 主题色色相值 (0-360)
  // 0=红, 165=青, 240=蓝。你可以试着填不同的数字看看效果！
  hue: 165, 
  
  // 是否固定颜色？
  // false = 允许访客在页面上自己选颜色 (推荐)
  // true = 强制使用你设置的颜色，访客无法更改
  fixed: false, 
  
  // 默认模式
  // "light" = 亮色, "dark" = 暗色, "system" = 跟随系统设置
  defaultMode: "system", 
},

// 网站图标 (Favicon) 设置
favicon: [
  {
    src: "/assets/images/favicon.ico", // 图标路径
    theme: "light", // (可选) 适用主题：'light' | 'dark'
    sizes: "32x32", // (可选) 图标尺寸
  }
],

// 导航栏配置
navbar: {
  // 导航栏 Logo 设置
  logo: {
    // 方式一：使用图片 (推荐)
    type: "image",
    value: "/assets/images/firefly.png", // 图片路径
    alt: "🍀", // 图片描述
    
    // 方式二：使用图标
    // type: "icon",
    // value: "material-symbols:home-pin-outline",
  },

  // 导航栏标题：如果不填，默认使用 siteConfig.title
  title: "Firefly", 

  // 导航栏是否全宽：true = 占满屏幕宽度，false = 限制在内容区域宽度
  widthFull: false,

  // 导航栏图标和标题是否跟随主题色
  followTheme: false,
},
```

### 3. 其他配置

关于背景壁纸的配置，请查看 [背景壁纸配置](/config/backgroundWallpaper-usage/)。

### 4. 功能与页面 (Features & Pages)

控制网站的各种功能模块开关。

```typescript
// Bangumi 追番组件配置
bangumi: {
  userId: "1163581", // 你的 Bangumi 用户 ID
},

// 是否在文章底部显示"上次编辑时间"
showLastModified: true,

// 是否生成 OpenGraph 图片 (分享链接时的预览图)
// 注意：开启后构建时间会变长，建议本地调试时关闭 (false)
generateOgImages: false,

// 独立页面开关
// 设为 false 后，对应的路由会返回 404
pages: {
  sponsor: true,   // 赞助页面
  guestbook: true, // 留言板
  bangumi: true,   // 追番列表
},
```

### 5. 文章列表布局 (Post List Layout)

自定义首页和归档页的文章展示方式。

```typescript
postListLayout: {
  // 默认布局模式
  // "list" = 列表模式 (单列，经典博客风格)
  // "grid" = 网格模式 (双列，卡片风格)
  defaultMode: "list",
  
  // 是否允许用户切换布局
  allowSwitch: true,

  // 网格模式的高级配置
  grid: {
    // 瀑布流布局：开启后卡片高度自适应，适合封面图高度不一的情况
    masonry: true,
  },
},

// 分页设置
pagination: {
  postsPerPage: 8, // 每页显示多少篇文章
},
```

