import { text } from "../commands/TextCommand";
import { Context } from "./Context";
import type { Command } from "../commands/Command";
import { pause } from "../commands/PauseCommand";
import { sleep } from "../commands/SleepCommand";
import { fontSize } from "../commands/FontSizeCommand";
import { fontColor } from "../commands/FontColorCommand";
import { page } from "../commands/PageCommand";
import { AbortablePromise } from "../utils/Promise";
import { parseContent } from "./Parser";
import { Renderer } from "./picture/Renderer";
import { CommandRangeError, InvalidArgumentError, UnknownCommandError } from "./Error";

export enum SkipType {
    /** スキップを行わない */
    NONE = 0,

    /** 既読スキップ */
    READ = 1,

    /** 未読スキップ */
    UNREAD = 2,

    /** オート */
    AUTO = 3,
}

const DEFAULT_COMMAND_SET = {
    text,
    pause,
    page,
    sleep,
    "font.color": fontColor,
    "font.size": fontSize
};

export interface PikimerinInit {
    /** コマンドセット */
    commands: Record<string, (...args: any[]) => any> & Partial<typeof DEFAULT_COMMAND_SET>;

    /** コンテキスト */
    context: Context;
}

/** Pikimerin メインクラス */
export class Pikimerin extends EventTarget {
    /** パースされたスクリプト */
    public readonly script: Command[];

    /** コンテキスト */
    public readonly context: Context;

    /** コマンドセット */
    private readonly commands: Readonly<Record<string, (...args: any[]) => any> & typeof DEFAULT_COMMAND_SET>;

    /** 現在進行中の非同期タスク */
    #task: AbortablePromise<any> | null;

    /** ピクチャレンダラー */
    #renderer: Renderer;

    public constructor(script?: Command[] | string, init?: Partial<PikimerinInit>) {
        super();

        this.script = typeof script === "string" ? parseContent(script) : script ?? [];
        this.context = init?.context ?? new Context();
        this.commands = { ...DEFAULT_COMMAND_SET, ...init?.commands, };
        this.#task = null;
        this.#renderer = new Renderer(this.context.picture);

        // TODO: ユーザー側でレンダリングできるようにする？
        const render = () => {
            this.#renderer.render();
            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);

        this.run();
    }

    /**
     * エンジンを開始します。
     */
    private async run() {
        while (true) {
            const command = this.script[this.context.pc];
            if (!command) throw new CommandRangeError();

            const result = (() => {
                if (command[0] === "text") {
                    if (!command[1]) throw new InvalidArgumentError(command[0]);
                    return this.commands.text(this.context.text, command[1]);
                } else if (command[0] === "pause") {
                    return this.commands.pause();
                } else if (command[0] === "page") {
                    return this.commands.page(this.context.text);
                } else if (command[0] === "sleep") {
                    if (!command[1]) throw new InvalidArgumentError(command[0]);
                    return this.commands.sleep(command[1]);
                } else if (command[0] === "font.color") {
                    return this.commands["font.color"](this.context.text, command[1] ?? "");
                } else if (command[0] === "font.size") {
                    return this.commands["font.size"](this.context.text, command[1] ?? "");
                } else {
                    const commandFn = this.commands[command[0]];
                    if (!commandFn) throw new UnknownCommandError(command[0]);
                    return commandFn?.(...command.slice(1)) ?? null;
                }
            })();
            if (result instanceof AbortablePromise) {
                await (this.#task = result);
                this.#task = null;
            } else if (result instanceof Promise) {
                await result;
            }

            this.context.pc++;
        }
    }

    /**
     * 現在進行中の非同期タスクを中断します。
     */
    public abort() {
        this.#task?.abort();
    }
}
