import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://thmingg.github.io/",
    title: "Daniel Tsang",
    description:
      "Web-focused Software Engineer building TypeScript apps with React, Vue, Next.js, and cloud backends.",
    author: "Daniel Tsang",
    profile: "https://www.linkedin.com/in/danielhoming",
    ogImage: "default-og.jpg",
    lang: "en",
    timezone: "Asia/Hong_Kong",
    dir: "ltr",
  },
  posts: {
    perPage: 4,
    perIndex: 4,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    showArchives: false,
    showBackButton: true,
    editPost: {
      enabled: false,
    },
    search: "pagefind",
  },
  socials: [
    { name: "github", url: "https://github.com/thmingg" },
    {
      name: "linkedin",
      url: "https://www.linkedin.com/in/danielhoming",
    },
    { name: "mail", url: "mailto:danielhoming@gmail.com" },
  ],
  shareLinks: [
    { name: "whatsapp", url: "https://wa.me/?text=" },
    { name: "facebook", url: "https://www.facebook.com/sharer.php?u=" },
    { name: "x", url: "https://x.com/intent/post?url=" },
    { name: "telegram", url: "https://t.me/share/url?url=" },
    { name: "pinterest", url: "https://pinterest.com/pin/create/button/?url=" },
    { name: "mail", url: "mailto:?subject=See%20this%20post&body=" },
  ],
});
