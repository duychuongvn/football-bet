const Big = require('big.js')

interface Number {
  big(): any,
  toFloatString(count: number): any
}

Number.prototype.big = function() {
  return new Big(this)
};

Number.prototype.toFloatString = function (count: number) {
  return Number.parseFloat(`${this}`).toFixed(count)
}
