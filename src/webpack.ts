class apiAutoImport {
    public options
    constructor(config:Object) {
      this.options = config;
    }
    apply(compiler) {
      compiler.hooks.emit.tap('api-auto-import', compilation => {
        // 在 emit 阶段执行操作
        console.log('Webpack 打包即将完成...');
        
        // 可以在这里访问 compilation.assets 对象，获取打包生成的资源
        
        console.log('Webpack 打包已完成！');
      });
    }
  }
  
  module.exports = apiAutoImport;