
var type = {}.toString
var own = {}.hasOwnProperty
var OBJECT = type.call({})

function _deepIt (a, b, callback, create, path) {
  path = path || []
  if (a == null || b == null) {
    return a
  }
  for ( var key in b) {
    if (!own.call(b, key)) continue
    if (type.call(b[key]) == OBJECT) {
      if(create && !(key in a)) {
        a[key] = {}
        callback(a,b,key,path)
      }
      if (type.call(a[key]) != OBJECT) {
        callback(a, b, key, path)
      } else {
        a[key] = _deepIt(a[key], b[key], callback, create, path.concat(key))
      }
    } else {
      callback(a, b, key, path)
    }
  }
  return a
}

function _extend () {
  var arg = arguments, last
  for(var i=arg.length; i--;) {
    last = _deepIt(arg[i], last, function (a, b, key) {
      a[key] = b[key]
    })
  }
  return last
}

/*Usage: _exlucde(obj, {x:{y:1, z:1} }, [null] ) will delete x.y,x.z on obj, or set to newVal if present */
// _exclude( {a:1,b:{d:{ c:2} } }, { b:{d:{ c:1} } } )
function _exclude (x, y, newVal) {
  var isNew = arguments.length == 3
  return _deepIt(x, y, function (a, b, key) {
    if (typeof b[key] !== 'object' && b[key]) {
      isNew ? a[key] = newVal : delete a[key]
    } else {
      a[key] = b[key]
    }
  })
}

function _pick(obj, props) {
  var o={}
  return _deepIt(o, props, function(a,b,key){
    a[key]= type.call(b[key])==OBJECT ? {} : obj[key]
  }, true)
}

function _default(obj, option) {
  return _deepIt(obj, option, function(a,b,key){
    if(!(key in a)) a[key]=b[key]
  })
}

export default {
  _deepIt: _deepIt,
  _extend: _extend,
  _pick: _pick,
  _default: _default,
  _exclude: _exclude
}
