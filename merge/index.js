const fs = require('fs')
const turf = require('@turf/turf')

const input = require('./input/singapore-residential.geo.json')
const output = turf.flatten(
  input.features
    .map((feature, index) => Object.assign(feature, { properties: { index } }))
    .reduce((a, b) => {
      console.log(b.properties.index)
      a.properties = {}
      b.properties = {}
      return turf.union(a, b)
    }, input.features[0])
)

if (!fs.existsSync('./output')) fs.mkdirSync('./output')
fs.writeFileSync('./output/singapore-residential.geo.json', JSON.stringify(output))
