---
title: 番剧页面配置
createTime: 2025/10/11 17:21:41
permalink: /config/animeConfig-usage/
---

**番剧页面修改教程(本地数据源)**

Firefly 主题提供了内置的番剧页面，您可以轻松地自定义显示的番剧列表。



## 开启Bangumi模式

**番剧页面修改教程(Bangumi数据源)**

开关位于 `src/config/siteConfig.ts` 文件中。
```typescript
bangumi: {
		userId: "your-bangumi-id", // 在此处设置你的Bangumi用户ID
	}
```

把括号中的 "your-bangumi-id" 替换为Bangumi用户ID。

