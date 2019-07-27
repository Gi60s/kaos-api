const chokidar = require('chokidar')
const RefParser = require('json-schema-ref-parser')

module.exports = Builder

function Builder (source) {
  const factory = {}
  const rxRemotePath = /^https?:\/\//
  const watchedFiles = {}
  let watcher

  factory.build = function () {
    return RefParser.bundle(source);
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
    }
  }

  factory.watch = async function () {
    if (!watcher) watcher = chokidar.watch([])

    const filesToWatch = await factory.getLocalRefPaths()

    // remove files that should no longer be watched
    Object.keys(watchedFiles)
      .filter(filePath => !filesToWatch.includes(filePath))
      .forEach(filePath => {
        watchedFiles[filePath] = false
        watcher.unwatch(filePath)
      })

    // add new files that should be watched
    filesToWatch.forEach(filePath => {
      if (!watchedFiles[filePath]) {
        watchedFiles[filePath] = true
        watcher.watch(filePath)
      }
    })
  }

  return factory
}

async function getRefPaths (source) {
  const parser = new RefParser();
  await parser.dereference(source);
  return parser.$refs.paths();
}
