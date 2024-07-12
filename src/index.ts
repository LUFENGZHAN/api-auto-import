import path from 'path'
import fs from 'fs'
import { Options, configuration } from './type'
import { Plugin } from 'vite'
import lodash from 'lodash'
function isMatchingFormat(str, files) {
	for (let i = 0; i < files.length; i++) {
		if (Object.prototype.toString.call(files[i]) !== '[object RegExp]') {
			return false
		}
		if (files[i].test(str)) {
			return true
		}
	}
	return false
}
function replacedStr(str) {
	return str.replace(/-(\w)/gim, function (match, p1) {
		return p1.toUpperCase()
	})
}
function getAllFilePaths(directoryPath: string, dirPathNname: string, config: Options) {
	let allFilePaths = []
	const { suffix, resolveAliasName, files } = config
	function List(outpath: string, dirPathNname: string) {
		const fileList = fs.readdirSync(outpath)
		fileList.forEach(file => {
			const newPath = path.join(outpath, file)
			const stats = fs.statSync(newPath)
			if (stats.isDirectory()) {
				const is_file = fs.readdirSync(newPath)
				if (is_file.length !== 0) {
					List(newPath, dirPathNname)
				}
				return
			}
			const is_same = newPath.replace(/\.[tj]s/g, '')
			if (is_same !== dirPathNname && isMatchingFormat(newPath, files)) {
				const pathStr = (suffix ? newPath : is_same).replace(directoryPath, resolveAliasName).replace(/\\+/g, '/')
				allFilePaths.push(pathStr)
			}
		})
	}
	List(directoryPath, dirPathNname)
	return allFilePaths
}

function template(allFilePaths, config: Options) {
	const allFilePathsStr = config.resolveAliasName.split('/').filter(e => !!e)
	const allPaths = allFilePaths.map((pathName: string) => {
		let pathStr = pathName.replace(/\\+/g, '/')
		if (allFilePathsStr[0] !== '@' && allFilePathsStr[0] === 'src') {
			pathStr = pathStr.replace(config.resolveAliasName, '@/' + allFilePathsStr.slice(1).join('/'))
		}
		return {
			importName: replacedStr(pathStr)
				.replace(/@\//, '')
				.replace(allFilePathsStr[1], '')
				.replace(/^(\/)/, '')
				.replace(/(\\+|\/+)/gim, '_')
				.replace(/\./gim, '_')
				.replace(/.[jt]s/, ''),
			pathStr: replacedStr(pathStr)
				.replace(/@\//, '')
				.replace(allFilePathsStr[1], '')
				.replace(/\./gim, '_')
				.replace(/(\\+|\/+)/gim, '/')
				.replace(/.[jt]s/, ''),
			import: pathStr.replace(/(\\+|\/+)/gim, '/').replace(/^(\/)/, ''),
		}
	})
	const apiImport = allPaths.reduce((previousValue: string, currentValue: any) => {
		return (
			previousValue +
			(config.is_ts
				? `// @ts-ignore\nimport ${currentValue.importName} from '${currentValue.import}'\n`
				: `import ${currentValue.importName} from '${currentValue.import}'\n`)
		)
	}, '')
	const constApiImport = allPaths.reduce((previousValue: string, currentValue: any) => {
		return (
			previousValue +
			(config.is_ts
				? `// @ts-ignore\nexport const import_${currentValue.importName} = ${currentValue.importName}\n`
				: `export const import_${currentValue.importName} = ${currentValue.importName}\n`)
		)
	}, '')
	const transformedData = {}
	allPaths.forEach((e, i, array) => {
        const arr = array.filter(v=>  v.importName.includes(e.importName)).map(e=>e.importName).filter(v=>e.importName.split('_')[0] === arr[arr.length -1].split('_')[0])
        if(arr.length>1 && e.importName === arr[arr.length -1] ){
            console.log(e.importName,arr[arr.length -1],arr);
            e.importName =e.importName + ':updateName'
        }
    })
	allPaths.forEach(item => {
		const parts = item.pathStr.split('/').filter(part => part !== '')
		let currentLevel = transformedData
		for (let i = 0; i < parts.length; i++) {
			const part = parts[i]
			const nextLevel = i === parts.length - 1
			if (nextLevel && !currentLevel[part]) {
				currentLevel[part] = item.importName
			} else {
				currentLevel[part] = currentLevel[part] || {}
				currentLevel = currentLevel[part]
			}
			if (nextLevel) {
				currentLevel[part] = item.importName
			}
		}
	})
	let newtransformedData = JSON.stringify(transformedData, null, 4).replace(/"|'/gim, '')
	const apiDate = newtransformedData.replace(/:updateName/g, '1')
    console.log(apiDate);
	Object.assign(config, { apiImport, constApiImport, apiDate })
	return lodash.template(fs.readFileSync(path.resolve(__dirname, '../src/template.ts')), 'utf-8')(config)
}
function apiAutoImport(config: Options, outpath: string, dirPathNname: string) {
	if (!fs.existsSync(outpath)) return console.warn('\x1b[33m%s\x1b[0m', `'${outpath}' not exist`)
	const { outFile, is_ts } = config
	const allFilePaths = getAllFilePaths(outpath, dirPathNname, config)
	const templateString = template(allFilePaths, config)
	const outFileStr = outFile.match(/(\.[jt]s|\.[tj]sx)$/) ? outFile : `${outFile}.ts`
	fs.writeFileSync(path.resolve(outpath, is_ts ? outFileStr : outFileStr.replace(/ts/, 'js')), templateString)
}
function getConfig(options: Options) {
	const config = Object.assign({}, configuration, options)
	const resolveName = config.resolveAliasName.replace(/@/g, 'src')
	const outFileName = config.outFile.replace(/\.[tj]s$/, '')
	const reg = new RegExp(resolveName.replace(/(\/)/gim, '\\\\'), 'ig')
	const currentDir = process.cwd()
	const dirPath = path.join(currentDir, resolveName)
	const dirPathNname = path.join(currentDir, resolveName, outFileName)
	return {
		config,
		resolveName,
		outFileName,
		reg,
		dirPath,
		dirPathNname,
	}
}
export function apiAutoVite(options: Options): Plugin {
	const config = getConfig(options)
	apiAutoImport(config.config, config.dirPath, config.dirPathNname)
	return {
		name: 'api-auto-import',
		configureServer(server) {
			server.watcher.on('all', (type, path) => {
				if (path.match(config.reg) && config.config.hotUpdate) {
					apiAutoImport(config.config, config.dirPath, config.dirPathNname)
				}
			})
			server.watcher.add(config.dirPath)
		},
	}
}
export class apiAutoWebpack {
	private config
	constructor(options: Options) {
		this.config = getConfig(options)
	}
	apply(compiler) {
		const { config } = this
		const regexPattern = new RegExp(this.escapeRegExp(config.dirPathNname))
		compiler.hooks.afterEnvironment.tap('api-auto-import', () => {
			compiler.options.watchOptions.ignored = regexPattern
		})
		if (config.config.hotUpdate) {
			compiler.hooks.emit.tap('api-auto-import', compilation => {
				apiAutoImport(config.config, config.dirPath, config.dirPathNname)
			})
		} else {
			apiAutoImport(config.config, config.dirPath, config.dirPathNname)
		}
	}
	escapeRegExp(string) {
		return string.replace(/\\+/gim, '/')
	}
}
