---
title: 个人资料设置
createTime: 2025/01/27 18:38:13
permalink: /config/profileConfig-usage/
---
# 个人资料设置

## 📝 这是什么？

这个配置控制侧边栏或"关于我"页面中显示的个人信息卡片。这是让访客认识你的第一步！

## 📂 文件位置

```
src/config/profileConfig.ts
```

## 🛠️ 配置详解

```typescript
export const profileConfig: ProfileConfig = {
  // 头像路径
  // 建议使用正方形图片 (200x200以上)，放在 public/assets/images/ 下
  avatar: "/assets/images/avatar.webp", 
  
  // 你的名字或昵称
  name: "Firefly", 
  
  // 个人简介 / 签名
  // 支持简单的 HTML 标签，比如 <br> 换行
  bio: "Hello, I'm Firefly.",

  // 社交链接
  // 显示在头像下方的图标栏
  links: [ 
    {
      name: "Bilibili", // 链接名称
      icon: "fa6-brands:bilibili", // 图标代码 (见下方说明)
      url: "https://space.bilibili.com/38932988", // 跳转链接
      showName: false, // 是否显示文字？false=只显示图标 (推荐)
    },
    {
      name: "GitHub",
      icon: "fa6-brands:github",
      url: "https://github.com/CuteLeaf",
      showName: false,
    },
    {
      name: "Email",
      icon: "fa6-solid:envelope",
      url: "mailto:xiaye@msn.com", // 邮件链接格式
      showName: false,
    },
  ],
};
```

## 💡 如何找到图标？

Firefly 内置了强大的图标支持 (基于 Iconify)。

1.  打开 [Icones](https://icones.js.org/) 网站。
2.  搜索你想要的图标，例如 "twitter", "steam", "rss"。
3.  点击你喜欢的图标，复制它的 **名称** (例如 `mdi:twitter`)。
4.  将名称填入配置文件的 `icon` 字段即可。

> **常用图标集推荐：**
> - `fa6-brands`: 品牌图标 (GitHub, Twitter, Bilibili 等)
> - `fa6-solid`: 实心通用图标 (Email, Home, User 等)
> - `material-symbols`: Google Material Design 图标

