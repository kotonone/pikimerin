import { createCommand } from "./Command";

export const conditionIf = createCommand(
    {
        // name: {
        //     type: "string",
        //     required: true,
        // },
    },
    function (context, {})  {
        if (true) { // TODO: if not matched
            let nextIndex = context.pc + 1;
            while ((context.script[nextIndex]?.indent ?? 0) >= this.indent + 1) nextIndex++;
            context.pc = nextIndex - 1; // NOTE: 実行後 pc++ されるので、引いておく
        }
    },
    // ["name"],
);
