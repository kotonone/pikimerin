import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
    base: "/pikimerin/",
    title: "Pikimerin",

    description: "A lightweight scenario engine for web-based visual novels",
    head: [
        ["meta", { property: "og:site_name", content: "Pikimerin" }],
        ["meta", { property: "og:image", content: "https://kotonone.github.io/pikimerin/assets/ogp.webp" }],
    ],

    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config

        logo: {
            src: "/assets/logo@4x.webp",
            alt: "Pikimerin",
            width: "auto",
            height: 64
        },

        socialLinks: [
            { icon: "github", link: "https://github.com/kotonone/pikimerin" },
        ],

        nav: [
            { text: "ホーム", link: "/" },
            { text: "ガイド", link: "/guide/getting-started" },
            { text: "サンプル", link: "https://kotonone.github.io/pikimerin/examples/" },
        ],

        sidebar: [
            {
                text: "ガイド",
                items: [
                    { text: "はじめての Pikimerin", link: "/guide/getting-started" },
                ]
            },
            {
                text: "リファレンス",
                items: [
                    { text: "インラインコマンド", link: "/reference/inline-commands" },
                    { text: "非同期処理と中断", link: "/reference/asynchronous" },
                    {
                        text: "コマンド一覧",
                        collapsed: true,
                        items: [
                            { text: "@text", link: "/reference/commands/text" },
                            { text: "@pause", link: "/reference/commands/pause" },
                            { text: "@page", link: "/reference/commands/page" },
                            { text: "@sleep", link: "/reference/commands/sleep" },
                            { text: "@font.color", link: "/reference/commands/font-color" },
                            { text: "@font.size", link: "/reference/commands/font-size" },
                        ]
                    },
                ]
            }
        ],

        footer: {
            message: "Released under the MIT License or the Apache License version 2.0.",
            copyright: "© Kotonone",
        }
    }
});
