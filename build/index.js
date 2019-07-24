const Enforcer = require('openapi-enforcer')
const fs = require('fs-extra')
const path = require('path')
const yaml = require('js-yaml')

const defFilePath = path.resolve(__dirname, '..', 'definition')
const outPath = path.resolve(__dirname, '..', 'openapi.json')

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

module.exports = async function () {
  const data = await build(defFilePath, {})
  await Enforcer(data)

  const json = JSON.stringify(data, null, 2)
  await fs.writeFile(outPath, json)

  console.log('Built')
}

module.exports()
  .catch(console.error)