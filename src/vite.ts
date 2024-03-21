import {Options, config} from "./type";
import apiAuto from "./index";
import path from "path";
export default function apiAutoImport(options?: Options) {
    Object.assign(config, options);
    const reg = new RegExp(config.resolveName.replace(/\//g, "\\\\"), "g");
    const outFileName = config.outFile.replace(/\.[tj]s$/, "");
    const dirPath = path.resolve(process.cwd(), config.resolveName);
    const dirPathNname = path.resolve(process.cwd(), config.resolveName, outFileName);
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
            server.watcher.on("ready", () => {
                console.log("插件逻辑执行完毕，启动 Vite 服务");
                server.httpServer.listen(server.config.server.port);
            });
        },
    };
}
