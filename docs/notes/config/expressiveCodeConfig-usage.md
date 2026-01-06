---
title: 代码高亮配置
createTime: 2025/01/27 18:38:13
permalink: /config/expressiveCodeConfig-usage/
---

# 代码高亮配置

配置文章中代码块的语法高亮主题。Firefly 使用 Expressive Code 来提供强大的代码块功能。

## 配置文件

文件路径：`src/config/expressiveCodeConfig.ts`

## 配置详解

```typescript
export const expressiveCodeConfig: ExpressiveCodeConfig = {
  // 暗色模式下的代码主题
  // 推荐: "one-dark-pro", "dracula", "github-dark"
  darkTheme: "one-dark-pro",

  // 亮色模式下的代码主题
  // 推荐: "one-light", "github-light", "solarized-light"
  lightTheme: "one-light",

  // 更多可用主题和高级配置请参考 Expressive Code 官方文档
  // https://expressive-code.com/guides/themes/
};
```

### 常用主题列表

*   `github-dark` / `github-light`
*   `one-dark-pro` / `one-light`
*   `dracula`
*   `monokai`
*   `nord`
*   `solarized-dark` / `solarized-light`

