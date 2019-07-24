const chokidar = require('chokidar')
const Enforcer = require('openapi-enforcer')
const fs = require('fs-extra')
const path = require('path')
const yaml = require('js-yaml')

const defFilePath = path.resolve(__dirname, '..', 'definition')
const outPath = path.resolve(__dirname, '..', 'openapi.json')
let debounceTimeoutId


exports.build = async function () {
  console.log('Building...')

  const data = await build(defFilePath, {})
  await Enforcer(data)

  const json = JSON.stringify(data, null, 2)
  await fs.writeFile(outPath, json)

  console.log('Built')
}

exports.watch = async function () {
  console.log('Started watch mode. Use Ctrl+C to exit')

  chokidar.watch(defFilePath)
    .on('add', () => debounceBuild())
    .on('change', () => debounceBuild())
    .on('unlink', () => debounceBuild())
}

async function build (directoryPath, result) {
  const fileNames = await fs.readdir(directoryPath)

  const promises = fileNames.map(async fileName => {
    const fullPath = path.resolve(directoryPath, fileName)
    const stats = await fs.stat(fullPath)
    if (stats.isFile()) {
      const content = await fs.readFile(fullPath, 'utf8')
      const o = yaml.safeLoad(content)
      populate(fullPath, '#', result, o)
    } else if (stats.isDirectory()) {
      await build(fullPath, result)
    }
  })

  await Promise.all(promises)

  return result
}

function debounceBuild () {
  clearTimeout(debounceTimeoutId)
  return new Promise(resolve => {
    debounceTimeoutId = setTimeout(() => {
      exports.build().catch(console.error)
    }, 300)
  })
}

function populate (sourceFile, sourcePath, target, source) {
  Object.keys(source)
    .forEach(key => {
      if (!target.hasOwnProperty(key)) {
        target[key] = source[key]
      } else {
        const tVal = target[key]
        const sVal = source[key]
        if (!tVal || !sVal || typeof tVal !== 'object' || typeof sVal !== 'object' || Array.isArray(tVal) !== Array.isArray(sVal)) {
          throw Error('Conflict at ' + sourceFile + sourcePath + ': Type mismatch')
        } else if (Array.isArray(tVal)) {
          tVal.push(...sVal)
        } else {
          populate(sourceFile, sourcePath + '/' + key, tVal, sVal)
        }
      }
    })
}

if (!module.parent) {
  const action = process.argv[2] || 'build'
  exports[action]().catch(console.error)
}