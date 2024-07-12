# api-auto-import

> api 自动导入

## Project setup

```
npm install api-auto-import
```

### 使用方法

```js
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
	 * 导出的对象中是否有install方法
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
	/**
	 * 是否导出每个模块
	 */
	is_export?: boolean;
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
	is_export: false,
	files: [
		/\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
	],
};
```

###### vite

```js
// vite.config.ts
import { defineConfig } from 'vite';
import apiAuto from 'api-auto-import/vite';
import { resolve } from 'path';
export default defineConfig({
	resolve: {
		alias: {
			'@': resolve(__dirname, 'src'),
		},
	},
	plugins: [
		apiAuto({
			resolveAliasName: '@/api',
			outFile: 'index.ts',
		}),
	],
});
```

webpack

```js
// vue.config.js
const { defineConfig } = require('@vue/cli-service');
const apiAuto = require('api-auto-import/webpack');
module.exports = defineConfig({
	transpileDependencies: true,
	configureWebpack: {
		plugins: [
			new apiAuto({
				resolveAliasName: '@/api',
				outFile: 'index.ts',
			}),
		],
	},
});
```

```js
// webpack.config.js
// Generated using webpack-cli https://github.com/webpack/webpack-cli
const path = require('path');
const apiAuto = require('api-auto-import/webpack');
module.exports = {
	plugins: [
		new apiAuto({
			resolveAliasName: '@/api',
			outFile: 'index.ts',
		}),
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src'),
		},
	},
};
```

### 注意

使用时，请确保 resolve 配置正确，否则无法正确解析

请确您的项目配置好支持 import,使用 TypeScript,
使用 tsconfig.json 配置好 paths

```js
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    },
  }
}
```

###### 备注

webpack.config.js 或 vue.config.js 中热更新可能无法生效或出现无限循环，请使用 hotUpdate 入参关闭热更新

```js
new apiAuto({
	resolveAliasName: '@/api',
	outFile: 'index.ts',
	hotUpdate: false,
});
```
