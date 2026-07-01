import { Context } from "../core/Context";

/** コマンドの引数定義 */
export type Argument = {
    /** 引数の型 */
    type: "string" | "number" | "boolean" | "object" | "array";
    /** 引数を必須とするかどうか */
    required: boolean;
};

/** {@link Argument} の値の型 */
export type ArgumentValue<T extends Argument> =
    T["type"] extends "string"
        ? string
    : T["type"] extends "number"
        ? number
    : T["type"] extends "boolean"
        ? boolean
    : T["type"] extends "object"
        ? Record<string, unknown>
    : T["type"] extends "array"
        ? unknown[]
    : never;

/** ハンドラの引数の型 */
export type HandlerArgument<Arguments extends Record<string, Argument>> =
    {
        // NOTE: required=true
        [K in keyof Arguments as Arguments[K]["required"] extends true ? K : never]: ArgumentValue<Arguments[K]>;
    } & {
        // NOTE: required=false
        [K in keyof Arguments as Arguments[K]["required"] extends false ? K : never]?: ArgumentValue<Arguments[K]>;
    } extends infer O ? { [K in keyof O]: O[K] } : never;

/** コマンドの中間表現クラス */
export class Command<Args extends Record<string, Argument> = any> {
    /** コマンド定義 */
    #definition: CommandDefinition<Args>;

    /** コマンド名 */
    public readonly name: string;

    /** コマンドの引数 */
    public args: HandlerArgument<Args>;

    public constructor(name: string, definition: CommandDefinition<Args>, args: HandlerArgument<Args>) {
        this.name = name;
        this.#definition = definition;
        this.args = args;
    }

    /** コマンドを実行します。 */
    public execute(context: Readonly<Context>) {
        return this.#definition.handler(context, this.args);
    }
}

/** コマンド定義 */
export interface CommandDefinition<Args extends Record<string, Argument> = any> {
    /** コマンドの引数 */
    args: Args;

    /** コマンドの実行関数 */
    handler: (context: Readonly<Context>, args: HandlerArgument<Args>) => void | Promise<void>;

    /** キーワードの順番を指定する配列 */
    keywordOrder?: (keyof Args)[];
}

/**
 * カスタムコマンドを作成します。
 * @param args コマンドの引数定義
 * @param handler コマンドの実行関数
 * @param keywordOrder キーワードの順番を指定する配列
 */
export function createCommand<const Args extends Record<string, Argument>>(
    args: Args,
    handler: (context: Readonly<Context>, args: HandlerArgument<Args>) => void | Promise<void>,
    keywordOrder?: (keyof Args)[]
): CommandDefinition<Args> {
    return { args, handler, keywordOrder };
}
