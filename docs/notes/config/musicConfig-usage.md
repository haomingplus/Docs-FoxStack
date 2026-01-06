---
title: 音乐播放器配置
createTime: 2025/01/27 18:38:13
permalink: /config/musicConfig-usage/
---

# 音乐播放器配置

为你的博客添加背景音乐，支持 MetingJS（网易云/QQ音乐）和本地播放列表。

## 配置文件

文件路径：`src/config/musicConfig.ts`

## 配置详解

### 1. 基础设置

```typescript
export const musicPlayerConfig: MusicPlayerConfig = {
  // 启用音乐播放器功能
  enable: true,

  // 播放器模式
  // 'meting': 使用 Meting API (网易云/QQ音乐等)
  // 'local': 使用本地音乐列表
  mode: "meting",
  
  // ...
};
```

### 2. Meting 模式配置 (在线歌单)

当 `mode` 设置为 `'meting'` 时，以下配置生效：

```typescript
meting: {
  // Meting API 地址
  // 默认使用官方 API，也可以搭建自己的 API 服务
  api: "https://api.i-meto.com/meting/api?server=:server&type=:type&id=:id&r=:r",

  // 音乐平台
  // 'netease': 网易云音乐
  // 'tencent': QQ音乐
  // 'kugou': 酷狗音乐
  // 'xiami': 虾米音乐
  // 'baidu': 百度音乐
  server: "netease",

  // 资源类型
  // 'song': 单曲
  // 'playlist': 歌单
  // 'album': 专辑
  // 'search': 搜索
  // 'artist': 艺术家
  type: "playlist",

  // 资源 ID
  // 例如网易云歌单链接 https://music.163.com/#/playlist?id=10046455237 中的 10046455237
  id: "10046455237",

  // 认证 token (可选，部分私有 API 需要)
  auth: "",

  // 备用 API 列表
  // 当主 API 无法访问时，会自动尝试这些备用 API
  fallbackApis: [
    "https://api.injahow.cn/meting/?server=:server&type=:type&id=:id",
    "https://api.moeyao.cn/meting/?server=:server&type=:type&id=:id",
  ],

  // MetingJS 脚本路径
  // 可以配置 CDN 地址或本地路径
  jsPath: "https://unpkg.com/meting@2/dist/Meting.min.js",
},
```

### 3. Local 模式配置 (本地音乐)

当 `mode` 设置为 `'local'` 时，以下配置生效：

```typescript
local: {
  // 播放列表
  playlist: [
    {
      name: "使一颗心免于哀伤",     // 歌曲名称
      artist: "知更鸟",             // 艺术家
      url: "/assets/music/song.wav", // 音乐文件路径 (相对于 public 目录)
      cover: "/assets/music/cover.jpg", // 封面图片路径
      lrc: "",                      // 歌词内容 (LRC 格式字符串)
    },
    // 可以添加更多歌曲...
  ],
},
```

### 4. 播放器行为配置

控制播放器的外观和交互行为：

```typescript
player: {
  // 是否自动播放
  // 注意：现代浏览器通常会阻止未经用户交互的自动播放
  autoplay: false,

  // 主题色 (进度条颜色等)
  theme: "var(--btn-regular-bg)",

  // 循环模式
  // 'all': 列表循环
  // 'one': 单曲循环
  // 'none': 不循环
  loop: "all",

  // 播放顺序
  // 'list': 顺序播放
  // 'random': 随机播放
  order: "list",

  // 预加载策略
  // 'none': 不预加载
  // 'metadata': 仅加载元数据
  // 'auto': 自动加载
  preload: "auto",

  // 默认音量 (0.0 - 1.0)
  volume: 0.7,

  // 互斥播放
  // true: 播放此播放器时暂停其他播放器
  mutex: true,

  // 歌词显示类型 (仅 Local 模式)
  // 0: 不显示
  // 1: 显示 (需要提供 lrc 字段)
  // 2: 显示 (从 HTML 内容读取)
  lrcType: 1,

  // 歌词默认是否隐藏
  // true: 默认隐藏，需点击按钮显示
  lrcHidden: true,

  // 播放列表默认是否折叠
  listFolded: false,

  // 播放列表最大高度
  listMaxHeight: "340px",

  // 本地存储键名 (用于保存用户设置)
  storageName: "aplayer-setting",
},
```

### 5. 响应式配置

控制在不同设备上的显示：

```typescript
responsive: {
  mobile: {
    // 在移动端是否隐藏播放器
    hide: false,
    // 移动端断点 (像素)
    breakpoint: 768,
  },
},
```
