const Big = require('big.js')

interface Number {
  big(): any
}

Number.prototype.big = function() {
  return new Big(this)
}
