#!/usr/bin/env node
const Builder = require('./builder')
const fs = require('fs')
const path = require('path')
const Server = require('./server')

const [ command, ...args ] = Array.from(process.argv).slice(2)

if (command === 'serve') {
  const [ source, port ] = args
  Server({ source, port: +port || 0 })
} else if (command === 'build') {
  const [ source ] = args
  const builder = Builder(source)
  builder.build()
    .then(obj => {
      fs.writeFile(path.resolve(__dirname, '..', 'docs', 'openapi.json'), JSON.stringify(obj, null, 2), function (err) {
        if (err) {
          console.error(err.stack)
        } else {
          console.log('Built')
        }
      })
    })
} else {
  console.error('Unknown command: ' + command)
}
