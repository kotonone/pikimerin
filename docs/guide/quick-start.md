# クイックスタート

## インストール

::: code-group

```sh [npm]
npm install @kotonone/pikimerin
```

```sh [pnpm]
pnpm add @kotonone/pikimerin
```

```sh [yarn]
yarn add @kotonone/pikimerin
```

:::

## 最小構成

`Pikimerin` にスクリプト文字列を渡してインスタンスを生成し、テキストコンテナを DOM に追加します。


::: code-group

```ts [sample.ts]
import { Pikimerin } from "@kotonone/pikimerin";

const script = `
はじめてのシナリオです。
次の行に進みます。
`;

const merin = new Pikimerin(script.trim());

// テキストコンテナを DOM に追加
document.body.appendChild(merin.context.text.container);

// クリックで文字送り・改ページを進める
window.addEventListener("click", () => merin.abort());
```


```vue [SampleComponent.vue]
<template>
    <div ref="textBox" />
</template>

<script setup lang="ts">
import { onMounted, useTemplateRef } from "vue";
import { Pikimerin } from "@kotonone/pikimerin";

const textBox = useTemplateRef("textBox");

onMounted(() => {
    const merin = new Pikimerin(script);
    textBox.value!.appendChild(merin.context.text.container);
    window.addEventListener("click", () => merin.abort());
});
</script>
```

:::

## スクリプトの書き方

コマンドでない行はすべて台詞テキストとして解釈されます。行頭に `@` を付けるとコマンドになります。

```
1行目の台詞。

2行目の台詞。（空行で改ページ）

@sleep 1s
1秒待った後に表示される台詞。
```

詳しいスクリプト構文については [はじめての AmeriScript](/guide/tutorial-ameriscript) を参照してください。

## カスタムコマンドの追加

`commands` オプションで独自コマンドを定義できます。キャラクター名の表示など、ゲームに必要な演出はここに実装します。

```ts
import { Pikimerin } from "@kotonone/pikimerin";

const nameEl = document.querySelector("#name")!;

const merin = new Pikimerin(script, {
    commands: {
        name: (name: string) => {
            nameEl.textContent = name;
        },
    },
});
```

スクリプト側からは通常のコマンドと同様に呼び出します。

```
@name キャラクターA
こんにちは！

@name キャラクターB
よろしくね。
```

## 次のステップ

- [はじめての Pikimerin](/guide/tutorial-pikimerin) — エンジンの機能をより詳しく学ぶ
- [はじめての AmeriScript](/guide/tutorial-ameriscript) — スクリプト構文を学ぶ
- [非同期処理と中断](/reference/asynchronous) — `abort()` の仕組みを理解する
- [コマンド一覧](/reference/commands/text) — 組み込みコマンドのリファレンス

