---
title: 留言板配置
createTime: 2025/01/27 18:38:14
permalink: /config/guestbook-usage/
---
# 留言板配置

## 概述

Firefly 主题支持留言板功能，允许访客在专门的留言页面发表评论和交流。留言板页面支持 Markdown 内容编辑，并集成评论系统，提供完整的留言体验。

## 页面开关

留言板功能默认启用，您可以在 `src/config/siteConfig.ts` 文件中控制其显示：

```typescript
pages: {
  guestbook: true, // 留言板页面开关，设为 false 会隐藏页面
}
```

### 开关说明

| 选项 | 类型 | 说明 |
|------|------|------|
| `guestbook` | `boolean` | 留言板页面开关，`true` 启用，`false` 禁用 |

当设置为 `false` 时：
- 留言板页面将返回 404 错误
- 导航栏中的留言板链接将自动隐藏

## 页面结构

留言板页面由两部分组成：
1. **Markdown 内容区域**：显示自定义的介绍和说明
2. **评论区**：访客可以在此留言交流

## 修改留言板内容

留言板的内容存储在 `src/content/spec/guestbook.md` 文件中，您可以直接编辑此文件来自定义页面内容。

### 文件位置

```
src/content/spec/guestbook.md
```

### 内容示例

```markdown
---
title: "留言板"
description: "在这里留下你的足迹"
---

# 💬 留言板

欢迎来到留言板！这里是一个自由交流的空间，你可以：

- 💭 分享你的想法和观点
- 📝 留下你的建议和反馈
- 🎉 记录你的心情和故事
- 🤝 与其他访客互动交流

无论你想说什么，都欢迎在下方评论区留言！

---

**温馨提示**：
- 请保持友善和尊重，营造良好的交流氛围
- 欢迎分享你的想法，也可以提出对网站的建议
- 你的每一条留言都是对我最大的支持 ✨
```

### 支持的 Markdown 语法

留言板内容支持标准 Markdown 语法以及 Firefly 主题的扩展语法：

- **标准 Markdown**：标题、列表、链接、图片、代码块等
- **GitHub 卡片**：使用 `::github{repo="用户名/仓库名"}` 
- **注意框**：使用 `> [!NOTE]`、`> [!TIP]`、`> [!WARNING]` 等
- **数学公式**：使用 `$inline$` 和 `$$block$$` 语法

## 评论系统配置

留言板需要评论系统支持才能正常工作。如果未启用评论系统，页面会显示友好的提示信息。

### 启用评论系统

在 `src/config/commentConfig.ts` 文件中配置评论系统：

```typescript
export const commentConfig: CommentConfig = {
  type: 'twikoo', // 选择评论系统：none, twikoo, waline, giscus, disqus
  // ... 其他配置
};
```

### 支持的评论系统

- **Twikoo**：轻量级评论系统
- **Waline**：功能丰富的评论系统
- **Giscus**：基于 GitHub Discussions
- **Disqus**：老牌评论服务

详细配置请参考 [评论系统配置文档](/config/commentConfig-usage/)。

## 导航栏配置

留言板会自动添加到导航栏中（当页面开关启用时）。您可以在 `src/config/navBarConfig.ts` 中自定义其位置：

```typescript
// 根据配置决定是否添加留言板页面
if (siteConfig.pages.guestbook) {
  links.push(LinkPreset.Guestbook);
}
```

## 国际化支持

留言板支持多语言，已包含以下语言翻译：

- 简体中文：留言
- 繁体中文：留言
- 英文：Guestbook
- 日文：ゲストブック
- 俄文：Гостевая книга

翻译键定义在 `src/i18n/i18nKey.ts` 中，您可以在语言文件中自定义翻译内容。

## 常见问题

### Q: 留言板页面显示 404？

**A:** 检查 `siteConfig.pages.guestbook` 是否设置为 `true`，以及 `src/content/spec/guestbook.md` 文件是否存在。

### Q: 评论区不显示？

**A:** 确保在 `commentConfig.ts` 中正确配置了评论系统，并且 `type` 不是 `"none"`。如果评论系统未配置，页面会显示提示信息。

### Q: 如何修改留言板的样式？

**A:** 留言板页面的样式由 `src/pages/guestbook.astro` 文件控制。如果需要修改布局，可以编辑此文件。

### Q: 留言板支持哪些 Markdown 扩展？

**A:** 支持所有 Firefly 主题支持的 Markdown 扩展语法，包括 GitHub 卡片、注意框、数学公式等。

## 相关文档

- [站点配置](/config/siteConfig-usage/) - 页面开关配置
- [评论系统配置](/config/commentConfig-usage/) - 评论系统设置
- [自定义页面](/special/about/) - 了解如何自定义页面内容

