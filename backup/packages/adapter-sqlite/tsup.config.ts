import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],
    format: ["esm"],
    dts: true,
    clean: true,
    external: ["better-sqlite3", "sqlite-vec"],
    noExternal: ["@elizaos/*"],
});
