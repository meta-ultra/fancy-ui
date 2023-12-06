const commonjs = require("rollup-plugin-commonjs");
const babel = require("rollup-plugin-babel");
const nodeResolve = require("rollup-plugin-node-resolve");
const replace = require("rollup-plugin-replace");
const { uglify } = require("rollup-plugin-uglify");
const { default: linaria } = require("@linaria/rollup");
const { libStylePlugin } = require("./scripts/rollup-plugin-lib-style/index.js");

const glob = require("glob");
const path = require("node:path");
const pkg = require("./package.json");

const extensions = [".tsx", ".ts", ".jsx", ".js"];

module.exports = {
  input: Object.fromEntries(
    glob.sync("src/**/index.ts").map((file) => {
      return [path.relative("src", file.slice(0, file.length - path.extname(file).length)), file];
    })
  ),
  output: {
    format: "es",
    dir: "./es",
  },
  external: ["react"],
  plugins: [
    replace({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development"),
    }),
    process.env.NODE_ENV === "production" && uglify(),
    nodeResolve({
      extensions,
      modulesOnly: true,
    }),
    commonjs(),
    linaria({
      sourceMap: process.env.NODE_ENV !== "production",
    }),
    libStylePlugin(),
    babel({
      runtimeHelpers: true,
      exclude: "./node_module/**/*",
      extensions,
    }),
  ],
};
