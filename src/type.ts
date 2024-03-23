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
    // 导入是否携带后缀名
    suffix?: boolean;
    files?:Array<RegExp>
}
// 导出配置config
export const configuration: Options = {
    outFile: 'index.ts',
    resolveAliasName: 'src/api',
    apiName: '$apis',
    suffix: false,
    constApiData: '$apiDate',
    files: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
    ],
}