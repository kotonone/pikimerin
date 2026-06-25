/**
 * シナリオコマンドにおいて引数を分ける文字
 */
export const SPLITTER_CHAR = " ";

/**
 * インラインコマンドが含まれた文字列から、コマンドを切り出します。
 * @param line 文字列
 */
export function getCommandsFromLine(line: string): string[] {
    let results: string[] = [];

    const texts = line.split(/{@.*?}/g);
    const commands = Array.from(line.matchAll(/({@.*?})/g)).map(m => m[0]);

    for (let i = 0; i < texts.length; i++) {
        const text = texts[i]!;

        results.push(text);
        if (i < commands.length) results.push(commands[i]!);
    }

    return results.filter(s => s !== "");
}

/**
 * `splitter` で文字列を分割します。
 *
 * \ で直後の文字のエスケープが可能です。
 * \uxxxx で Unicode から文字を呼び出します。
 * "" で囲まれた部分はエスケープ対象外になります。
 *
 * @param content 文字列
 * @param variables 変数
 * @param ignores エスケープをせず、バックスラッシュも残す文字
 */
export function splitArguments(content: string, splitter: string = SPLITTER_CHAR, ignores?: string[]): string[] {
    let escapes: string[] = [];
    let quotes: string[] = [];

    return content
        // NOTE: エスケープ文字列を保存する
        .replace(/\\([xuXU][0-9A-Fa-f]{1,4}|.)/g, s => {
            if (ignores?.includes(s.slice(1))) {
                return s;
            }

            if (s.length > 2) {
                escapes.push(String.fromCharCode(parseInt(s.slice(2), 16)));
            } else if (s[1] === "n") {
                escapes.push("\n");
            } else {
                escapes.push(s.slice(1));
            }
            console.log(escapes.at(-1));
            return "\\e" + (escapes.length - 1).toString() + ";";
        })

        // NOTE: クオーテーション文字列を保存する
        .replace(/".*?"/g, s => { quotes.push(s.slice(1, -1)); return "\\q" + (quotes.length - 1).toString() + ";" })

        // NOTE: 文字列を分割
        .split(splitter)
        .map(s => s
            // NOTE: クオーテーション文字列を復元する
            .replace(/\\q\d+;/g, s => quotes[parseInt(s.slice(2, -1))] ?? "")

            // NOTE: エスケープ文字列を復元する
            .replace(/\\e\d+;/g, s => escapes[parseInt(s.slice(2, -1))] ?? "")
        );
}
