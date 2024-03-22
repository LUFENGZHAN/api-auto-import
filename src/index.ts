import { Options } from "./type";
import path from "path";
import fs from "fs";
import lodash from "lodash";
function getAllFilePaths(directoryPath: string, dirPathNname: string, config: Options) {
    let allFilePaths = [];
    function List(outpath: string, dirPathNname: string) {
        const files = fs.readdirSync(outpath);
        files.forEach((file) => {
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
            if (is_same !== dirPathNname) {
                const pathStr = (config.suffix ? newPath : is_same).replace(directoryPath, config.resolveAliasName).replace(/\\+/g, "/")
                allFilePaths.push(pathStr);
            }
        });
    }
    List(directoryPath, dirPathNname);
    return allFilePaths;
}
function template(allFilePaths, config: Options) {
    const allFilePathsStr =config.resolveAliasName.split('/').filter(e=>!!e)
    const allPaths = allFilePaths.map((pathName: string) => {
        let pathStr = pathName.replace(/\\+/g, "/")
        if (allFilePathsStr[0]!== '@' && allFilePathsStr[0] === 'src') {
            pathStr = pathStr.replace(config.resolveAliasName, '@/'+allFilePathsStr.slice(1).join('/'))
        }
        return {
            importName: pathName
                .replace(/@\//, "")
                .replace(/(\\+|\/)/img, "_")
                .replace(/.[jt]s/, ""),
            import:pathStr
        };
    });
    const apiImport = allPaths.reduce((previousValue:string, currentValue:any) => {
        return previousValue + `// @ts-ignore \n import ${currentValue.importName} from '${currentValue.import}'\n`;
    }, "");
    const apiDate = {
        date: new Date().toLocaleDateString(),
    };
    Object.assign(config, { apiImport, apiDate: JSON.stringify(apiDate) });
    return lodash.template(fs.readFileSync(path.resolve(__dirname, "../src/template.ts")), "utf-8")(config);
}
function traverseFiles(config: Options, outpath: string, dirPathNname: string) {
    const { outFile } = config;
    const allFilePaths = getAllFilePaths(outpath, dirPathNname, config)
    const templateString = template(allFilePaths, config);
    const outFileStr = outFile.match(/(\.[jt]s|\.[tj]sx)$/) ? outFile : `${outFile}.ts`;
    fs.writeFileSync(path.resolve(outpath, outFileStr), templateString);
}
function apiAutoImport(options: Options, targetPath: string, dirPathNname: string) {
    traverseFiles(options, targetPath, dirPathNname);
}
export default apiAutoImport;
