import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "Pikimerin",

    description: "A lightweight scenario engine for web-based visual novels",
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config

        logo: {
            src: "/assets/logo@4x.webp",
            alt: "Pikimerin",
            width: "auto",
            height: 64
        },

        socialLinks: [
            { icon: "github", link: "https://github.com/kotonone/pikimerin" }
        ],

        nav: [
            { text: "Home", link: "/" },
            { text: "Examples", link: "/markdown-examples" }
        ],

        sidebar: [
            {
                text: "Examples",
                items: [
                    { text: "Markdown Examples", link: "/markdown-examples" },
                    { text: "Runtime API Examples", link: "/api-examples" }
                ]
            }
        ],
    }
});
