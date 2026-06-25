import { getCommandsFromLine, splitArguments } from "../utils/Parse";
import { Command } from "../commands/Command";
import { AmeriScriptError, ArgumentDuplicatedError, ArgumentMissingError, ArgumentTooManyError, IndentError, InvalidArgumentError, UnknownCommandError } from "./Error";
import type { Argument, CommandDefinition, HandlerArgument } from "../commands/Command";

export class Parser {
    /** コマンド定義のレコード */
    private commands: Record<string, CommandDefinition>;

    public constructor(commands: Record<string, CommandDefinition>) {
        this.commands = commands;
    }

    /**
     * コマンド定義を取得します。
     * @param name コマンド名
     */
    private getCommandDefinition(name: string): CommandDefinition {
        if (name in this.commands) {
            return this.commands[name]!;
        } else {
            throw new UnknownCommandError(name);
        }
    }

    /**
     * コマンドを作成します。
     * @param name コマンド名
     * @param args 引数のレコード
     */
    private createCommand(name: string, args: Record<string, string> = {}): Command {
        return new Command(name, this.getCommandDefinition(name), args);
    }

    /**
     * コマンドを整理します。
     * @param commands コマンド
     */
    private mergeCommands(commands: Command[]): Command[] {
        const result: Command[] = [];

        for (const command of commands) {
            const previousCommand = result.at(-1);
            if (command.name === "text" && previousCommand && previousCommand.name === "text") {
                // NOTE: テキストコマンドが連続するものは連結
                const previousText = previousCommand.args["text"]!;
                result.pop();
                result.push(this.createCommand("text", { text: previousText + (command.args["text"] as string) }));
            } else if (command.name === "page" && previousCommand && previousCommand.name === "text" && previousCommand.args["text"] === "\n") {
                // NOTE: page 直前の \n は不要なので削除
                result.pop();
                result.push(command);
            } else {
                result.push(command);
            }
        }

        return result;
    }

    // MARK: internal

    /**
     * 複数行にまたがるコマンドをパースします。
     * @param content 文字列
     */
    private parseContent(content: string): Command[] {
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

            commands.push(...this.parseLine(line));
        }

        return this.mergeCommands(commands);
    }

    /**
     * 行をパースします。
     * @param line 行
     */
    private parseLine(line: string): Command[] {
        const lineWithoutIndent = line
            // NOTE: インデントの削除
            .trimStart();

        if (lineWithoutIndent === "") {
            return [this.createCommand("text", { text: "\n" })];
        } else if (lineWithoutIndent.startsWith("@")) {
            // NOTE: 1行コマンドだった場合
            return [this.parseCommand(lineWithoutIndent)];
        } else {
            // NOTE: 1行コマンドでない場合
            let results: Command[] = [];

            for (const command of getCommandsFromLine(lineWithoutIndent)) {
                if (command.startsWith("{@")) {
                    // NOTE: インラインコマンドはパースに回す
                    results.push(this.parseCommand(command.slice(1, -1)));
                } else {
                    // NOTE: インラインでないものは文字列としてテキストで解釈
                    results.push(this.createCommand("text", { text: command
                        .replaceAll("\\@", "@")
                    }));
                }
            }

            results.push(this.createCommand("pause"), this.createCommand("text", { text: "\n" }));

            return results;
        }
    }

    /**
     * 単一コマンド形式 `@command arg1 arg2 ...` をパースします。
     * @param content コマンド
     */
    private parseCommand(content: string): Command {
        const command = splitArguments(content);
        if (command.length < 1) throw new AmeriScriptError("Internal error");

        const name = command[0]!.slice(1);
        const args = command.slice(1);
        const definition = this.getCommandDefinition(name);
        return new Command(name, definition, this.parseArguments(name, definition, args));

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

    /**
     * コマンドの引数を、キーワード付き引数としてパースします。
     *
     * 引数のフォーマットは `["value1", "value2"]`、もしくは `["key1=value1", "key2=value2"]` に対応しています。
     * @param name コマンド名
     * @param command コマンド
     * @param args 引数
     */
    private parseArguments<Args extends Record<string, Argument>>(name: string, command: CommandDefinition<Args>, args: string[]): HandlerArgument<Args> {
        // NOTE: キーワード付き引数のパース
        let result: any = {};
        const keywordOrder = command.keywordOrder ?? [];
        let keywordOrderIndex = 0; // NOTE: キーワード引数が指定されていない場合の、次に割り当てるキーのインデックス
        for (const arg of args) {
            if (arg.includes("=")) {
                // NOTE: キーワード付き引数の場合
                const [argumentName, value] = arg.split("=", 2);

                if (!(argumentName && argumentName in command.args)) throw new InvalidArgumentError(name);
                if (argumentName in result) throw new ArgumentDuplicatedError(name, argumentName);
                result[argumentName] = value ?? "";
            } else {
                // NOTE: キーワードがなく、順番に割り当てる場合
                if (keywordOrder.length <= keywordOrderIndex) throw new ArgumentTooManyError(name);
                const argumentName = keywordOrder[keywordOrderIndex++]!;

                if (argumentName in result) throw new ArgumentDuplicatedError(name, argumentName as string);
                result[argumentName] = arg;
            }
        }

        // NOTE: required が指定されたすべてのキーが存在することを保証する
        for (const [argName, argDefinition] of Object.entries(command.args)) {
            if (argDefinition.required && !(argName in result)) {
                throw new ArgumentMissingError(name, argName);
            }
        }

        return result;
    }

    // MARK: public

    /**
     * コンテンツをパースします。
     * @param content 文字列
     */
    public parse(content: string): Command[] {
        return this.parseContent(content);
    }
}
