import path from "path";
import fs from "fs";
import lodash from "lodash";
function is_file(directoryPath: string, dirPathNname: string) {
    let file_lists = [];
    function newList(outpath:string,dirPathNname:string ) {
        const files = fs.readdirSync(outpath);
        const child = []
        files.forEach((file) => {
            const newPath = path.join(outpath, file);
            const stats = fs.statSync(newPath);
            if (stats.isDirectory()) {
                const is_file = fs.readdirSync(newPath);
                if (is_file.length !== 0) {
                    traverseFiles(newPath, dirPathNname);
                }
                return;
            }
            const is_same = newPath.replace(/\.[tj]s/g, "");
            if (is_same !== dirPathNname) {
                child.push(newPath);
            }
        });
        console.log(child,'child');
        file_lists.push(...child);
    }
    newList(directoryPath,dirPathNname);
    return file_lists;
}
function traverseFiles(outpath: string, dirPathNname: string) {
    const list = is_file(outpath, dirPathNname);
    console.log(list,'list');
}
function isFolder(directoryPath: string, config: any) {}
function apiAutoImport(options: any, targetPath: string, dirPathNname: string) {
    traverseFiles(targetPath, dirPathNname);
}
export default apiAutoImport;
