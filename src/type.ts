export interface Options {
    [key: string]: any;
    name?:string;
    outFile:string;
    resolveAliasName:string;
    constApiData?:string;
    outdir?:string;
}
export const config:Options={
    outFile:'index.ts',
    resolveAliasName:'/src/api',
    apiName:'$apis',
    constApiData:'$apiDate',
    include:[
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/, /\.vue\?vue/, // .vue
        /\.md$/, // .md
    ],
}