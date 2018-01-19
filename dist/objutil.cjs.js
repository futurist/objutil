'use strict';

/*jslint node: true */
var {keys, getPrototypeOf} = Object;
var {toString, hasOwnProperty} = Object.prototype;
var {isArray} = Array;

// better type check
function is(val, type) { return toString.call(val) === '[object ' + type + ']' }
function own(obj, key) { return hasOwnProperty.call(obj, key) }

// https://github.com/sindresorhus/is-plain-obj
function isPOJO (x) {
  var prototype;
  return is(x, 'Object') && (prototype = getPrototypeOf(x), prototype === null || prototype === getPrototypeOf({}))
}

function isIterable(val) {
  return !isPrimitive(val)
}

function isPrimitive(val) {
  return val == null || (typeof val !== 'function' && typeof val !== 'object')
}

function deepIt(a, b, callback, path, _cache) {
  _cache = _cache || [];
  path = path || [];
  if (isPrimitive(b)) return a
  _cache.push(b);
  for (var key in b) {
    if (!own(b, key)) continue
    // return false stop the iteration
    var ret = callback(a, b, key, path);
    if (ret === false) break
    else if (ret === 0) continue
    if (!isPrimitive(b[key]) && !isPrimitive(a[key]) && _cache.indexOf(b[key]) < 0) {
      deepIt(a[key], b[key], callback, path.concat(key), _cache);
    }
  }
  return a
}

function forEach(obj, callback) {
  if (!isPrimitive(obj)) {
    for (var key in obj) {
      if (own(obj, key) 
          && callback(obj[key], key, obj)===false) break
    }
  }
  return obj
}

function map(obj, fn) {
  return keys(obj).map(function(key){
    return fn(obj[key], key, obj)
  })
}

function some(obj, fn) {
  return keys(obj).some(function(key){
    return fn(obj[key], key, obj)
  })
}

function every(obj, fn) {
  return keys(obj).every(function(key){
    return fn(obj[key], key, obj)
  })
}

function getPath(path) {
  if (typeof path === 'string') path = path.split('.');
  return path
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
  path = getPath(path);
  for (var i = 0, len = path.length; i < len; i++) {
    if (isPrimitive(n) || !(path[i] in n)) {
      return errNotFound
        ? new Error('NotFound')
        : [undefined, 1]
    } // [data, errorCode>0]
    n = n[path[i]];
  }
  return errNotFound ? n : [n]
}

// ensure path exists
function ensure(obj, path, defaultValue, descriptor) {
  path = getPath(path);
  var arr = get(obj, path);
  if (arr[1]) {
    set(obj, path, defaultValue, descriptor);
    arr[0] = defaultValue;
  }
  return arr
}

function unset(obj, path) {
  path = getPath(path);
  var len = path.length;
  if (isPrimitive(obj) || !len) return
  var arr = get(obj, path.slice(0, -1));
  if (arr[1] || isPrimitive(arr[0])) return false
  return delete arr[0][path[len - 1]]
}

function set(obj, path, value, descriptor) {
  path = getPath(path);
  if (isPrimitive(obj) || !path.length) return obj
  var p, n = obj;
  for (var i = 0, len = path.length - 1; i < len; i++) {
    p = path[i];
    if (isPrimitive(n[p])) {
      if (p in n) return new Error('cannot set non-object path')
      else n[p] = {};
    }
    n = n[p];
  }
  p = path[i];
  if(!isPrimitive(descriptor)) {
    Object.defineProperty(n, p, {
      value: value,
      configurable: !!got(descriptor, ['c', 'configurable'], false),
      enumerable: !!got(descriptor, ['e', 'enumerable'], false),
      writable: !!got(descriptor, ['w', 'writable'], false),
    });
  } else {
    n[p] = value;
  }
  return obj
}

function got (obj, propArr, defaultValue) {
  if(typeof propArr=='string') propArr=[propArr];
  for(var arr, i=0; i<propArr.length; i++){
    arr = get(obj, propArr[i]);
    if(arr.length===1) return arr[0]
  }
  return defaultValue
}

function visit(obj, fn) {
  return deepIt(obj, obj, function (a, b, key, path) {
    // value, key, collection, path
    return fn({ val: a[key], key: key, path: path, col: a })
  })
}

function invert(obj) {
  var newObj = {};
  deepIt(newObj, obj, function (a, b, key) {
    if (isPrimitive(b[key])) a[b[key]] = key;
  });
  return newObj
}

function _assignHelper(target, arg, cb) {
  if (target == null) { // TypeError if undefined or null
    throw new TypeError('null target')
  }
  var to = Object(target);
  for (var i = 1, len = arg.length; i < len; i++) {
    deepIt(to, arg[i], cb);
  }
  return to
}

function assign(target, arg) { // length==2
  return _assignHelper(target, arguments, function (a, b, key, path) {
    a[key] = b[key];
    return 0
  })
}

function merge(target, arg) { // length==2
  return _assignHelper(target, arguments, function (a, b, key, path) {
    var bval = b[key];
    if (bval !== undefined && isPrimitive(bval)) a[key] = bval;
    else if (!(key in a)) a[key] = isArray(bval) ? [] : isPOJO(bval) ? {} : bval;
  })
}

function defaults(target, arg) { // length==2
  target = target || {};
  return _assignHelper(target, arguments, function (a, b, key, path) {
    if (!(key in a)) a[key] = b[key];
  })
}

function filter(obj, predicate) {
  var ret = [];
  deepIt(obj, obj, function (a, b, key, path) {
    if (predicate({ val: a[key], key: key, path: path, col: a })) ret.push(path.concat(key).join('.'));
  });
  return ret
}

/** Usage: _exlucde(obj, {x:{y:2, z:3} } ) will delete x.y,x.z on obj
 *  when isSet, will set value to a instead of delete
 */
// _exclude( {a:1,b:{d:{ c:2} } }, { b:{d:{ c:1} } } )
function remove(x, y, force) {
  return deepIt(x, y, function (a, b, key) {
    if (isPrimitive(b[key]) && (force || b[key])) delete a[key];
  })
}

function pick(obj, props, force) {
  var o = {};
  if(isArray(props)){
    forEach(props, function(key) {
      if(key in obj) o[key] = obj[key];
    });
    return o
  }
  return deepIt(o, props, function (a, b, key, path) {
    var d, c = get(obj, path.concat(key));
    // c[1] > 0: not found from obj
    if (!(force || b[key]) || c[1]) return
    d = c[0];  // c[0] is the data
    if (!isPrimitive(d)) a[key] = isArray(d) ? [] : isPOJO(d) ? {} : d;
    if (isPrimitive(b[key])) a[key] = d;
  })
}

function isEqual(x, y, isStrict, validFn) {
  var equal = true;
  var compare = function (a, b, key, path) {
    if(typeof validFn==='function' && !validFn(a,b,key,path)) return
    var isPrimitiveA = isPrimitive(a[key]);
    var isPrimitiveB = isPrimitive(b[key]);
    if (isPrimitiveA || isPrimitiveB) {
      if(isStrict 
        ? b[key] !== a[key] 
        : isPrimitiveA!==isPrimitiveB || b[key] != a[key]) return (equal = false)
    } else if(keys(a[key]).length !== keys(b[key]).length) {
      return (equal = false)
    }
  };
  deepIt([x], [y], compare);
  return equal
}

exports.is = is;
exports.own = own;
exports.isPOJO = isPOJO;
exports.isIterable = isIterable;
exports.isPrimitive = isPrimitive;
exports.deepIt = deepIt;
exports.forEach = forEach;
exports.map = map;
exports.some = some;
exports.every = every;
exports.get = get;
exports.got = got;
exports.set = set;
exports.unset = unset;
exports.ensure = ensure;
exports.invert = invert;
exports.assign = assign;
exports.extend = assign;
exports.merge = merge;
exports.remove = remove;
exports.pick = pick;
exports.defaults = defaults;
exports.isEqual = isEqual;
exports.visit = visit;
exports.filter = filter;
