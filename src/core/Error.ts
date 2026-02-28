export class AmeriScriptError extends Error {
    constructor(message: string = "General interpreter error") {
        super();
        this.name = this.constructor.name;
        this.message = message;
    }
}
export class InternalCancelledNoticeError extends AmeriScriptError {
    constructor() {
        super("Script was cancelled");
    }
}
// TODO: コンテキスト情報の受け渡しが不適切
export class IndentError extends AmeriScriptError {
    constructor(line: number) {
        super("Invalid indent at line " + line);
    }
}
export class InvalidArgumentError extends AmeriScriptError {
    constructor(command: string) {
        super("Invalid argument at command " + command);
    }
}
export class UnknownCommandError extends AmeriScriptError {
    constructor(content: string) {
        super("Unknown command: " + content);
    }
}
export class CommandRangeError extends AmeriScriptError {
    constructor() {
        super("Command range exceeded");
    }
}
