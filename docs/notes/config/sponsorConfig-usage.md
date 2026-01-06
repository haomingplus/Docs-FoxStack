---
title: 赞助配置
createTime: 2025/01/27 18:38:14
permalink: /config/sponsorConfig-usage/
---

# 赞助配置

创作不易，如果你的文章帮助到了别人，不妨开启赞助功能，让热心的读者请你喝杯咖啡吧！☕️

文件位置：`src/config/sponsorConfig.ts`

## 页面与功能设置

首先，我们可以配置赞助页面的基本信息和显示逻辑。

```typescript
export const sponsorConfig: SponsorConfig = {
  // 页面信息
  title: "赞助本站",      // 赞助页面的标题
  description: "",       // 页面描述，留空则使用默认翻译
  usage: "您的赞助将用于服务器维护、内容创作...", // 资金用途说明，让读者知道钱花哪儿了
  
  // 显示开关
  showSponsorsList: true, // 是否在赞助页面下方显示"赞助者列表"
  showButtonInPost: true, // 是否在每篇文章底部显示"打赏"按钮
  
  // ... 后续配置
};
```

## 赞助方式 (Methods)

这里配置你支持的收款方式，比如微信、支付宝、爱发电等。

```typescript
  methods: [
    {
      name: "支付宝",
      icon: "fa6-brands:alipay",                   // 图标，支持 Iconify 图标库
      qrCode: "/assets/images/sponsor/alipay.png", // 收款码图片路径
      link: "",                                    // 跳转链接（如果有）
      description: "使用 支付宝 扫码赞助",           // 辅助说明文字
      enabled: true,                               // 是否启用该方式
    },
    {
      name: "爱发电",
      icon: "simple-icons:afdian",
      qrCode: "",
      link: "https://afdian.com/a/cuteleaf",       // 爱发电通常使用链接跳转
      description: "通过 爱发电 进行赞助",
      enabled: true,
    },
  ],
```

## 赞助者列表 (Sponsors)

手动维护一份感谢名单，记录每一份温暖的支持。

```typescript
  sponsors: [
    {
      name: "夏叶",          // 赞助者昵称
      amount: "¥50",        // 赞助金额
      date: "2025-10-01",   // 赞助日期
      message: "感谢分享！", // 留言（可选）
    },
    {
      name: "匿名用户",
      amount: "¥20",
      date: "2025-10-01",
    },
  ],
};
```

## 关键参数说明

### 基础配置
| 参数 | 类型 | 说明 |
| :--- | :--- | :--- |
| `title` | string | 赞助页面的大标题。 |
| `description` | string | 页面副标题或简短描述。 |
| `usage` | string | 详细的资金用途说明。 |
| `showSponsorsList` | boolean | 是否公开展示下方的 `sponsors` 列表。 |
| `showButtonInPost` | boolean | 是否在文章页底部添加打赏入口。 |

### 赞助方式 (`methods`)
| 参数 | 类型 | 说明 |
| :--- | :--- | :--- |
| `name` | string | 支付方式名称，如"微信支付"。 |
| `icon` | string | 对应的图标 ID。 |
| `qrCode` | string | 收款码图片的本地路径。 |
| `link` | string | 点击跳转的支付链接（适用于爱发电、PayPal 等）。 |
| `description` | string | 支付方式的简短说明。 |
| `enabled` | boolean | 是否启用。 |

### 赞助者 (`sponsors`)
| 参数 | 类型 | 说明 |
| :--- | :--- | :--- |
| `name` | string | 赞助者名字。 |
| `amount` | string | 金额字符串，如 "¥50"。 |
| `date` | string | 日期字符串。 |
| `message` | string | 赞助者的留言（可选）。 |

