---
title: 页脚自定义
createTime: 2025/10/11 18:38:13
permalink: /config/footerConfig-usage/
---
# 页脚自定义

## 这是什么？

你可以在网站的最底部添加一些自定义的内容。比如：
- 网站备案号 (ICP)
- 网站统计代码 (Google Analytics, 百度统计)
- 额外的版权声明

## 文件在哪里？

这里涉及两个文件：
1. **开关设置**: `src/config/footerConfig.ts`
2. **内容文件**: `src/config/FooterConfig.html`

## 如何修改？

### 第一步：开启功能

打开 `src/config/footerConfig.ts`，确保 `enable` 是 `true`。

```typescript
export const footerConfig: FooterConfig = {
  // 是否启用 Footer HTML 注入功能
  enable: false, 
};
```

### 第二步：添加内容

打开 `src/config/FooterConfig.html`，直接写 HTML 代码。这个文件里的内容会直接插入到页面底部。

**示例 1：添加备案号**
```html
<div class="beian">
  <a href="https://beian.miit.gov.cn/" target="_blank">京ICP备12345678号</a>
</div>
```

**示例 2：添加统计代码**
```html
<!-- 百度统计代码 -->
<script>
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?你的ID";
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
})();
</script>
```

## 小贴士

- 请确保 `FooterConfig.html` 中的 HTML 代码格式正确。
- 如果你不需要添加任何东西，可以在 `footerConfig.ts` 里把 `enable` 改为 `false`。

