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
    callback(a, b, key, path, key in a);
    if (isIterable(b[key]) && isIterable(a[key])) {
      deepIt(a[key], b[key], callback, path.concat(key));
    }
  }
  return a
}

function get(obj, p, errNotFound) {
  var n = obj;
  for(var i = 0, len = p.length; i < len; i++) {
    if(!isIterable(n) || !(p[i] in n))
      return errNotFound ? new Error('NotFound') : undefined
    n = n[p[i]];
  }
  return n
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
    last = deepIt(arg[i], last, function (a, b, key, path, inA) {
      if(!inA || isPrimitive(b[key])) a[key] = b[key];
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

function pick(obj, props) {
  var o={};
  return deepIt(o, props, function(a,b,key,path){
    var c = get(obj,path.concat(key));
    if(!b[key]) return
    if(!isPrimitive(c)) a[key] = is('Array', c) ? [] : {};
    if(isPrimitive(b[key])) a[key] = c;
  })
}

function defaults(obj, option) {
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

});
