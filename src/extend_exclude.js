var type = {}.toString
var own = {}.hasOwnProperty
var OBJECT = type.call({})
var ARRAY = type.call([])

function isIterable(v) {
  return [OBJECT, ARRAY].indexOf(type.call(v))>-1
}

function isPrimitive (val) {
  return !/obj|func/.test(typeof val) || !val
}

function _deepIt (a, b, callback, path) {
  path = path || []
  if (isPrimitive(b)) return a
  for ( var key in b) {
    if (!own.call(b, key)) continue
    if (isIterable(b[key])) {
      if (!(key in a) || !isIterable(a[key])) {
        callback(a, b, key, path, key in a)
      }
      if (isIterable(a[key])) {
        _deepIt(a[key], b[key], callback, path.concat(key))
      }
    } else {
      callback(a, b, key, path)
    }
  }
  return a
}

function _get(obj, p, errNotFound) {
  var n = obj
  for(var i = 0, len = p.length; i < len; i++) {
    if(!isIterable(n) || !(p[i] in n))
      return errNotFound ? new Error('NotFound') : undefined
    n = n[p[i]]
  }
  return n
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
    if (b[key] && isPrimitive(b[key])) {
      isNew ? a[key] = newVal : delete a[key]
    } else {
      a[key] = b[key]
    }
  })
}

function _pick(obj, props) {
  var o={}
  return _deepIt(o, props, function(a,b,key,path,notInA){
    var c = _get(obj,path.concat(key))
    if(!b[key]) return
    if(!isPrimitive(c)) a[key] = type.call(c)==ARRAY ? [] : {}
    if(isPrimitive(b[key])) a[key] = c
  })
}

function _pick2(obj, props) {
  props=props||{}
  var o={}
  return _deepIt(o, obj, function(a,b,key,path,notInA){
    var c = _get(props,path.concat(key))
    if(c && isPrimitive(c)) return
    if(!isPrimitive(b[key])) a[key] = type.call(b[key])==ARRAY ? [] : {}
    else a[key]= b[key]
  })
}

function _default(obj, option) {
  return _deepIt(obj, option, function(a,b,key){
    if(!(key in a)) a[key]=b[key]
  })
}

export default {
  _deepIt: _deepIt,
  _get: _get,
  _extend: _extend,
  _pick: _pick,
  _pick2: _pick2,
  _default: _default,
  _exclude: _exclude
}
