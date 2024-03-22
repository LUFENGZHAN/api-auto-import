import {Options, config} from "./type";
import {Plugin} from "vite";
import apiAuto from "./index";
import path from "path";
module.exports = function apiAutoImport(options: Options): Plugin {
    Object.assign(config, options);
    const resolveName = config.resolveAliasName.replace(/@/g, "src");
    const outFileName = config.outFile.replace(/\.[tj]s$/, "");
    const reg = new RegExp(resolveName.replace(/(\/)/img,'\\\\'), "ig");
    const currentDir = process.cwd();
    const dirPath = path.join(currentDir, resolveName);
    const dirPathNname = path.join(currentDir, resolveName, outFileName);
    apiAuto(config, dirPath, dirPathNname);
    return {
        name: "api-auto-import",
        configureServer(server) {
            server.watcher.on("all", (type, path) => {
                if (path.match(reg)) {
                    apiAuto(config, dirPath, dirPathNname);
                }
            });
            server.watcher.add(dirPath);
        },
    };
};
