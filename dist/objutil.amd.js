define('objutil', ['exports'], function (exports) { 'use strict';

// better type check
var is = function (t, v) { return {}.toString.call(v) === '[object ' + t + ']' };
var own = function (o, k) { return {}.hasOwnProperty.call(o, k) };

function isIterable (v) {
  return is('Object', v) || is('Array', v) || is('Map', v)
}

function isPrimitive (val) {
  return !/obj|func/.test(typeof val) || !val
}

function deepIt (a, b, callback, path) {
  path = path || [];
  if (isPrimitive(b)) return a
  for ( var key in b) {
    if (!own(b, key)) continue
    // return false stop the iteration
    if (callback(a, b, key, path) === false) break
    if (isIterable(b[key]) && isIterable(a[key])) {
      deepIt(a[key], b[key], callback, path.concat(key));
    }
  }
  return a
}

/**
 * Get data from obj, using path
 * @param {} obj
 * @param {} path
 * @param {} errNotFound
 * @returns {}
 */
function get(obj, path, errNotFound) {
  var n = obj;
  for(var i = 0, len = path.length; i < len; i++) {
    if(!isIterable(n) || !(path[i] in n))
      return errNotFound ? new Error('NotFound') : [undefined, 1] // [data, errorCode>0]
    n = n[path[i]];
  }
  return [n]
}

function invert (obj) {
  var newObj={};
  deepIt(newObj, obj, function(a,b,key) {
    if(isPrimitive(b[key])) a[b[key]] = key;
  });
  return newObj
}

function assign () {
  var arg = arguments, last;
  for(var i=arg.length; i--;) {
    last = deepIt(arg[i], last, function (a, b, key, path) {
      a[key] = b[key];
    });
  }
  return last
}

function merge () {
  var arg = arguments, last;
  for(var i=arg.length; i--;) {
    last = deepIt(arg[i], last, function (a, b, key, path) {
      if(!(key in a) || isPrimitive(b[key])) a[key] = b[key];
    });
  }
  return last
}

/** Usage: _exlucde(obj, {x:{y:2, z:3} } ) will delete x.y,x.z on obj
 *  when isSet, will set value to a instead of delete
 */
// _exclude( {a:1,b:{d:{ c:2} } }, { b:{d:{ c:1} } } )
function exclude (x, y, isSet) {
  return deepIt(x, y, function (a, b, key) {
    if (isPrimitive(b[key])) {
      isSet
        ? (key in a ? a[key] = b[key] : '')
      : b[key] && delete a[key];
    }
  })
}

function isEqual (x, y, isStrict) {
  var equal = true;
  // if b===null, then don't iterate, so here compare first
  if (isPrimitive(x) || isPrimitive(y)) return isStrict ? x===y : x==y
  deepIt(x, y, function (a, b, key) {
    if ((isPrimitive(a[key]) || isPrimitive(b[key])) && (isStrict ? b[key] !== a[key] : b[key] != a[key] ))
      return (equal = false)
  });
  return equal
}

function pick(obj, props) {
  var o={};
  return deepIt(o, props, function(a,b,key,path){
    var c = get(obj,path.concat(key));
    // c[1] > 0: not found from obj
    if(!b[key] || c[1]) return
    if(!isPrimitive(c[0])) a[key] = is('Array', c[0]) ? [] : {};
    if(isPrimitive(b[key])) a[key] = c[0];
  })
}

function defaults(obj, option) {
  obj = obj || {};
  return deepIt(obj, option, function(a,b,key){
    if(!(key in a)) a[key]=b[key];
  })
}

exports.is = is;
exports.own = own;
exports.isIterable = isIterable;
exports.isPrimitive = isPrimitive;
exports.deepIt = deepIt;
exports.get = get;
exports.invert = invert;
exports.assign = assign;
exports.extend = assign;
exports.merge = merge;
exports.exclude = exclude;
exports.pick = pick;
exports.defaults = defaults;
exports.isEqual = isEqual;

});
