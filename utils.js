'use strict'

require('colors')

exports.terminate = (message, code) => {
  console.log((message || '').red)
  process.exit(code)
}
