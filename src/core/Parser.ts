import { getCommandsFromLine, splitArguments } from "../utils/Parse";
import { Command } from "../commands/Command";
import { AmeriScriptError, IndentError } from "./Error";

/**
 * コマンドを整理します。
 * @param commands コマンド
 */
function mergeCommands(commands: Command[]): Command[] {
    const result = [];

    for (const command of commands) {
        if (command[0] === "text" && command[1] && result.at(-1)?.[0] === "text") {
            // NOTE: テキストコマンドが連続するものは連結
            result[result.length - 1]![1] += command[1];
        } else if (command[0] === "page" && result.at(-1)?.[0] === "text" && result.at(-1)?.[1] === "\n") {
            // NOTE: page 直前の \n は不要なので削除
            result.pop();
            result.push(command);
        } else {
            result.push(command);
        }
    }

    return result;
}

/**
 * 複数行にまたがるコマンドをパースします。
 * @param content 文字列
 */
export function parseContent(content: string): Command[] {
    let commands: Command[] = [];

    const lines = splitArguments(content
        // NOTE: 複数行のコメントの削除
        .replace(/\/\*[\s\S]*?\*\/\n?/gi, "")
        // NOTE: コメントの削除
        .replace(/\/\/.*\n?/g, "")
        // NOTE: 2行以上の改行か、\f は改ページコマンドとして扱う
        .replace(/(\n{2,}|\f)/g, "\n@page\n")
        // NOTE: 整理
        .trim(),
        "\n",
        [..."@"]
    );

    // NOTE: 最上位ブロックのインデント単位
    let indentUnit = 0;
    // NOTE: 現在処理中の行のインデント数
    let currentIndent = 0;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]!;

        // NOTE: インデント文字の数を数える
        const indentCharCount = line.match(/^[ \t]*/)?.[0].length ?? 0;
        // NOTE: ブロックの最初の行であれば、このブロックの1インデント単位を設定
        if (currentIndent === 0) indentUnit = indentCharCount;

        // NOTE: インデント以外の文字があれば、インデントを更新する
        if (indentUnit !== 0 && line.slice(indentCharCount).length !== 0) currentIndent = indentCharCount / indentUnit;

        if (!Number.isSafeInteger(currentIndent)) throw new IndentError(i);

        commands.push(...parseLine(line));
    }

    return mergeCommands(commands);
}

/**
 * 行をパースします。
 * @param line 行
 */
export function parseLine(line: string): Command[] {
    const lineWithoutIndent = line
        // NOTE: インデントの削除
        .trimStart();

    if (lineWithoutIndent === "") {
        return [["text", "\n"]];
    } else if (lineWithoutIndent.startsWith("@")) {
        // NOTE: 1行コマンドだった場合
        return [parseCommand(lineWithoutIndent)];
    } else {
        // NOTE: 1行コマンドでない場合
        let results: Command[] = [];

        for (const command of getCommandsFromLine(lineWithoutIndent)) {
            if (command.startsWith("{@")) {
                // NOTE: インラインコマンドはパースに回す
                results.push(parseCommand(command.slice(1, -1)));
            } else {
                // NOTE: インラインでないものは文字列としてテキストで解釈
                results.push(["text", command
                    .replaceAll("\\@", "@")
                ]);
            }
        }

        results.push(["pause"], ["text", "\n"]);

        return results;
    }
}

/**
 * 単一コマンドをパースします。
 * @param content コマンド
 */
export function parseCommand(content: string): Command {
    const args = splitArguments(content);
    if (args.length < 1) throw new AmeriScriptError("Internal error");
    return [args[0]!.slice(1), ...args.slice(1)];

    // TODO: 統一的なインタフェースがないので、InvalidArgumentError などのチェックが分散している
    /*
    if (args[0] === "@await") {
        return new AwaitCommand();
    } else if (args[0] === "@sleep") {
        const duration = args.slice(1)[0];
        if (!duration) throw new InvalidArgumentError(args[0]);
        return new SleepCommand(duration);
    } else if (args[0] === "@return") {
        return new ReturnCommand();
    } else if (args[0] === "@page") {
        return new PageCommand();
    } else if (args[0] === "@font.color") {
        return new FontColorCommand(args[1] ?? "");
    } else if (args[0] === "@font.size") {
        return new FontSizeCommand(args[1] ?? "");
    } else if (args[0] === "@font.weight") {
        return new FontWeightCommand(args[1] ?? "");
    } else if (args[0] === "@font.family") {
        return new FontFamilyCommand(args[1] ?? "");
    } else if (args[0] === "@css") {
        if (args.length === 3) {
            return new CssCommand(args[1]!, args[2]!);
        } else {
            return new CssCommand(args.slice(1).join(SPLITTER_CHAR));
        }
    } else if (args[0] === "@ruby") {
        if (args.length === 3) {
            return new RubyCommand([args[1]!, args[2]!]);
        } else {
            throw new InvalidArgumentError("@ruby");
        }
    } else if (args[0] === "@text") {
        return new TextCommand(args.slice(1).join(SPLITTER_CHAR));
    }
    // TODO: 前に戻る
    // TODO: bgm, se
    // TODO: halt
    // TODO: sub-routines
    // TODO: return (optional value)
    // TODO: full-screen mode
    // TODO: if
    // TODO: label (*), jump
    // TODO: transition

    文字列はすべてコマンドとして解釈されます。
    ブロックはインデントで表現します。戻り値を取得することはできません。
    {} 内はインラインブロックと呼ばれ、1つだけコマンドを挿入することができます。
        そのブロックはブロック内に存在するコマンドを評価した結果と等価となります。

    スナップショット
        スナップショットは、任意の時点での実行環境を別オブジェクトとして分離できる機能です。
        テキストやキャラクター、レンダリングされた画像などが含まれているため、バックログ画面などの作成に役立ちます。
    */
}
