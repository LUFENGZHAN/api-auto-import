import {Options} from "./type";
import path from "path";
import fs from "fs";
import lodash from "lodash";
function getAllFilePaths(directoryPath: string, dirPathNname: string) {
    let allFilePaths = [];
    function newList(outpath: string, dirPathNname: string) {
        const files = fs.readdirSync(outpath);
        files.forEach((file) => {
            const newPath = path.join(outpath, file);
            const stats = fs.statSync(newPath);
            if (stats.isDirectory()) {
                const is_file = fs.readdirSync(newPath);
                if (is_file.length !== 0) {
                    newList(newPath, dirPathNname);
                }
                return;
            }
            const is_same = newPath.replace(/\.[tj]s/g, "");
            if (is_same !== dirPathNname) {
                allFilePaths.push(newPath);
            }
        });
    }
    newList(directoryPath, dirPathNname);
    return allFilePaths;
}
function template(allFilePaths, config:Options) {
    const allPaths = allFilePaths.map((pathName:string) => {
        return {
            importName: pathName.replace(/@\//, '').replace(/(\\+|\/)/img, '_').replace(/.[jt]s/,''),
            import:pathName.replace(/(\\+|\/)/img, '/'),
        }
    });
    const apiImport = allPaths.reduce((previousValue, currentValue,) => {
        return previousValue + `// @ts-ignore \n import ${currentValue.importName} from '${currentValue.import}'\n`;
    }, '')
    return  lodash.template(fs.readFileSync(path.resolve(__dirname, "../src/template.ts")),'utf-8')({apiImport,constApiData:config.constApiData,apiName:config.apiName})
    
    
}
function traverseFiles(config: Options, outpath: string, dirPathNname: string) {
    const {resolveAliasName, outFile, outdir, name, constApiData} = config;
    const importName = path.resolve(resolveAliasName.replace(/@/, "src"));
    const allFilePaths = getAllFilePaths(outpath, dirPathNname).map((item) => {
        return item.replace(importName, resolveAliasName);
    });
    const templateString=template(allFilePaths, config);
    fs.writeFileSync(path.resolve(outpath,outFile),templateString) 

}
function apiAutoImport(options: Options, targetPath: string, dirPathNname: string) {
    traverseFiles(options, targetPath, dirPathNname);
}
export default apiAutoImport;
