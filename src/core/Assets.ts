import { UnknownAssetError } from "./Error";

const audioContext = new AudioContext();

/** アセットとしてキャッシュできる型 */
export type AssetType = {
    image: ImageBitmap;
    audio: AudioBuffer;
};

/** アセット管理クラス */
export class Assets {
    /** アセットのキャッシュ */
    public readonly caches: Map<string, Blob | AssetType[keyof AssetType] | null>;

    public constructor() {
        this.caches = new Map();
    }

    /**
     * アセットを追加します。
     * @param path アセットのパス
     */
    public add(path: string) {
        this.caches.set(path, null);
    }

    /**
     * 指定されたアセットを読み込みます。
     * @param path アセットのパス
     */
    public async load(path: string): Promise<Blob>;
    public async load<T extends keyof AssetType>(path: string, as?: T): Promise<AssetType[T] | null>;
    public async load(path: string, as?: keyof AssetType): Promise<Blob | AssetType[keyof AssetType] | null> {
        const response = await fetch(path);
        if (as === "image") {
            const bitmap = await createImageBitmap(await response.blob());
            this.caches.set(path, bitmap);
            return bitmap;
        } else if (as === "audio") {
            const audio = await audioContext.decodeAudioData(await response.arrayBuffer());
            this.caches.set(path, audio);
            return audio;
        } else {
            const blob = await response.blob();
            this.caches.set(path, blob);
            return blob;
        }
    }

    /**
     * このインスタンスに登録されたすべてのアセットを読み込みます。
     */
    public async loadAll() {
        await Promise.all([...this.caches.keys()].map(path => this.load(path)));
    }

    /**
     * アセットを取得します。
     * @param path アセットのパス
     */
    public get(path: string): Blob;
    public get<T extends keyof AssetType>(path: string, as?: T): AssetType[T] | null;
    public get(path: string, as?: keyof AssetType): Blob | AssetType[keyof AssetType] | null {
        if (!this.caches.has(path)) throw new UnknownAssetError(path);
        return this.caches.get(path) ?? null;
    }
}
