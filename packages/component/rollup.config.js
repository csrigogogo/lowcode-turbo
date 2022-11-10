import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import { swc, defineRollupSwcOption } from "rollup-plugin-swc3"
import dts from "rollup-plugin-dts"
// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH
import path from "node:path"
import { fileURLToPath } from "node:url"
// import { readFileSync } from "node:fs"
import pkg from "./package.json" assert { type: "json" } // node 17

const extensions = [".js", ".ts"]

const pathResolve = function (...args) {
  //   const curDirname = fileURLToPath(new URL("./", import.meta.url))
  const __filename = fileURLToPath(import.meta.url)

  const __dirname = path.dirname(__filename)
  console.log(__dirname, args)
  return path.resolve(__dirname, ...args)
}

export default [
  {
    input: pathResolve("./src/main.ts"),
    output: [
      {
        file: pathResolve("./", pkg.main),
        format: "esm",
        sourcemap: true,
      },
    ],
    // external: Object.keys(pkg.dependencies)
    external: ["react/jsx-runtime", "react-dom"], // 打包产物不包含 react 代码
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
  },
  // 单独生成类型文件
  {
    input: pathResolve("./src/main.ts"),
    plugins: [dts()],
    output: {
      format: "esm",
      file: pathResolve("./", pkg.types),
    },
  },
]
