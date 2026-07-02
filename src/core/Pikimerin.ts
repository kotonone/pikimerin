import { text } from "../commands/TextCommand";
import { Context } from "./Context";
import type { CommandDefinition } from "../commands/Command";
import { pause } from "../commands/PauseCommand";
import { sleep } from "../commands/SleepCommand";
import { fontSize } from "../commands/FontSizeCommand";
import { fontColor } from "../commands/FontColorCommand";
import { fontFamily } from "../commands/FontFamilyCommand";
import { page } from "../commands/PageCommand";
import { AbortablePromise } from "../utils/Promise";
import { Parser } from "./Parser";
import { CommandRangeError } from "./Error";
import { pictureAdd } from "../commands/PictureAddCommand";
import { pictureRemove } from "../commands/PictureRemoveCommand";
import { pictureShow } from "../commands/PictureShowCommand";
import { pictureHide } from "../commands/PictureHideCommand";
import { conditionIf } from "../commands/IfCommand";
import { Assets } from "./Assets";
import { PictureRenderer } from "./renderer/PictureRenderer";

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
    "picture.add": pictureAdd,
    "picture.remove": pictureRemove,
    "picture.show": pictureShow,
    "picture.hide": pictureHide,
    // アニメーション（トゥイーン）
    "picture.move": text, // [name=]bg [x=]200 [y=]100 duration=1000 easing=easeOutQuad
    "picture.scale": text, // [name=]bg [x=]1.2 [y=]1.2 duration=500
    "picture.rotate": text, // [name=]bg angle=15 duration=300
    "picture.opacity": text, // [name=]bg value=0.5 duration=800
    "picture.order": text, // [name=]bg [shift=]1
    // 複合トランジション
    "picture.transition": text, // out=bg01 in=bg02 effect=fade duration=1200
    "picture.crossfade": text, // name1=bg01 name2=bg02 opacity=0.5 duration=1000
    // キャラクター表情（スプライトシート／アトラス）
    "picture.expression": text, // char=heroine emotion=smile
    // 画面エフェクト
    "screen.shake": text, // intensity=5 duration=400
    "screen.flash": text, // color=white duration=200
    "screen.fadeIn": text, // duration=1000
    "screen.fadeOut": text, // duration=1000
    "if": conditionIf,
};

export interface PikimerinInit {
    /** コマンドセット */
    commands: Record<string, CommandDefinition> & Partial<typeof DEFAULT_COMMAND_SET>;

    /** コンテキスト */
    context: Context;
}

/** Pikimerin メインクラス */
export class Pikimerin {
    /** コンテキスト */
    public readonly context: Context;

    /** パーサー */
    private readonly parser: Readonly<Parser>;

    /** アセット */
    public readonly assets: Readonly<Assets>;

    /** ピクチャを Canvas 要素に描画するクラス */
    private readonly pictureRenderer: Readonly<PictureRenderer>;

    /** 現在進行中の非同期タスク */
    #task: AbortablePromise<any> | null;

    public constructor(script: string, init?: Partial<PikimerinInit>) {
        this.parser = new Parser({
            ...DEFAULT_COMMAND_SET,
            ...init?.commands,
        });
        this.context = init?.context ?? new Context(this.parser.parse(script));
        this.assets = new Assets();
        this.pictureRenderer = new PictureRenderer(this.context.picture, this.assets);
        this.#task = null;

        // NOTE: picture.add コマンドで指定されたアセットを事前に追加
        // TODO: 改善したい気持ちがある
        for (const command of this.context.script) {
            if (command.name === "picture.add" && typeof command.args["file"] === "string") {
                this.assets.add(command.args["file"]);
            }
        }

        // TODO: ユーザー側でレンダリングできるようにする？
        let previousTime = performance.now();
        const render: FrameRequestCallback = (time) => {
            const deltaTime = time - previousTime;
            previousTime = time;

            this.pictureRenderer.render(deltaTime);
            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);

        this.run();
    }

    /**
     * エンジンを開始します。
     */
    private async run() {
        console.debug(this.context.script);
        while (true) {
            const command = this.context.script[this.context.pc];
            console.debug(this.context.pc, command);
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
