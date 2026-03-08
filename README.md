<h1><img src="./docs/public/assets/logo@4x.webp" alt="Pikimerin" width="208" height="64"></h1>

Pikimerin は、Kotonone によって開発されている、ビジュアルノベルなどのシナリオを直感的に記述できるスクリプト言語 AmeriScript のスクリプト再生エンジンです。

組み込みのテキスト表示・制御機能やピクチャレンダリング用のコンテキストを備えており、Vue や React などのフロントエンドフレームワークとの連携も容易です。

## 特徴

### シンプルなスクリプト構文

行頭の `@` によるコマンド（`@page`, `@sleep`, `@pause` 等）や、文章中へのインラインコマンド (`{@sleep ...}`) による直感的なシナリオ作成が可能です。

```
@name りい
「……お姉ちゃん…………」
@name ふぁみ
「むにゃ……あと10分～」
@name りい
「起きて……！」
@name ふぁみ
「うぅ～ん、やっぱりあと20分……
　……うん？」
@name りい
「起きて～！」
@name ふぁみ
「……なんか声遠くない？　……って、{@pause}ここどこ！？」
```

### カスタムコマンドの拡張性

文字色・サイズ変更などの組み込みコマンドに加え、独自の機能（キャラクター名の表示、背景切り替え、音声再生など）を容易に定義できます。

また、既存コマンドを上書きして挙動を変更することも可能です。

```typescript
import { Pikimerin, text } from "@kotonone/pikimerin";

new Pikimerin(script, {
    commands: {
        text: (context, t) => {
            console.log("テキストコマンドが呼び出されました: " + t);
            return text(context, t); // 元の挙動も呼び出す
        },
        fadeIn: (type) => {
            // ..
        },
        ripple: () => {
            // ..
        },
         // さらにコマンドを追加可能
    },
});
```

```
@name ？？？
……{@sleep 0.2}…{@sleep 0.5}
たまき…{@sleep 0.2}…{@sleep 0.2}…

@name たまき
@ripple
むにゃ…
あと５分〜。

@name ？？？
@fadeIn shrink
@picture tamaki.png
@play se.wav
起きなさい！
```

### Web 連携の高い親和性

描画用のコンテキストをDOM構造として取得できるため、既存のウェブアプリケーションに自然に組み込めます。

```html
<div id="scenario-container"></div>

<script>
const merin = new Pikimerin(script);
document.getElementById("scenario-container")?.appendChild(merin.context.text.container);
</script>

<style>
#scenario-container {
    /* 文字の表示アニメーションなどを CSS で実装可能 */
}
</style>
```

## 使い方

シナリオスクリプト文字列と、カスタムコマンドなどの設定を渡すだけで `Pikimerin` インスタンスを生成・実行できます。

```typescript
import { Pikimerin } from "@kotonone/pikimerin";

// 実行するシナリオスクリプト
const script = `
@name キャラクターA
シナリオテキストを入力します。{@sleep 1000}1秒待ちました。
@page
ページを切り替えて次のテキストを表示します。
`;

// エンジンの初期化
const merin = new Pikimerin(script, {
    commands: {
        // カスタムコマンドを独自に定義したり、既存コマンドを上書き可能
        name: (nameTag) => {
            console.log("名前枠の表示変更: " + nameTag);
        }
    }
});

// コンテキスト内のテキストコンテナ（HTMLElement）をDOMに追加して表示する
document.body.appendChild(merin.context.text.container);

// クリック等で処理を進行（ポーズの解除や、テキストのアニメーションスキップ）
window.onclick = () => merin.abort();
```

詳しい実装例については、`examples/` フォルダ内の Vue プロジェクトを参照してください。
