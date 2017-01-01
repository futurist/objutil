# objutil

Javascript Object util methods, with ES6 tree shaking methods: assign(extend), merge, exclude, default, pick. Customize the APIs into one file.

[![Build Status](https://travis-ci.org/futurist/objutil.svg?branch=master)](https://travis-ci.org/futurist/objutil)
<a href='https://coveralls.io/github/futurist/objutil?branch=master'><img src='https://coveralls.io/repos/github/futurist/objutil/badge.svg?branch=master' alt='Coverage Status' /></a>
[![npm](https://img.shields.io/npm/v/objutil.svg "Version")](https://www.npmjs.com/package/objutil)


## Why?

Simple, it's small, and support [tree shaking](http://javascriptplayground.com/blog/2016/02/better-bundles-rollup/) to select only the methods you want

Think [lodash](https://github.com/lodash/lodash/), `_.assign` and `_.defaults`, the total size is 31KB, this lib is **0.7KB!**

## How?

First, you need install [rollup](https://github.com/rollup/rollup).

And select the API by below command line:

``` javascript
rollup -c --api assign,defaults
```

Or add below line in **your npm scripts** of `package.json`:

``` javascript
scripts: {
  ...
  "objutil": "rollup -c ./node_modules/objutil/rollup.config.js --api assign,pick"
}
```

This will tree shaking the lib, leave only `objutil.assign, objutil.defaults` methods

## Install

- NPM

``` shell
npm install objutil
```

## Quick Start:

Think below initial vars:

``` javascript
var a = {
  x:1,
  y:{
    w:1,
    z:2
  }
}

var b= {
  y:{
    z:10,
    u:'name'
  }
}
```

Use with objutil:

```javascript
var merge = require('objutil').merge
var exclude = require('objutil').exclude
merge(a,b)
exclude(a,b)
```

## API

### get( obj, pathArray, isThrow )

> **Get object value from pathArray. When not found, throw error if isThrow is true, else return undefined**

*get( a, ['y', 'z'] )*

```javascript
//result is
2

//throw error when not found
get(a, ['x', 'y'], true)
```

### assign( obj, ...args )

> **Deeply assign args properties into obj, from right to left order.**

*assign( a, b, {w:3} )*
```javascript
//result=>
{
  x:1,
  y:{
    z:10,
    u:'name'
  },
  w:3
}
```

### merge( obj, ...args )

> **Deeply merge args properties into obj, from right to left order.**

*merge( a, b, {y:{v:3}} )*
```javascript
//result=>
{
  x:1,
  y:{
    v:3,
    w:1,
    z:10,
    u:'name'
  }
}
```

### exclude( obj, excludeObj, [newValue] )

> **Deeply delete excludeObj(if key has a truthy value) from obj, optionally set to newValue if present**

*exclude( a, { y:{z:true} } )*

```javascript
//result=>
{
  x:1,
  y:{
    w:1
  }
}
```
*exclude( a, { y:{z:true} } , null)*
```javascript
//result=>
{
  x:1,
  y:{
    w:1,
    z:null
  }
}
```

### pick( obj, pickObject)

> **Like exclude, but return the reversed result. Deeply keep from pickObject (if key has a truthy value) from obj**

*pick( a, {x:true, y:{z:true} } )*

```javascript
//result=>
{
  x:1,
  y:{
    z:2
  }
}
```


### defaults( obj, defaultObj )

> **deeply merge defaultObj key/val into obj, only when it's not existing in obj**

*defaults( {a:1}, {a:2, b:5 } )*

```javascript
//result=>
{
  a:1,
  b:5
}
```

### deepEqual( objA, objB )

> **deeply compare objA and objB for equality**

*deepEqual( {a:1, b:2}, {a:1, b:2 } )*

```javascript
//result=> true
```


### deepIt( a, b, callback )

> **Iterate b with deeply sync props of a, and callback(objA, objB, key)**

```javascript
deepIt( a, b, function(objA,objB,key){
    objA[key] = objB[key]
} )
// ---> same result of assign(a,b)
```

### MIT
