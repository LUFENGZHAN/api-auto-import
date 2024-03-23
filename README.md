# api-auto-import

> 记录 vue api 自动导入

## Project setup

```
npm install api-auto-import
```

### 使用方法

```js
export interface Options {
    // 输出文件名称
    outFile: string;
    // 导入别名
    resolveAliasName: string;
    // 全局的模块名称
    apiName?: string;
    // 导入变量名称
    constApiData?: string;
    // 导入是否携带文件后缀名
    suffix?: boolean;
    // 需要导入的文件类型默认.ts, .tsx, .js, .jsx
    files?:Array<RegExp>
}
// 导出配置config
export const config: Options = {
    outFile: "index.ts",
    resolveAliasName: "src/api",
    apiName: "$apis",
    suffix: false,
    constApiData: "$apiDate",
    files: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
    ],
};
```

###### vite

```js
// vite.config.ts
import {defineConfig} from "vite";
import apiAuto from "api-auto-import/vite";
import {resolve} from "path";
export default defineConfig({
    resolve: {
        alias: {
            "@": resolve(__dirname, "src"),
        },
    },
    plugins: [
        apiAuto({
            resolveAliasName: "@/api",
            outFile: "index",
        }),
    ],
});
```

webpack

```js
// vue.config
const {defineConfig} = require("@vue/cli-service");
const apiAuto = require("api-auto-import/webpack");
module.exports = defineConfig({
    transpileDependencies: true,
    configureWebpack: {
        plugins: [
            new apiAuto({
                resolveAliasName: "@/api",
                outFile: "index",
            }),
        ],
    },
});
```
