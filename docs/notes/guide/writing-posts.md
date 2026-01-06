---
title: writing-posts
createTime: 2026/01/06 09:08:28
permalink: /notes/guide/writing-posts/
---
# Writing Posts

Ready to share your thoughts? Let's write your first post!

## Method 1: Using the Command (Recommended)

We have a magic command to set everything up for you.

Run this command in your terminal:

```bash
npm run new-post -- my-first-post
# or
pnpm new-post -- my-first-post
```

This will automatically create a new file in `src/content/posts/` with the current date and basic settings already filled in.

## Method 2: Manually

If you prefer to do it yourself:

1. Create a new `.md` file in the `src/content/posts/` folder.
2. Copy and paste the "Frontmatter" (the settings block) at the very top of the file.

Here is an example of what the Frontmatter looks like:

```yaml
---
title: My First Post
published: 2024-01-01
description: This is a summary of my post.
tags: [Life, Coding]
category: Daily
draft: false
---
```

## Explaining the Settings (Frontmatter)

Here is what each setting does:

- **title**: The headline of your post.
- **published**: The date the post is published.
- **tags**: Keywords related to your post.
- **category**: The main topic or folder for your post.
- **draft**: Set this to `true` if you are still working on it and don't want to publish it yet.
- **image**: (Optional) A link to a cover image for the post.

## Writing Content

Everything below the second `---` is your content. You can use standard Markdown syntax here to format your text, add links, images, and more.
