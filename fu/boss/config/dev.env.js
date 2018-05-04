'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://10.0.3.31:8080"',
  BASE_API2: '"http://wsifq5.natappfree.cc/"'
})
