import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import shims from "./shims/shims.js";

export default {
  input: "src/wrap/entry.ts",
  output: {
    file: "bundled/wrap.js",
    format: "cjs",
  },
  plugins: [
    typescript(),
    resolve(),
    commonjs(),
    shims(),
    terser()
  ],
  treeshake: false,
};
