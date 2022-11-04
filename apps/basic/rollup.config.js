import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import { terser } from "@rollup/plugin-terser"
import babel from "@rollup/plugin-babel"
// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH
const path = require("path")
const pkg = require("./package.json")

const extensions = [".js", ".ts"]

const resolve1 = function (...args) {
  return path.resolve(__dirname, ...args)
}

export default {
  input: resolve1("./src/main.ts"),
  output: {
    file: resolve1("./", pkg.main),
    format: "esm", // immediately-invoked function expression — suitable for <script> tags
    sourcemap: true,
  },
  plugins: [
    resolve({
      extensions,
      modulesOnly: true,
    }), // tells Rollup how to find date-fns in node_modules
    babel({
      exclude: "node_modules/**",
      extensions,
    }),
    // commonjs(), // converts date-fns to ES modules
    // production && terser(), // minify, but only in production
  ],
}
