const chokidar = require('chokidar')
const Enforcer = require('openapi-enforcer')
const RefParser = require('json-schema-ref-parser')

module.exports = Builder

function Builder (source) {
  const factory = {}
  const rxRemotePath = /^https?:\/\//
  const watchedFiles = {}
  let cache
  let debounceTimeoutId
  let watcher

  factory.build = async function () {
    console.log('\n--- BUILDING ' + (new Date()).toLocaleString() + ' ---\n')
    const openapiDoc = await RefParser.bundle(source)
    const [ , err, warn ] = await Enforcer(openapiDoc, {
      fullResult: true,
      componentOptions: {
        // requestBodyAllowedMethods: { delete: true }
      }
    })
    if (err) {
      console.log(err.toString())
      console.log('\nBuild failed\n')
      throw err
    } else {
      if (warn) console.log(warn.toString())
      cache = openapiDoc
      console.log('\nBuilt successfully\n')
      return cache
    }
  }

  factory.getLocalRefPaths = async function () {
    const paths = await factory.getRefPaths()
    return paths.filter(path => !rxRemotePath.test(path))
  }

  factory.getRefPaths = async function () {
    const parser = new RefParser()
    await parser.dereference(source, source)
    return parser.$refs.paths()
  }

  factory.unwatch = function () {
    if (watcher) {
      Object.keys(watchedFiles)
        .forEach(filePath => {
          watchedFiles[filePath] = false
          watcher.unwatch(filePath)
        })
      watcher.close()
      watcher = undefined
    }
  }

  factory.watch = async function () {
    let skipNext = false

    if (!watcher) watcher = chokidar.watch([])

    updateWatchedPaths()

    watcher.on('all', (event, filePath) => {
      switch (event) {
        case 'add':
        case 'change':
        case 'unlink':
          cached = false
          debounce(async () => {
            if (!skipNext) {
              skipNext = await updateWatchedPaths()
              await factory.build()
            }
          }, 300)
      }
    })
  }

  Object.defineProperty(factory, 'openapiDoc', {
    get () {
      return cache
    }
  })

  return factory

  function debounce(callback, delay) {
    clearTimeout(debounceTimeoutId)
    debounceTimeoutId = setTimeout(callback, delay)
  }

  async function updateWatchedPaths() {
    const filesToWatch = await factory.getLocalRefPaths()
    let additions = false

    // remove files that should no longer be watched
    Object.keys(watchedFiles)
      .filter(filePath => !filesToWatch.includes(filePath))
      .forEach(filePath => {
        watchedFiles[filePath] = false
        watcher.unwatch(filePath)
        console.log('Stopped watching ' + filePath)
      })

    // add new files that should be watched
    filesToWatch.forEach(filePath => {
      if (!watchedFiles[filePath]) {
        watchedFiles[filePath] = true
        watcher.add(filePath)
        console.log('Started watching ' + filePath)
        additions = true
      }
    })

    return additions
  }
}

async function getRefPaths (source) {
  const parser = new RefParser();
  await parser.dereference(source);
  return parser.$refs.paths();
}
