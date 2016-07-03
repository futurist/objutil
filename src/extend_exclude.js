
// better type check
var is = function (t, v) { return {}.toString.call(v).slice(8, -1) === t }
var own = function (o, k) { return {}.hasOwnProperty.call(o, k) }

function isIterable (v) {
  return is('Object', v) || is('Array', v) || is('Map', v)
}

function isPrimitive (val) {
  return !/obj|func/.test(typeof val) || !val
}

function _deepIt (a, b, callback, path) {
  path = path || []
  if (isPrimitive(b)) return a
  for ( var key in b) {
    if (!own(b, key)) continue
    callback(a, b, key, path, key in a)
    if (isIterable(b[key]) && isIterable(a[key])) {
      _deepIt(a[key], b[key], callback, path.concat(key))
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
    last = _deepIt(arg[i], last, function (a, b, key, path, inA) {
      if(!inA || isPrimitive(b[key])) a[key] = b[key]
    })
  }
  return last
}

/** Usage: _exlucde(obj, {x:{y:2, z:3} } ) will delete x.y,x.z on obj
 *  when isSet, will set value to a instead of delete
 */
// _exclude( {a:1,b:{d:{ c:2} } }, { b:{d:{ c:1} } } )
function _exclude (x, y, isSet) {
  return _deepIt(x, y, function (a, b, key) {
    if (isPrimitive(b[key])) {
      isSet
        ? (key in a ? a[key] = b[key] : '')
      : (b[key] ? delete a[key] : '')
    }
  })
}

function _pick(obj, props) {
  var o={}
  return _deepIt(o, props, function(a,b,key,path){
    var c = _get(obj,path.concat(key))
    if(!b[key]) return
    if(!isPrimitive(c)) a[key] = is('Array', c) ? [] : {}
    if(isPrimitive(b[key])) a[key] = c
  })
}

function _pick2(obj, props) {
  props=props||{}
  var o={}
  return _deepIt(o, obj, function(a,b,key,path){
    var c = _get(props,path.concat(key))
    if(c && isPrimitive(c)) return
    if(!isPrimitive(b[key])) a[key] = is('Array', b[key]) ? [] : {}
    else a[key]= b[key]
  })
}

function _default(obj, option) {
  return _deepIt(obj, option, function(a,b,key){
    if(!(key in a)) a[key]=b[key]
  })
}

export default {
  _is: is,
  _own: own,
  _isIter: isIterable,
  _isPrim: isPrimitive,
  _get: _get,
  _deepIt: _deepIt,
  _extend: _extend,
  _pick: _pick,
  _pick2: _pick2,
  _default: _default,
  _exclude: _exclude
}
