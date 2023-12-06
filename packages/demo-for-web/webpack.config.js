const path = require("node:path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (mode, envVars) => {
  return {
    mode: "development",
    entry: ["./src/index.tsx"],
    output: {
      filename: "static/js/[name].js",
      assetModuleFilename: "static/media/[name][ext][query]",
      publicPath: "/",
    },
    cache: {
      type: "filesystem",
    },
    module: {
      rules: [
        {
          test: /\.[tj]sx?$/i,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
          },
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader", "postcss-loader"],
        },
        {
          test: /\.(png|jpe?g|gif|webp|hdr|eot|otf|ttf|woff)$/i,
          // a file with size less than 8kb will be treated as a `inline` module type and `resource` module type otherwise.
          type: "asset",
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".jsx", ".js"],
      alias: {
        "@": path.resolve("src"),
      },
      mainFiles: ["index"],
      fallback: { stream: require.resolve("stream-browserify") },
    },
    devtool: "eval-cheap-module-source-map",
    watchOptions: {
      ignored: /node_modules/,
    },
    devServer: {
      static: [path.resolve("public")],
      /**
       * `true`, when there is no matching backend service for specified URL, the dev server will respond the `index.html`.
       * `{rewrites: [{from: /error/, to: '/index.html'}]}`, forward to `index.html` when the request URL contains `error`.
       */
      historyApiFallback: true,
      hot: true,
      open: true,
      // port: 8081,
    },
    plugins: [
      new HtmlWebpackPlugin({
        // Deprecated option to set the title for the generated HTML document, use `title` element in template instead.
        // Besides, it's recommended to add the `meta` element, favicon and `base` element in template rather than options of html-webpack-plugin.
        title: "Webpack App",
        // Set Webpack relative or absolute path to the template(parsed by EJS(https://ejs.bootcss.com/) by default).
        // By default it uses `src/index.ejs` if it exists.
        template: "public/index.html",
        // Define EJS variables which can be referenced by `<%= PUBLIC_URL %>`, merged with the default values.
        templateParameters: envVars,
        // The file path to write the HTML to, which is based on the `path` of `output`.
        // The `[name]` placeholder will be replaced with the entry name.
        // In account of `index` option of `devServer` has been removed, set `filename` to `index.html`.
        filename: "index.html",
        // By default it's `true` if `mode` is `production`, otherwise `false`.
        // minify: false,
        // Overrides the `publicPath` of `output` used for `script` and `link` tags, when its value is not the default value - `"auto"`.
        publicPath: "auto",
        // Inject all assets into the given `template`. By default `true` means asset injection depending on the `scriptLoading` option.
        inject: true,
        // By default using non blocking javascript loading `"defer"` to improve the page startup performance.
        // Setting to `"module"` adds attribute `type="module"` on script element.
        scriptLoading: "defer",
      }),
    ],
  };
};
