---
title: 看板娘配置
createTime: 2025/10/11 18:38:14
permalink: /config/pioConfig-usage/
---

# 看板娘配置

配置网站右下角的看板娘（虚拟助手），支持 Spine 和 Live2D 两种模型格式。

## 配置文件

文件路径：`src/config/pioConfig.ts`

## 配置详解

配置文件中包含 `spineModelConfig` (Spine 模型) 和 `live2dModelConfig` (Live2D 模型) 两部分配置，你可以根据需要启用其中一种。

### 1. 通用配置项

两种模型的配置结构非常相似：

```typescript
// 启用开关
enable: true,

// 模型配置
model: {
  // 模型文件路径 (JSON 文件)
  path: "/pio/models/spine/firefly/1310.json",
  // 缩放比例
  scale: 1.0,
  // X 轴偏移量
  x: 0,
  // Y 轴偏移量
  y: 0,
},

// 位置配置
position: {
  // 显示角落
  // 'bottom-left', 'bottom-right', 'top-left', 'top-right'
  corner: "bottom-left",
  // 水平偏移
  offsetX: 0,
  // 垂直偏移
  offsetY: 0,
},

// 容器尺寸
size: {
  width: 135,
  height: 165,
},

// 交互配置
interactive: {
  // 是否启用交互
  enabled: true,
  // 点击时的随机消息列表
  clickMessages: [
    "你好呀！",
    "今天也要加油哦！✨",
  ],
  // 消息显示时长 (毫秒)
  messageDisplayTime: 3000,
},

// 响应式配置
responsive: {
  // 在移动端是否隐藏
  hideOnMobile: true,
  // 移动端断点
  mobileBreakpoint: 768,
},

// CSS 层级
zIndex: 1000,

// 不透明度
opacity: 1.0,
```

### 2. Spine 模型特有配置

Spine 模型支持更丰富的动画交互：

```typescript
interactive: {
  // ... 通用配置 ...

  // 点击时随机播放的动画名称列表
  clickAnimations: [
    "emoji_0",
    "emoji_1",
    "emoji_2",
  ],

  // 待机动画列表
  idleAnimations: ["idle", "emoji_0", "emoji_1"],
  
  // 待机动画切换间隔 (毫秒)
  idleInterval: 8000,
},
```

### 3. Live2D 模型特有配置

Live2D 模型的动作和表情通常定义在模型文件中，配置相对简单。

```typescript
// Live2D 配置通常不需要手动指定动画列表
// 动作和表情将从 model.json 中自动读取
```
