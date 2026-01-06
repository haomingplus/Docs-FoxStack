/**
 * @see https://theme-plume.vuejs.press/guide/document/ 查看文档了解配置详情。
 *
 * Notes 配置文件，它在 `.vuepress/plume.config.ts` 中被导入。
 *
 * 请注意，你应该先在这里配置好 Notes，然后再启动 vuepress，主题会在启动 vuepress 时，
 * 读取这里配置的 Notes，然后在与 Note 相关的 Markdown 文件中，自动生成 permalink。
 *
 * 如果你发现 侧边栏没有显示，那么请检查你的配置是否正确，以及 Markdown 文件中的 permalink
 * 是否是以对应的 note 配置的 link 的前缀开头。 是否展示侧边栏是根据 页面链接 的前缀 与 `note.link`
 * 的前缀是否匹配来决定。
 */

/**
 * 在受支持的 IDE 中会智能提示配置项。
 *
 * - `defineNoteConfig` 是用于定义单个 note 配置的帮助函数
 * - `defineNotesConfig` 是用于定义 notes 集合的帮助函数
 *
 * 通过 `defineNoteConfig` 定义的 note 配置，应该填入 `defineNotesConfig` 的 notes 数组中
 */
import { defineNoteConfig, defineNotesConfig } from "vuepress-theme-plume";

const Note = defineNoteConfig({
  dir: "notes",
  // `dir` 所指向的目录中的所有 markdown 文件，其 permalink 需要以 `link` 配置作为前缀
  // 如果 前缀不一致，则无法生成侧边栏。
  // 所以请确保  markdown 文件的 permalink 都以 `link` 开头
  link: "/",
  // 手动配置侧边栏结构
  sidebar: [
    {
      text: "从这里开始",
      icon: "ri:book-open-line",
      prefix: "/guide/", // 使用 prefix 拼接，可以简写 下面的 items 中的 link 为相对路径
      collapsed: false, // 是否默认折叠
      items: [
        { text: "模板介绍", link: "intro/", icon: "ri:information-line" },
        { text: "快速开始", link: "get-started/", icon: "ri:rocket-line" },
        { text: "部署方式", link: "deployment/", icon: "ri:server-line" },
      ],
    },
    {
      text: "配置说明",
      icon: "ri:settings-2-line",
      prefix: "/config/", // 使用 prefix 拼接，可以简写 下面的 items 中的 link 为相对路径
      collapsed: true, // 是否默认折叠
      items: [
        // 核心配置
        { text: "站点配置", link: "siteConfig-usage/", icon: "ri:global-line" },
        {
          text: "用户资料配置",
          link: "profileConfig-usage/",
          icon: "ri:user-line",
        },

        // 功能配置
        {
          text: "评论配置",
          link: "commentConfig-usage/",
          icon: "ri:chat-3-line",
        },
        {
          text: "公告配置",
          link: "announcementConfig-usage/",
          icon: "ri:megaphone-line",
        },
        {
          text: "许可证配置",
          link: "licenseConfig-usage/",
          icon: "ri:copyright-line",
        },
        {
          text: "页脚配置",
          link: "footerConfig-usage/",
          icon: "ri:layout-bottom-line",
        },

        // 样式配置
        {
          text: "背景壁纸配置",
          link: "backgroundWallpaper-usage/",
          icon: "ri:image-2-line",
        },
        {
          text: "代码高亮配置",
          link: "expressiveCodeConfig-usage/",
          icon: "ri:code-s-slash-line",
        },
        {
          text: "樱花特效配置",
          link: "sakuraConfig-usage/",
          icon: "ri:flower-line",
        },
        { text: "字体配置", link: "fontConfig-usage/", icon: "ri:font-size" },
        {
          text: "封面图配置",
          link: "coverImageConfig-usage/",
          icon: "ri:image-line",
        },

        // 布局配置
        {
          text: "侧边栏配置",
          link: "sidebarConfig-usage/",
          icon: "ri:layout-line",
        },
        {
          text: "导航栏配置",
          link: "navBarConfig-usage/",
          icon: "ri:menu-line",
        },

        // 组件配置
        {
          text: "音乐播放器配置",
          link: "musicConfig-usage/",
          icon: "ri:music-line",
        },
        { text: "看板娘配置", link: "pioConfig-usage/", icon: "ri:robot-line" },
        {
          text: "广告配置",
          link: "adConfig-usage/",
          icon: "ri:settings-6-line",
        },
        {
          text: "友链配置",
          link: "friendsConfig-usage/",
          icon: "ri:links-line",
        },
        {
          text: "留言板配置",
          link: "guestbook-usage/",
          icon: "ri:chat-1-line",
        },
        {
          text: "赞助配置",
          link: "sponsorConfig-usage/",
          icon: "ri:heart-line",
        },

        // 其他配置
        { text: "番剧配置", link: "animeConfig-usage/", icon: "ri:tv-line" },
      ],
    },
    {
      text: "撰写文章",
      icon: "akar-icons:pencil",
      prefix: "/press/", // 使用 prefix 拼接，可以简写 下面的 items 中的 link 为相对路径
      collapsed: true, // 是否默认折叠
      items: [
        { text: "Markdown", link: "md/", icon: "ri:markdown-line" },
        { text: "新建文章", link: "file/", icon: "ri:file-text-line" },
        { text: "图表", link: "chart/", icon: "ri:pie-chart-line" },
      ],
    },
  ],
  // 根据文件结构自动生成侧边栏
  //sidebar: 'auto',
});

/**
 * 导出所有的 note
 * 每一个 note 都应该填入到 `notes.notes` 数组中
 * （Note 为参考示例，如果不需要它，请删除）
 */
export default defineNotesConfig({
  dir: "notes",
  link: "/",
  notes: [Note],
});
