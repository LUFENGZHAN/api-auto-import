import path from "path";
import fs from "fs";
import lodash from "lodash";
function getAllFilePaths(directoryPath: string, dirPathNname: string) {
    let allFilePaths = []
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
    return allFilePaths
}
function traverseFiles(outpath: string, dirPathNname: string) {
    const allFilePaths = getAllFilePaths(outpath, dirPathNname)
    console.log(allFilePaths, 'allFilePaths',allFilePaths.length);

}
function isFolder(directoryPath: string, config: any) { }
function apiAutoImport(options: any, targetPath: string, dirPathNname: string) {
    traverseFiles(targetPath, dirPathNname);
}
export default apiAutoImport;
