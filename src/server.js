const Builder = require('../src/builder')
const ejs = require('ejs')
const express = require('express')
const path = require('path')

const wwwDir = path.resolve(__dirname, '..', 'www')

module.exports = async function ({ source, port = 3000 }) {
  const builder = Builder(source)

  // render index.html file
  const indexHtml = await new Promise((resolve, reject) => {
    ejs.renderFile(path.resolve(__dirname, '..', 'www', 'index.html'), { port }, (err, content) => {
      if (err) return reject(err)
      resolve(content)
    });
  })

  const app = express()

  app.use((req, res, next) => {
    console.log(req.method.toUpperCase() + ' ' + req.originalUrl)
    next()
  })

  app.get('/', (req, res) => {
    res.set('content-type', 'text/html')
    res.send(indexHtml)
  })

  app.get('/openapi.json', async (req, res) => {
    const obj = await builder.build()
    res.json(obj)
  })

  app.use(express.static(wwwDir))

  app.use((req, res, next) => {
    res.redirect('/')
  })

  const listener = app.listen(port, function (err) {
    if (err) {
      console.error(err.stack)
    } else {
      console.log('Server listening on port ' + listener.address().port)
    }
  })
}

