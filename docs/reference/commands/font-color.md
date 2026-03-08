# @font.color

以降のテキストの文字色を変更します。

## 構文

```
@font.color <色>
@font.color
```

パラメータを省略すると文字色がリセットされます。

## パラメータ

| パラメータ | 説明 |
| --- | --- |
| `色` | CSS カラー値またはグラデーション文字列。省略した場合はリセット。 |

## 使用例

### CSS カラー値

CSS で有効なカラー値はすべて使用できます。

```
@font.color red
赤いテキスト
@font.color
通常のテキストに戻る
```

```
@font.color #ff6b6b
@font.color rgb(100, 200, 100)
@font.color hsl(240, 100%, 50%)
```

### グラデーション

`linear-gradient` や `radial-gradient` などの CSS グラデーション文字列を指定するとグラデーション文字を表示できます。

```
@font.color "linear-gradient(to right, #f00, #00f)"
グラデーションのテキスト
@font.color
```

### インライン記法

テキストの途中で色を変えたい場合は、インライン記法を使用します。

```
通常の文字{@font.color red}赤い文字{@font.color}通常の文字
```

## 注意

`@font.color` で設定した色は、`@page` を実行してもリセットされません。次のページでも色を元に戻したい場合は、明示的に `@font.color` を呼び出してください。

## 戻り値

なし

## 参照

- [@font.size](./font-size)
- [@text](./text)
