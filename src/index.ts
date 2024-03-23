import path from "path";
import fs from "fs";
import { Options, configuration } from "./type";
import { Plugin } from "vite";
import lodash from "lodash";
function isMatchingFormat(str, files) {
    for (let i = 0; i < files.length; i++) {
        if (Object.prototype.toString.call(files[i]) !== '[object RegExp]') {
            return false
        }
        if (files[i].test(str)) {
            return true;
        }
    }
    return false;
}
function replacedStr(str) {
    return str.replace(/-(\w)/img, function (match, p1) {
        return p1.toUpperCase();
    });
}
function getAllFilePaths(directoryPath: string, dirPathNname: string, config: Options) {
    let allFilePaths = [];
    const { suffix, resolveAliasName, files } = config
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
                const pathStr = (suffix ? newPath : is_same).replace(directoryPath, resolveAliasName).replace(/\\+/g, "/")
                allFilePaths.push(pathStr);
            }
        });
    }
    List(directoryPath, dirPathNname);
    return allFilePaths;
}

function template(allFilePaths, config: Options) {
    const allFilePathsStr = config.resolveAliasName.split('/').filter(e => !!e)
    const allPaths = allFilePaths.map((pathName: string) => {
        let pathStr = pathName.replace(/\\+/g, "/")
        if (allFilePathsStr[0] !== '@' && allFilePathsStr[0] === 'src') {
            pathStr = pathStr.replace(config.resolveAliasName, '@/' + allFilePathsStr.slice(1).join('/'))
        }
        return {
            importName: replacedStr(pathStr)
                .replace(/@\//, "")
                .replace(allFilePathsStr[1], "")
                .replace(/^(\/)/, "")
                .replace(/(\\+|\/+)/img, "_")
                .replace(/\./img, "_")
                .replace(/.[jt]s/, ""),
            pathStr: replacedStr(pathStr).replace(/@\//, "").replace(allFilePathsStr[1], "")
                .replace(/\./img, "_").replace(/(\\+|\/+)/img, "/").replace(/.[jt]s/, ""),
            import: pathStr.replace(/(\\+|\/+)/img, "/").replace(/^(\/)/, "")
        };
    });
    const apiImport = allPaths.reduce((previousValue: string, currentValue: any) => {
        return previousValue + `// @ts-ignore \nimport ${currentValue.importName} from '${currentValue.import}'\n`;
    }, "");
    const transformedData = {};
    allPaths.forEach(item => {
        const parts = item.pathStr.split('/').filter(part => part !== '');
        let currentLevel = transformedData;
        parts.forEach((part, index) => {
            if (index === parts.length - 1) {
                currentLevel[part] = item.importName;
            } else {
                currentLevel[part] = currentLevel[part] || {};
                currentLevel = currentLevel[part];
            }
        });
    });
    Object.assign(config, { apiImport, apiDate: JSON.stringify(transformedData, null, 4).replace(/"|'/img, '') });
    return lodash.template(fs.readFileSync(path.resolve(__dirname, "../src/template.ts")), "utf-8")(config);
}
export function apiAutoImport(config: Options, outpath: string, dirPathNname: string) {
    const { outFile } = config;
    const allFilePaths = getAllFilePaths(outpath, dirPathNname, config)
    const templateString = template(allFilePaths, config);
    const outFileStr = outFile.match(/(\.[jt]s|\.[tj]sx)$/) ? outFile : `${outFile}.ts`;
    fs.writeFileSync(path.resolve(outpath, outFileStr), templateString);
}
export function apiAutoVite(options: Options): Plugin {
    Object.assign(configuration, options);
    const resolveName = configuration.resolveAliasName.replace(/@/g, "src");
    const outFileName = configuration.outFile.replace(/\.[tj]s$/, "");
    const reg = new RegExp(resolveName.replace(/(\/)/img, '\\\\'), "ig");
    const currentDir = process.cwd();
    const dirPath = path.join(currentDir, resolveName);
    const dirPathNname = path.join(currentDir, resolveName, outFileName);
    apiAutoImport(configuration, dirPath, dirPathNname);
    return {
        name: "api-auto-import",
        configureServer(server) {
            server.watcher.on("all", (type, path) => {
                if (path.match(reg)) {
                    apiAutoImport(configuration, dirPath, dirPathNname);
                }
            });
            server.watcher.add(dirPath);
        },
    };
};
export class apiAutoWebpack {
    private options
    private dirPath
    private dirPathNname
    constructor(options: Options) {
        this.options = Object.assign({}, configuration, options);
        const resolveName = this.options.resolveAliasName.replace(/@/g, "src");
        const outFileName = this.options.outFile.replace(/\.[tj]s$/, "");
        const reg = new RegExp(resolveName.replace(/(\/)/img, '\\\\'), "ig");
        const currentDir = process.cwd();
        this.dirPath = path.join(currentDir, resolveName);
        this.dirPathNname = path.join(currentDir, resolveName, outFileName);
    }
    apply(compiler) {
        const { options, dirPath, dirPathNname } = this;
        apiAutoImport(options, dirPath, dirPathNname);
    }
}