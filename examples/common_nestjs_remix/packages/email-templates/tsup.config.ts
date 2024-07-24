import { defineConfig, type Options } from "tsup";
import tsupPlugin from "./plugin.mjs";

export default defineConfig(async (options: Options) => {
  return {
    entry: ["./src/index.ts"],
    format: ["cjs", "esm"],
    plugins: [tsupPlugin()],
    dts: true,
    ...options,
  };
});
