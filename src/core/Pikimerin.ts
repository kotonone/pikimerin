import { text } from "../commands/TextCommand";
import { Context } from "./Context";
import type { CommandDefinition, Command } from "../commands/Command";
import { pause } from "../commands/PauseCommand";
import { sleep } from "../commands/SleepCommand";
import { fontSize } from "../commands/FontSizeCommand";
import { fontColor } from "../commands/FontColorCommand";
import { fontFamily } from "../commands/FontFamilyCommand";
import { page } from "../commands/PageCommand";
import { AbortablePromise } from "../utils/Promise";
import { Parser } from "./Parser";
import { Renderer } from "./picture/Renderer";
import { CommandRangeError } from "./Error";

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

const DEFAULT_COMMAND_SET: Record<string, CommandDefinition> = {
    text,
    pause,
    page,
    sleep,
    "font.color": fontColor,
    "font.size": fontSize,
    "font.family": fontFamily,
};

export interface PikimerinInit {
    /** コマンドセット */
    commands: Record<string, CommandDefinition> & Partial<typeof DEFAULT_COMMAND_SET>;

    /** コンテキスト */
    context: Context;
}

/** Pikimerin メインクラス */
export class Pikimerin extends EventTarget {
    /** コンテキスト */
    public readonly context: Context;

    /** パーサー */
    private readonly parser: Parser;

    /** パースされたスクリプト */
    public readonly script: ReadonlyArray<Command>;

    /** 現在進行中の非同期タスク */
    #task: AbortablePromise<any> | null;

    /** ピクチャレンダラー */
    #renderer: Renderer;

    public constructor(script: string, init?: Partial<PikimerinInit>) {
        super();

        this.context = init?.context ?? new Context();
        this.parser = new Parser({
            ...DEFAULT_COMMAND_SET,
            ...init?.commands,
        });
        this.script = this.parser.parse(script);
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

            const result = command.execute(this.context);
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
