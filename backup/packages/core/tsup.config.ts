import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],
    format: ["esm"],
    dts: true,
    clean: true,
    external: [
        "@anush008/tokenizers",
        "better-sqlite3",
        "uuid",
        "fs",
        "path",
        "http",
        "https"
    ],
    noExternal: ["@elizaos/*"],
    platform: "node",
    target: "node18",
});
