// 导出接口Options
export interface Options {
    [key: string]: any;
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
    is_export:false,
	files: [
		/\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
	],
};
