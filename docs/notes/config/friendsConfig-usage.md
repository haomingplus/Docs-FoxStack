---
title: 友链配置
createTime: 2025/10/11 18:38:14
permalink: /config/friendsConfig-usage/
---

# 友链配置

友链（友情链接）是博客社交的重要一环。在这里，你可以展示小伙伴们的博客，互相引流，共同进步！

文件位置：`src/config/friendsConfig.ts`

## 页面配置

你可以控制友链页面的布局显示。

```typescript
export const friendsPageConfig: FriendsPageConfig = {
  // 显示列数：2列或3列
  // 2 = 双列布局 (卡片更宽)
  // 3 = 三列布局 (卡片更紧凑)
  columns: 2,
};
```

## 友链列表配置

`friendsConfig` 是一个数组，每一项代表一个友链。

```typescript
export const friendsConfig: FriendLink[] = [
  {
    title: "夏夜流萤",                                     // 博客标题
    imgurl: "https://q1.qlogo.cn/g?b=qq&nk=7618557&s=640", // 头像链接
    desc: "飞萤之火自无梦的长夜亮起...",                     // 博客简介/描述
    siteurl: "https://blog.cuteleaf.cn",                   // 博客地址
    tags: ["Blog"],                                        // 标签，用于分类或展示
    weight: 10,                                            // 权重，数字越大排序越靠前
    enabled: true,                                         // 是否启用，设为 false 则暂时隐藏
  },
  {
    title: "Astro",
    imgurl: "https://avatars.githubusercontent.com/u/44914786?v=4&s=640",
    desc: "The web framework for content-driven websites.",
    siteurl: "https://github.com/withastro/astro",
    tags: ["Framework"],
    weight: 8,
    enabled: true,
  },
];
```

## 关键参数说明

| 参数 | 类型 | 说明 |
| :--- | :--- | :--- |
| `title` | string | 友链的标题，通常是博主的名字或博客名。 |
| `imgurl` | string | 头像图片的链接。可以是网络图片，也可以是本地图片（如 `/assets/avatar.png`）。 |
| `desc` | string | 简短的描述，介绍一下这个博客是干什么的。 |
| `siteurl` | string | 点击跳转的链接地址。 |
| `tags` | string[] | 标签数组，比如 `["技术", "生活"]`，让读者更直观地了解博客类型。 |
| `weight` | number | 排序权重。**数字越大，排名越靠前**。想把好朋友置顶？把这个数改大点！ |
| `enabled` | boolean | 开关。设为 `false` 时，该友链不会显示在页面上，方便临时下架而不用删除代码。 |

## 小贴士

- **头像失效？** 建议将朋友的头像下载到 `public/assets/` 目录，使用本地路径引用，这样更稳定。
- **排序规则：** 默认使用 `getEnabledFriends` 函数，它会自动过滤掉 `enabled: false` 的项，并按 `weight` 降序排列。
