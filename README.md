# api-auto-import

> api 自动导入

## Project setup

```
npm install api-auto-import -D
```

### 使用方法

```js
// 默认配置
apiAuto({
	outFile: 'index.ts',//输出文件名称
	resolveAliasName: 'src/api',//需要导入的目录
	apiName: '$apis',//全局的模块名称
	hotUpdate: true,//是否采用文件热更新
	suffix: false,//导入是否携带后缀名
	constApiData: '$apiData',//变量名称
	isDefault: false,//导出的对象中是否有install方法
	is_ts: true,//是否生成ts类型文件
	isWindow: true,//是否挂载在Window对象
	is_export: false,//是否导出每个模块
	files: [
		/\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
	],//需要导出文件类型
});
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

在编辑器中使用 ES6 import 语法时，应该能够正常显示鼠标悬停提示和类型信息
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

webpack.config.js 或 vue.config.js 中热更新可能无法生效或出现无限循环，请使用 hotUpdate 入参关闭热更新

```js
new apiAuto({
	resolveAliasName: '@/api',
	outFile: 'index.ts',
	hotUpdate: false,
});
```
###### 生成的默认样例
```js
/*eslint-disable*/

// @ts-ignore 
import {App} from "vue";

// @ts-ignore
import v1_index from '@/api/v1/index'
// @ts-ignore
import v1 from '@/api/v1'
// @ts-ignore
import v2_a from '@/api/v2/a'
// @ts-ignore
import v2 from '@/api/v2'
// @ts-ignore
import v3_w from '@/api/v3/w'
// @ts-ignore
import v3 from '@/api/v3'


export const $apiData = {
    v1: {
        index: v1_index,
        ...v1
    },
    v2: {
        a: v2_a,
        ...v2
    },
    v3: {
        w: v3_w,
        ...v3
    }
};


declare global {
    const $apis:typeof $apiData;
    
    interface Window {
        $apis : typeof $apiData;
    }
    
}



export default {
    install(app:App<Element>){
        app.config.globalProperties.$apis = $apiData;
        
        window.$apis = $apiData;
        
    },
}


```

