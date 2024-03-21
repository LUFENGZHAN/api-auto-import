import {Options, config} from "./type";
import apiAuto from "./index";
import path from "path";
export default function apiAutoImport(options?: Options) {
    Object.assign(config, options);
    const reg = new RegExp(config.resolveName.replace(/\//g, "\\\\"), "g");
    const outFileName = config.outFile.replace(/\.[tj]s$/, "");
    const currentDir = process.cwd()
    const dirPath = path.join(currentDir, config.resolveName);
    const dirPathNname = path.join(currentDir, config.resolveName, outFileName);
    apiAuto(config, dirPath, dirPathNname);
    return {
        name: "api-auto-import",
        configureServer(server) {
            server.watcher.on("all", (type, path) => {
                if (reg.test(path)) {
                    apiAuto(config, dirPath, dirPathNname);
                }
            });
            server.watcher.add(dirPath);
        },
    };
}
