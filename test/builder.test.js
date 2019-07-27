const expect = require('chai').expect
const Builder = require('../src/builder')
const path = require('path')

const sourceDir = path.resolve(__dirname, '..', 'definition')

describe('builder', () => {

  it('can get all references', async () => {
    const builder = Builder(path.resolve(sourceDir, 'openapi.yml'), '')
    const files = await builder.getRefPaths()
    expect(files[0]).to.equal(path.resolve(sourceDir, 'locations.yml'))
  })

})
