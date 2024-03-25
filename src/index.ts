import path from "path";
import fs from "fs";
import {Options, configuration} from "./type";
import {Plugin} from "vite";
import lodash from "lodash";
function isMatchingFormat(str, files) {
    for (let i = 0; i < files.length; i++) {
        if (Object.prototype.toString.call(files[i]) !== "[object RegExp]") {
            return false;
        }
        if (files[i].test(str)) {
            return true;
        }
    }
    return false;
}
function replacedStr(str) {
    return str.replace(/-(\w)/gim, function (match, p1) {
        return p1.toUpperCase();
    });
}
function getAllFilePaths(directoryPath: string, dirPathNname: string, config: Options) {
    let allFilePaths = [];
    const {suffix, resolveAliasName, files} = config;
    function List(outpath: string, dirPathNname: string) {
        const fileList = fs.readdirSync(outpath);
        fileList.forEach((file) => {
            const newPath = path.join(outpath, file);
            const stats = fs.statSync(newPath);
            if (stats.isDirectory()) {
                const is_file = fs.readdirSync(newPath);
                if (is_file.length !== 0) {
                    List(newPath, dirPathNname);
                }
                return;
            }
            const is_same = newPath.replace(/\.[tj]s/g, "");
            if (is_same !== dirPathNname && isMatchingFormat(newPath, files)) {
                const pathStr = (suffix ? newPath : is_same).replace(directoryPath, resolveAliasName).replace(/\\+/g, "/");
                allFilePaths.push(pathStr);
            }
        });
    }
    List(directoryPath, dirPathNname);
    return allFilePaths;
}

function template(allFilePaths, config: Options) {
    const allFilePathsStr = config.resolveAliasName.split("/").filter((e) => !!e);
    const allPaths = allFilePaths.map((pathName: string) => {
        let pathStr = pathName.replace(/\\+/g, "/");
        if (allFilePathsStr[0] !== "@" && allFilePathsStr[0] === "src") {
            pathStr = pathStr.replace(config.resolveAliasName, "@/" + allFilePathsStr.slice(1).join("/"));
        }
        return {
            importName: replacedStr(pathStr)
                .replace(/@\//, "")
                .replace(allFilePathsStr[1], "")
                .replace(/^(\/)/, "")
                .replace(/(\\+|\/+)/gim, "_")
                .replace(/\./gim, "_")
                .replace(/.[jt]s/, ""),
            pathStr: replacedStr(pathStr)
                .replace(/@\//, "")
                .replace(allFilePathsStr[1], "")
                .replace(/\./gim, "_")
                .replace(/(\\+|\/+)/gim, "/")
                .replace(/.[jt]s/, ""),
            import: pathStr.replace(/(\\+|\/+)/gim, "/").replace(/^(\/)/, ""),
        };
    });
    const apiImport = allPaths.reduce((previousValue: string, currentValue: any) => {
        return previousValue + `// @ts-ignore \nimport ${currentValue.importName} from '${currentValue.import}'\n`;
    }, "");
    const transformedData = {};
    allPaths.forEach((item) => {
        const parts = item.pathStr.split("/").filter((part) => part !== "");
        let currentLevel = transformedData;
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            if (i === parts.length - 1 && !currentLevel[part]) {
                currentLevel[part] = item.importName;
            } else {
                currentLevel[part] = currentLevel[part] || {};
                currentLevel = currentLevel[part];
            }
            if (i === parts.length - 1) {
                currentLevel[item.importName] = item.importName;
            }
        }
    });
    Object.assign(config, {apiImport, apiDate: JSON.stringify(transformedData, null, 4).replace(/"|'/gim, "")});
    return lodash.template(fs.readFileSync(path.resolve(__dirname, "../src/template.ts")), "utf-8")(config);
}
function apiAutoImport(config: Options, outpath: string, dirPathNname: string) {
    if (!fs.existsSync(outpath)) return console.warn('\x1b[33m%s\x1b[0m',`'${outpath}' not exist`);
    const {outFile} = config;
    const allFilePaths = getAllFilePaths(outpath, dirPathNname, config);
    const templateString = template(allFilePaths, config);
    const outFileStr = outFile.match(/(\.[jt]s|\.[tj]sx)$/) ? outFile : `${outFile}.ts`;
    fs.writeFileSync(path.resolve(outpath, outFileStr), templateString);
}
function getConfig(options: Options) {
    const config = Object.assign({}, configuration, options);
    const resolveName = config.resolveAliasName.replace(/@/g, "src");
    const outFileName = config.outFile.replace(/\.[tj]s$/, "");
    const reg = new RegExp(resolveName.replace(/(\/)/gim, "\\\\"), "ig");
    const currentDir = process.cwd();
    const dirPath = path.join(currentDir, resolveName);
    const dirPathNname = path.join(currentDir, resolveName, outFileName);
    return {
        config,
        resolveName,
        outFileName,
        reg,
        dirPath,
        dirPathNname,
    };
}
export function apiAutoVite(options: Options): Plugin {
    const config = getConfig(options);
    apiAutoImport(config.config, config.dirPath, config.dirPathNname);
    return {
        name: "api-auto-import",
        configureServer(server) {
            server.watcher.on("all", (type, path) => {
                if (path.match(config.reg)) {
                    apiAutoImport(config.config, config.dirPath, config.dirPathNname);
                }
            });
            server.watcher.add(config.dirPath);
        },
    };
}
export class apiAutoWebpack {
    private config;
    constructor(options: Options) {
        this.config = getConfig(options);
    }
    apply(compiler) {
        const {config} = this;
        apiAutoImport(config.config, config.dirPath, config.dirPathNname);
    }
}
