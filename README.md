# api-auto-import

> api 自动导入

## Project setup

```
npm install api-auto-import
```

### 使用方法

```js
// 导出接口Options
export interface Options {
	/**
	 * 输出文件名称
	 */
	outFile?: string;
	/**
	 * 需要导入的目录
	 */
	resolveAliasName: string;
	/**
	 * 全局的模块名称
	 */
	apiName?: string;
	/**
	 * 变量名称
	 */
	constApiData?: string;
	/**
	 * 是否采用文件热更新
	 */
	hotUpdate?: boolean;
	/**
	 * 导入是否携带后缀名
	 */
	suffix?: boolean;
	/**
	 * 需要导出文件类型
	 */
	files?: Array<RegExp>;
	/**
	 * 是否使用默认导出
	 */
	isDefault?: boolean;
	/**
	 * 是否生成ts类型文件
	 */
	is_ts?: boolean;
	/**
	 * 是否挂载在Window对象
	 */
    isWindow?: boolean;
}
// 导出配置config
export const configuration: Options = {
	outFile: 'index.ts',
	resolveAliasName: 'src/api',
	apiName: '$apis',
	hotUpdate: true,
	suffix: false,
	constApiData: '$apiData',
	isDefault: false,
	is_ts: true,
	isWindow: true,
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

isDefault 字段是否默认导出object 否 export default {install()}
export default {install()}
```

###### 示例
```js
import {$apis} from '@/api/index'
```

###### 备注
如果需要使用import引入，请使用import引入
```js
import {$apis} from '@/api/index'
```

###### 备注
如果需要使用export default引入，请使用export default引入
```js
export default constApiData
and
export default {install()}
```