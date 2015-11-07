
module.exports = function (func, limit) {
  return function (args) {
    if (+limit === limit) args.push(args.splice(limit, args.length-limit))
    return func.apply(this, args)
  }
}
