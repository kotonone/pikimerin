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
export class ArgumentMissingError extends AmeriScriptError {
    constructor(command: string, argument: string) {
        super("Missing argument " + argument + " at command " + command);
    }
}
export class ArgumentTooManyError extends AmeriScriptError {
    constructor(command: string) {
        super("Too many arguments at command " + command);
    }
}
/** 引数が二度以上指定された場合のエラー */
export class ArgumentDuplicatedError extends AmeriScriptError {
    constructor(command: string, argument: string) {
        super("Argument " + argument + " is specified multiple times at command " + command);
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
