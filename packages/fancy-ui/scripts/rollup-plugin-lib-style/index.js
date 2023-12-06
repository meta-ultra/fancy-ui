const { createFilter } = require("rollup-pluginutils");
const { postCssTransformer } = require("./postCssTransformer");
const fs = require("fs-extra");
const sass = require("sass");
const glob = require("glob");
const path = require("node:path");

const PLUGIN_NAME = "rollup-plugin-lib-style";
const MAGIC_PATH_REGEX = /@@_MAGIC_PATH_@@/g;
const SUPER_MAGIC_PATH_REGEX = /(import\s+['"])@@_MAGIC_PATH_@@\/(.+)\/([^/]+\.css['"]\s*;)/g;
const MAGIC_PATH = "@@_MAGIC_PATH_@@";

const modulesIds = new Set();

const outputPaths = [];

const defaultLoaders = [
  {
    name: "sass",
    regex: /\.(sass|scss)$/,
    process: ({ filePath }) => ({ code: sass.compile(filePath).css.toString() }),
  },
  {
    name: "css",
    regex: /\.(css)$/,
    process: ({ code }) => ({ code }),
  },
];

const superReplaceMagicPath = (currentPath) => (fileContent) => {
  const match = SUPER_MAGIC_PATH_REGEX.exec(fileContent);
  if (match) {
    const currentPathDir = currentPath.split(path.sep).slice(1, -1).join("/");
    if (match[2] === currentPathDir) {
      return fileContent.replace(SUPER_MAGIC_PATH_REGEX, "$1./$3");
    } else {
      return fileContent.replace(SUPER_MAGIC_PATH_REGEX, "");
    }
  } else {
    return fileContent.replace(SUPER_MAGIC_PATH_REGEX, "$1./$3");
  }
};
const replaceMagicPath = (fileContent) => fileContent.replace(MAGIC_PATH_REGEX, ".");

const libStylePlugin = (options = {}) => {
  const { loaders, include, exclude, importCSS = true, ...postCssOptions } = options;
  const allLoaders = [...(loaders || []), ...defaultLoaders];
  const filter = createFilter(include, exclude);
  const getLoader = (filepath) => allLoaders.find((loader) => loader.regex.test(filepath));

  const styles = {};
  // Get all CSS modules in the order that they were imported
  const getCSSModules = (id, getModuleInfo, modules = new Set(), visitedModules = new Set()) => {
    if (modules.has(id) || visitedModules.has(id)) {
      return new Set();
    }

    if (filter(id)) modules.add(id);

    // Prevent infinite recursion with circular dependencies
    visitedModules.add(id);

    // Recursively retrieve all of imported CSS modules
    const info = getModuleInfo(id);
    if (!info) return modules;

    info.importedIds.forEach((importId) => {
      modules = new Set(
        [].concat(
          Array.from(modules),
          Array.from(getCSSModules(importId, getModuleInfo, modules, visitedModules))
        )
      );
    });

    return modules;
  };

  return {
    name: PLUGIN_NAME,

    options(options) {
      if (!options.output) console.error("missing output options");
      else options.output.forEach((outputOptions) => outputPaths.push(outputOptions.dir));
    },

    async transform(code, id) {
      const loader = getLoader(id);
      if (!filter(id) || !loader) return null;

      // Keep track of every stylesheet
      // Check if it changed since last render
      // NOTE: If we are in transform block, we can assume styles[id] !== code, right?
      if (styles[id] !== code && (styles[id] || code)) {
        styles[id] = code;
      }

      modulesIds.add(id);

      const rawCss = await loader.process({ filePath: id, code });

      const postCssResult = await postCssTransformer({
        code: rawCss.code,
        fiePath: id,
        options: postCssOptions,
      });

      for (const dependency of postCssResult.dependencies) this.addWatchFile(dependency);

      // const cssFilePath = id.replace(process.cwd(), "").replace(/\\/g, "/");
      let cssFilePath = id.replace(process.cwd(), "").replace(/\\/g, "/");
      cssFilePath = cssFilePath.replace(/^\/src/, "");

      // create a new css file with the generated hash class names
      this.emitFile({
        type: "asset",
        fileName: cssFilePath.replace("/", "").replace(loader.regex, ".css"),
        source: postCssResult.extracted.code,
      });

      const importStr = importCSS
        ? `import "${MAGIC_PATH}${cssFilePath.replace(loader.regex, ".css")}";\n`
        : "";

      // create a new js file with css module
      return {
        code: importStr + postCssResult.code,
        map: { mappings: "" },
      };
    },
    generateBundle(opts, bundle) {
      const ids = new Set();

      // Determine import order of files
      for (const file in bundle) {
        const root = bundle[file].facadeModuleId;
        const modules = getCSSModules(root, this.getModuleInfo);
        modules.forEach((id) => ids.add(id));
      }

      // Combine all stylesheets, respecting import order
      const css = Array.from(ids)
        .map((id) => styles[id])
        .join("\n");

      let fileName = options.output || "index.css";

      // Emit styles to file
      this.emitFile({ type: "asset", name: "", fileName, source: css + "\n" });
    },
    async closeBundle() {
      if (!importCSS) return;

      // get all the modules that import CSS files
      const importersPaths = outputPaths
        .reduce((result, currentPath) => {
          result.push(glob.sync(`${currentPath}/**/*.js`));
          return result;
        }, [])
        .flat();

      // replace magic path with relative path
      await Promise.all(
        importersPaths.map((currentPath) =>
          fs
            .readFile(currentPath)
            .then((buffer) => buffer.toString())
            // .then(replaceMagicPath)
            .then(superReplaceMagicPath(currentPath))
            .then((fileContent) => fs.writeFile(currentPath, fileContent))
        )
      );
    },
  };
};

const onwarn = (warning, warn) => {
  if (warning.code === "UNRESOLVED_IMPORT" && warning.message.includes(MAGIC_PATH)) return;
  warn(warning);
};

module.exports = { libStylePlugin, onwarn };
