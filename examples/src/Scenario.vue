<template>
    <div ref="scenarioRef" id="scenario">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 200" aria-hidden="true">
            <path :d="`M 150 200 h 200 L ${500 * 1} 0`" />
        </svg>
        <pikimerin-name ref="nameRef">名前</pikimerin-name>
        <pikimerin-text></pikimerin-text>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, useTemplateRef } from "vue";
import { Pikimerin, text as textFn, createCommand } from "@kotonone/pikimerin/src";

const scenarioRef = useTemplateRef("scenarioRef");
const nameRef = useTemplateRef("nameRef")

const script = `
@picture.add name=bg1 file=background.webp x=100 y=100 width=512 height=256

@name なまえ1
って、それってただの睡眠不足でしょ？\\n今日はお休みだし私ゆっくり寝てたいな。

@picture.remove
@name なまえ2
不健康よ！\\nそんなんでいいと思ってるわけ？

@name なまえ1
お姉さんみたいなこと言うね。
`.trim();

onMounted(() => {
    const merin = new Pikimerin(script, {
        commands: {
            name: createCommand(
                {
                    name: {
                        type: "string",
                        required: true,
                    },
                },
                (_, { name }) => {
                    nameRef.value!.textContent = name;
                },
                ["name"],
            ),
            text: createCommand(
                {
                    text: {
                        type: "string",
                        required: true,
                    },
                },
                (context, { text }) => {
                    console.log(text);
                    return textFn.handler(context, { text });
                }
            ),
        },
    });
    merin.assets.load("background.webp", "image");
    scenarioRef.value?.parentElement?.insertBefore(merin.pictureRenderer.canvas, scenarioRef.value);
    scenarioRef.value?.querySelector("pikimerin-text")?.appendChild(merin.context.text.container);
    window.onclick = () => merin.abort();
});
</script>

<style lang="scss">
@font-face {
    font-family: "Nosutaru Dot M Plus";
    font-style: normal;
    font-weight: 400;
    src: url("/font/Nosutaru-dotMPlusH-10-Regular.ttf");
}

canvas {
    position: absolute;
    inset: 0px;
    width: 100%;
    height: 100%;
}
#scenario {
    --background-color: #00000080;

    position: absolute;
    top: auto;
    left: 0px;
    right: 0px;
    bottom: 0px;

    width: 35em;
    height: 2.5em;
    padding: 1.5em 3em;
    margin: 2em auto;

    user-select: none;

    font-family: "Nosutaru Dot M Plus";
    font-size: 1.5em;
    text-shadow:
        -1px -1px 0 #000000,
         1px -1px 0 #000000,
        -1px  1px 0 #000000,
         1px  1px 0 #000000;

    background-color: var(--background-color);
    color: #ffffff;
    border-radius: 1.5em;

    transition: 0.2s transform ease-in-out, 0.1s opacity ease-in-out;
    &[hide] {
        transform: translateY(100%);
        opacity: 0;
    }

    svg {
        position: absolute;

        width: 20%;
        right: 5%;
        top: 0px;
        transform: translateY(-100%);

        aspect-ratio: 5 / 2;
        height: auto;

        z-index: -2;

        path {
            transition: 200ms d cubic-bezier(0.8, 0.1, 0.2, 0.9);
            fill: var(--background-color);
        }
    }
    pikimerin-name {
        display: flex;
        align-items: center;
        justify-content: center;

        position: absolute;
        top: -1.5em;
        left: -0.5em;
        width: 6em;

        font-size: 0.8em;
        padding-block: 0.5em;
        border-radius: 1e9px;
        background-color: #ffcc00;

        color: #ffffff;
    }
    pikimerin-text {
        display: block;
        line-break: strict;
        white-space: pre-line;

        overflow-y: hidden;

        color: var(--font-color);

        letter-spacing: 0.1em;
        line-height: 1.5;

        span[data-hide] {
            opacity: 0;
        }
        span:last-child:not([data-hide])::after {
            content: "";
            display: inline-block;
            width: 0.75em;
            height: 0.75em;
            margin-left: 0.5em;

            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="18" viewBox="0 0 24 18"><polygon points="12,18 0,0 24,0" fill="white"/></svg>');
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;

            filter: drop-shadow(1px 1px 0 #000) drop-shadow(-1px -1px 0 #000) drop-shadow(1px -1px 0 #000) drop-shadow(-1px 1px 0 #000);

            animation: updown 250ms infinite alternate;
            @keyframes updown {
                0% { transform: translateY(0); }
                50% { transform: translateY(0); }
                51% { transform: translateY(3px); }
                100% { transform: translateY(3px); }
            }
        }
    }

}
</style>
