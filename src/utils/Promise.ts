/**
 * {@link AbortSignal} を用いてキャンセルを検知できる {@link Promise}
 *
 * このクラスは、`executor` に戻り値が `Promise` である関数が指定されたとき、その関数の戻り値で自動的にこのクラスを解決します。
 */
export class AbortablePromise<T> extends Promise<T> implements AbortController {
    private controller: AbortController;
    public signal: AbortSignal;

    public constructor(executor: (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void, signal: AbortSignal) => void | Promise<T>) {
        const controller = new AbortController();
        super(async (resolve, reject) => {
            const result = executor(resolve, reject, controller.signal);
            if (result instanceof Promise) {
                resolve(await result);
            }
        });

        this.controller = controller;
        this.signal = controller.signal;
    }

    public abort(reason?: any): void {
        this.controller.abort(reason);
    }

    /**
     * 指定されたシグナルが中止された際、この AbortablePromise も中止するようにします。
     * @param signal シグナル
     */
    public abortWith(signal: AbortSignal): this {
        const onabort = () => this.abort();

        signal.addEventListener("abort", onabort, { once: true });
        this.finally(() => signal.removeEventListener("abort", onabort));

        return this;
    }
}

/**
 * 指定した時間待機します。
 * @param milliseconds 時間（ミリ秒）
 */
export function wait(milliseconds: number): AbortablePromise<void> {
    return new AbortablePromise<void>((resolve, _reject, signal) => {
        const timeout = setTimeout(resolve, milliseconds);
        signal.onabort = () => {
            clearTimeout(timeout);
            resolve();
        };
    });
}
