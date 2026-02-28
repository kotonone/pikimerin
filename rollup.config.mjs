// @ts-check

import { rm } from "node:fs/promises";
import { defineConfig } from "rollup";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import dts from "rollup-plugin-dts";

export default defineConfig([
    {
        input: "src/index.ts",
        output: [
            {
                file: "dist/index.cjs",
                format: "cjs",
                sourcemap: true,
            },
            {
                file: "dist/index.mjs",
                format: "es",
                sourcemap: true,
            },
        ],
        plugins: [
            {
                name: "clean-dir",
                buildStart: () => rm("dist", { recursive: true, force: true }),
            },
            typescript({
                tsconfig: "tsconfig.json",
                declaration: true,
                declarationMap: false,
                outputToFilesystem: false,
                declarationDir: "dist/@types",
            }),
            terser(),
        ],
    },
    {
        input: "dist/@types/src/index.d.ts",
        output: {
            file: "dist/index.d.ts",
            format: "es",
        },
        plugins: [
            dts(),
            {
                name: "clean-dir",
                buildEnd: () => rm("dist/@types", { recursive: true, force: true }),
            },
        ],
    },
]);
