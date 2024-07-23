import { defineConfig, type Options } from "tsup";
const plugin = require("./plugin");

export default defineConfig((options: Options) => ({
  entry: ["./index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  plugins: [plugin()],
  ...options,
}));
