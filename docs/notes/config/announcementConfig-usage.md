---
title: 网站公告设置
createTime: 2025/01/27 18:38:13
permalink: /config/announcementConfig-usage/
---
# 网站公告设置

## 这是什么？

这是一个显示在网站顶部的横幅消息。你可以用它来发布重要通知、欢迎语，或者分享一个新的链接。

## 文件在哪里？

```
src/config/announcementConfig.ts
```

## 如何修改？

```typescript
export const announcementConfig: AnnouncementConfig = {
  // 公告标题
  title: "公告", 
  
  // 公告内容
  content: "欢迎来到我的博客！这是一则示例公告。", 
  
  // 是否允许用户关闭公告？
  // true = 用户点击关闭后，本次会话将不再显示
  closable: true, 
  
  // 公告中的链接配置
  link: {
    // 是否启用链接？
    enable: true, 
    // 链接显示的文本
    text: "了解更多", 
    // 链接跳转的 URL
    url: "/about/", 
    // 是否为外部链接？
    // false = 站内跳转 (SPA 路由)
    // true = 打开新标签页
    external: false, 
  },
};
```

## 小贴士

- 如果你想暂时关闭公告，最简单的方法是把内容清空，或者在代码里注释掉相关逻辑。
- `link.external` 设置为 `true` 时，点击链接会在新窗口打开，适合跳转到其他网站。
