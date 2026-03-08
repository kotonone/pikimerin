# 非同期処理と中断

Pikimerin は原則、コマンドの実行が完了するまで次のコマンドへ進みません。

コマンドは戻り値として、そのコマンドが非同期であることを示す `AbortablePromise` を内部的に返すことができます。

## AbortablePromise と中断

`AbortablePromise` は通常の `Promise` を拡張したクラスで、`abort()` メソッドを持ちます。

`Pikimerin` クラスは実行中の `AbortablePromise` を内部に保持します。
`Pikimerin.abort()` は、現在実行中の `AbortablePromise` に対して中断シグナルを送ります。
コマンドは中断を受け取ると処理を早期終了し、次のコマンドへ進みます。

なお、実行中の非同期処理がない場合（同期コマンドの実行中など）は何も起こりません。

## 実装例

```ts
const pikimerin = new Pikimerin(`
@text わああ！\nそれは困る！女の子として！
@pause
@text わかった。なんとか起きられるよう\nがんばってみるね…。
@pause
`.trim());

window.onclick = () => pikimerin.abort();
```

クリックのたびに `abort()` を呼ぶと、以下のような挙動によりビジュアルノベルの操作を実現できます。
1. `@text` が実行され、文字送りのアニメーションが開始される。
2. クリックにより `@text` が `abort()` され、残りのテキストが一気に表示される。
3. `@pause` が実行され、ユーザーの入力を待つ状態になる（内部実装としては、解決しない `AbortablePromise`）。
4. クリックにより `@pause` が `abort()` され、次の `@text` へ進む。

## 参照

- [@text](./commands/text)
- [@pause](./commands/pause)
- [@sleep](./commands/sleep)
