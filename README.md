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
    // 变量名称
    constApiData?: string;
    // 是否采用文件热更新
    hotUpdate?:boolean;
    // 导入是否携带后缀名
    suffix?: boolean;
    // 需要导出文件类型
    files?:Array<RegExp>
}
// 导出配置config
export const config: Options = {
    outFile: "index.ts",
    resolveAliasName: "src/api",
    apiName: "$apis",
    hotUpdate: true,
    suffix: false,
    constApiData: "$apiDate",
    files: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
    ],
};
```
``` js
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    },                             
  }
}
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
            outFile: "index.ts",
        }),
    ],
});
```

webpack

```js
// vue.config.js
const { defineConfig } = require('@vue/cli-service')
const apiAuto = require('api-auto-import/webpack')
module.exports = defineConfig({
    transpileDependencies: true,
    configureWebpack: {
        plugins: [
            new apiAuto({
                resolveAliasName: "@/api",
                outFile: "index.ts",
            }),
        ],
    },
})
```
```js
// webpack.config.js
// Generated using webpack-cli https://github.com/webpack/webpack-cli
const path = require('path');
const apiAuto = require('api-auto-import/webpack')
module.exports ={
    plugins: [
        new apiAuto({
            resolveAliasName: "@/api",
            outFile: "index.ts",
        }),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
        },
    },
}

```
### 注意
使用时，请确保resolve配置正确，否则无法正确解析

请确您的项目配置好支持import,使用TypeScript,使用ES6语法
###### 示例
```js
import index from '@/api/index'
```
###### 备注
webpack.config.js或vue.config.js 中热更新可能无法生效或出现无限循环，请使用hotUpdate入参关闭热更新
```js
new apiAuto({
    resolveAliasName: "@/api",
    outFile: "index.ts",
    hotUpdate: false,
})
```