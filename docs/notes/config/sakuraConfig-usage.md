---
title: 樱花特效配置
createTime: 2025/01/27 18:38:13
permalink: /config/sakuraConfig-usage/
---

# 樱花特效配置

为你的网站添加浪漫的樱花飘落特效。🌸

## 配置文件

文件路径：`src/config/sakuraConfig.ts`

## 配置详解

```typescript
export const sakuraConfig: SakuraConfig = {
  // 是否启用樱花特效
  enable: false,

  // 樱花数量
  // 数量越多，屏幕上的樱花越密集，但可能会影响性能
  sakuraNum: 21,

  // 限制次数
  // -1: 无限循环
  // >0: 樱花飘落多少次后停止
  limitTimes: -1,

  // 樱花大小范围 (倍数)
  size: {
    min: 0.5, // 最小尺寸
    max: 1.1, // 最大尺寸
  },

  // 透明度范围
  opacity: {
    min: 0.3, // 最小不透明度
    max: 0.9, // 最大不透明度
  },

  // 运动速度配置
  speed: {
    // 水平移动速度
    horizontal: {
      min: -1.7, // 向左飘动的最小速度
      max: -1.2, // 向左飘动的最大速度
    },
    // 垂直下落速度
    vertical: {
      min: 1.5, // 下落最小速度
      max: 2.2, // 下落最大速度
    },
    // 旋转速度
    rotation: 0.03,
    // 消失速度 (不应大于最小不透明度)
    fadeSpeed: 0.03,
  },

  // CSS z-index 层级
  // 确保樱花在合适的层级显示，不会遮挡重要内容
  zIndex: 100,
};
```

