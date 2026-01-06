---
title: 评论系统设置
createTime: 2025/01/27 18:38:13
permalink: /config/commentConfig-usage/
---
# 评论系统设置

## 这是什么？

让访客可以在你的文章下留言。Firefly 支持多种评论系统，你可以选择一个自己喜欢的。

## 文件在哪里？

```
src/config/commentConfig.ts
```

## 如何修改？

首先，你需要选择一个评论系统。目前最推荐使用的是 **Waline** 或 **Giscus**。

### 1. 选择评论系统

找到 `type` 字段，填入你想要使用的系统名称：

```typescript
export const commentConfig: CommentConfig = {
  // 评论系统类型: none, twikoo, waline, giscus, disqus, artalk
  // 默认为 none，即不启用评论系统
  type: "none",

  // ... 其他配置
}
```

### 2. 填写对应配置

根据你选择的系统，填写下面的详细信息。**只需要填写你选用的那个系统的配置，其他的可以不管。**

#### Twikoo 配置
Twikoo 是一个简洁、安全、免费的静态网站评论系统。

```typescript
  twikoo: {
    // 你的 Twikoo 环境 ID (例如: https://twikoo.vercel.app)
    envId: "https://twikoo.vercel.app",
    // 评论系统语言
    lang: "zh-CN",
    // 是否开启文章访问量统计功能
    visitorCount: true,
  },
```

#### Waline 配置 (推荐)
Waline 是一款简洁、安全的评论系统。

```typescript
  waline: {
    // 你的 Waline 服务端地址
    serverURL: "https://waline.vercel.app",
    // 评论系统语言
    lang: "zh-CN",
    // 评论登录模式
    // 'enable'  - 默认，允许访客匿名评论和用第三方 OAuth 登录评论
    // 'force'   - 强制必须登录后才能评论
    // 'disable' - 禁止所有登录，仅允许匿名评论
    login: "enable",
    // 是否开启文章访问量统计功能
    visitorCount: true,
  },
```

#### Artalk 配置
Artalk 是一款简洁的自托管评论系统。

```typescript
  artalk: {
    // 后端程序 API 地址
    server: "https://artalk.example.com/",
    // 评论系统语言
    locale: "zh-CN",
    // 是否开启文章访问量统计功能
    visitorCount: true,
  },
```

#### Giscus 配置 (GitHub 风格)
Giscus 利用 GitHub Discussions 实现评论功能。

```typescript
  giscus: {
    // 你的 GitHub 仓库 (格式: 用户名/仓库名)
    repo: "CuteLeaf/Firefly",
    // 仓库 ID (可在 Giscus 官网获取)
    repoId: "R_kgD2gfdFGd",
    // Discussion 分类名
    category: "General",
    // 分类 ID
    categoryId: "DIC_kwDOKy9HOc4CegmW",
    // 页面与 Discussion 的映射方式 (推荐 'title')
    mapping: "title",
    // 是否启用严格模式 (0: 关闭, 1: 开启)
    strict: "0",
    // 是否启用反应功能 (0: 关闭, 1: 开启)
    reactionsEnabled: "1",
    // 是否发送元数据 (0: 关闭, 1: 开启)
    emitMetadata: "1",
    // 评论框位置 ('top' 或 'bottom')
    inputPosition: "top",
    // 评论系统语言
    lang: "zh-CN",
    // 加载方式 ('lazy' 或 'eager')
    loading: "lazy",
  },
```

#### Disqus 配置
Disqus 是一个老牌的评论托管服务。

```typescript
  disqus: {
    // 你的 Disqus shortname
    shortname: "firefly",
  },
```

## 常见问题

**Q: 我不想开启评论怎么办？**
A: 把 `type` 设置为 `'none'` 即可。

**Q: `visitorCount` 是什么？**
A: 这是一个开关，如果设置为 `true`，并且你使用的评论系统支持（如 Waline, Twikoo, Artalk），它会在文章页面显示文章的阅读次数。
