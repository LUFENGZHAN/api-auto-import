// 导出接口Options
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
    files?:Array<RegExp>;
    isdefault?: boolean;
}
// 导出配置config
export const configuration: Options = {
    outFile: 'index.ts',
    resolveAliasName: 'src/api',
    apiName: '$apis',
    hotUpdate:true,
    suffix: false,
    constApiData: '$apiDate',
    isdefault: true,
    files: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
    ],
}