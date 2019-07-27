const path = require('path')
const server = require('./server')

server({
  source: path.resolve(__dirname, '..', 'definition', 'openapi.yml'),
  port: 3000
})
