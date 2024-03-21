export interface Options {
    [key: string]: any;
    name?:string;
    outFile:string;
    resolveName:string;
    resolveAliasName?:string;
    constApiData?:string
}
export const config:Partial<Options>={
    outFile:'index.ts',
    resolveAliasName:'@/api/apis',
    resolveName:'/src/api',
    name:'$apis',
    constApiData:'$apiDate',
    include:[
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/, /\.vue\?vue/, // .vue
        /\.md$/, // .md
    ],
}