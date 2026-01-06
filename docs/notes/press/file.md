---
title: 新建文章
createTime: 2025/11/01 20:29:52
permalink: /press/file/
---
# 直接在posts目录创建文章

## 创建文章

1. 在`src/content/posts`目录下创建一个新的Markdown文件，文件名应该具有描述性，例如`my-first-post.md`。

2. 在文件中添加frontmatter（前置元数据），这是文章的配置信息，必须包含`title`和`description`字段：

```markdown
---
title: Markdown Tutorial
published: 2025-01-20
pinned: true
description: A simple example of a Markdown blog post.
tags: [Markdown, Blogging]
category: Examples
licenseName: "Unlicensed"
author: emn178
sourceLink: "https://github.com/emn178/markdown"
draft: false
date: 2025-01-20
image: ./cover.jpg
pubDate: 2025-01-20
---
```

## 关于slug字段

如果你需要自定义文章的URL路径，可以在frontmatter中添加`slug`字段：

```markdown
---
title: Markdown Tutorial
slug: custom-slug
...
```

这样访问路径就是`/posts/custom-slug/`，否则默认使用文件名作为URL路径。

> 建议slug只包含英文、数字和短横线，避免特殊字符。

## Frontmatter字段详解

frontmatter支持的字段包括：

### 必需字段
- `title`：文章标题（必需）
- `description`：文章描述（必需）

### 发布相关
- `published`：文章发布日期，格式为YYYY-MM-DD
- `pubDate`：文章发布日期（与published类似）
- `date`：文章创建日期
- `draft`：是否为草稿，true表示草稿，false表示正式发布

### 内容分类
- `tags`：文章标签数组，用于标记文章主题
- `category`：文章分类，用于组织文章
- `pinned`：是否置顶文章，true表示置顶

### 作者信息
- `author`：文章作者姓名
- `licenseName`：文章许可证名称，如"MIT"、"CC BY 4.0"等
- `sourceLink`：文章源链接，通常指向GitHub仓库或原始来源

### 图片设置
- `image`：文章封面图片(单文件方案会导致RSS无法正常构建图片的路径,如果你需要使用rss功能请使用文件夹写作方案)

### 固定链接
- `slug`：自定义文章URL路径，如果不设置，将使用文件名作为URL。

3. 在frontmatter下方编写文章内容，可以使用标准的Markdown语法。

## Markdown学习资源

如果您还不熟悉Markdown语法，建议先学习基础知识：

📚 **推荐学习地址**：[菜鸟教程 - Markdown教程](https://www.runoob.com/markdown/md-tutorial.html)


## 预览文章

保存文件后，可以在浏览器中预览文章。将文章文件名（不包括.md扩展名）拼接到预览URL的末尾即可查看。
例如，如果本地开发服务器运行在`http://localhost:4321/`，文章文件名为`my-first-post.md`，则可以通过`http://localhost:4321/posts/my-first-post`访问文章。

如果文章尚未创建或文件名错误，页面将显示404错误。当你预览一个尚未创建的文章时，控制台会显示不同的输出，这有助于进行故障排查。

## 链接到文章

要在博客页面或其他页面中链接到你的文章，可以使用标准的HTML `<a>` 标签：

```html
<a href="/posts/my-first-post/">我的第一篇文章</a>
```

确保链接的href属性指向正确的文章路径。

## 添加图片

1. 如果需要在文章中添加图片，可以将图片文件放在`public`目录下，然后在文章中通过相对路径引用：

```markdown
![图片描述](/images/my-image.png)
```

2. posts文件夹下创建图片文件夹`images`, 然后在文章中通过相对路径引用：

```markdown
![图片描述](./images/my-image.png)



## 创建多篇文章

你可以在`src/content/posts/`目录下创建多个Markdown文件，每个文件代表一篇文章。例如：

```
src/content/posts/
├── my-first-post.md
├── my-second-post.md
└── my-third-post.md
```

每篇文章都是一个独立的Markdown文件，文件名将被用作文章的URL路径。

## 链接多篇文章

要在博客页面中链接到多篇文章，可以创建一个文章列表：

```html
<ul>
  <li><a href="/posts/my-first-post/">我的第一篇文章</a></li>
  <li><a href="/posts/my-second-post/">我的第二篇文章</a></li>
  <li><a href="/posts/my-third-post/">我的第三篇文章</a></li>
</ul>
```

确保每个链接都指向正确的文章路径。
