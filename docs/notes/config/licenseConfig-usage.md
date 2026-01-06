---
title: 版权协议设置
createTime: 2025/01/27 18:38:13
permalink: /config/licenseConfig-usage/
---
# 版权协议设置

## 这是什么？

显示在每篇文章底部的版权声明。告诉读者他们可以如何转载或使用你的文章。

## 文件在哪里？

```
src/config/licenseConfig.ts
```

## 如何修改？

```typescript
export const licenseConfig: LicenseConfig = {
  // 是否启用版权声明？
  // true = 显示，false = 隐藏
  enable: true,
  
  // 协议名称
  // 例如：CC BY-NC-SA 4.0
  name: "CC BY-NC-SA 4.0",
  
  // 协议详细内容的 URL 链接
  url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};
```

## 常用协议推荐

- **CC BY-NC-SA 4.0** (推荐): 别人可以转载，但必须署名、不能商用、且转载后的文章也要用同样的协议。
- **CC BY 4.0**: 只要署名，怎么用都行（包括商用）。
- **Copyright © All Rights Reserved**: 保留所有权利，未经允许严禁转载。
