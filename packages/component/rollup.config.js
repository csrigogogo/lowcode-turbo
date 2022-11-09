import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
// import { terser } from "@rollup/plugin-terser"
// import babel from "@rollup/plugin-babel"
import { swc, defineRollupSwcOption } from "rollup-plugin-swc3"
// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH

const path = require("path")
const pkg = require("./package.json")

const extensions = [".js", ".ts"]

const pathResolve = function (...args) {
  return path.resolve(__dirname, ...args)
}

export default {
  input: pathResolve("./src/main.ts"),
  output: {
    file: pathResolve("./", pkg.main),
    format: "esm",
    sourcemap: true,
  },
  external: ['react/jsx-runtime', 'react-dom'], // 打包产物不包含 react 代码
  plugins: [
    resolve({
      extensions,
      modulesOnly: true,
    }),
    commonjs(),
    swc(
      // 自动补全
      defineRollupSwcOption({
        // All options are optional
        include: /\.[jt]sx?$/, // default
        exclude: /node_modules/, // default
        tsconfig: "tsconfig.json", // default
        // And add your swc configuration here!
        // "filename" will be ignored since it is handled by rollup
        jsc: {},
        sourceMaps: true,
      })
    ),
    // babel({
    //   exclude: "node_modules/**",
    //   extensions,
    //   babelHelpers: "bundled",
    //   rootMode: 'upward'
    // }),
    // commonjs(), // converts date-fns to ES modules
    // production && terser(), // minify, but only in production
  ],
}
