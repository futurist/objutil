# objutil

Javascript Object util methods, with ES6 tree shaking methods: assign(extend), merge, exclude, default, pick. Customize the APIs into one file.

[![Build Status](https://travis-ci.org/futurist/objutil.svg?branch=master)](https://travis-ci.org/futurist/objutil) <a href='https://coveralls.io/github/futurist/objutil?branch=master'><img src='https://coveralls.io/repos/github/futurist/objutil/badge.svg?branch=master' alt='Coverage Status' /></a>


## Why?

Why? There's so many, [lodash](https://github.com/lodash/lodash/), [underscore](https://github.com/jashkenas/underscore), etc.

Assume you are using lodash, it's painful when you only want `_.assign`, after `npm i lodash.assign`, the package `4.2.0` has **16KB**, uglified as **4.5KB**, really big for just a `Object.assign` polyfill.

When you want 2 methods, like `_.assign` and `_.defaults`, the total size is **31KB**, even there's **so many code in common, it's not optimized at all!**


## Solution

Using [ES6 tree shaking](http://javascriptplayground.com/blog/2016/02/better-bundles-rollup/) with [rollup](https://github.com/rollup/rollup), it's possible to keep the code you need only, and keep optimized in size and execution.

With `objutil`, you can solve this problem as below:

``` javascript
rollup -c --api assign,defaults
```

This will tree shaking from source, and leave only `objutil.assign, objutil.defaults` methods with **one file**.

The uglified size: **0.7KB!**


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

> **Get object value from pathArray. Throw error or return undefined**

*get( a, ['y', 'z'] )*

```javascript
//result is
2
```

### assign( obj, ...args )

> **Deeply assign b properties into a**

*assign( a, b )*
```javascript
//result=>
{
  x:1,
  y:{
    z:10,
    u:'name'
  }
}
```

### merge( obj, ...args )

> **Deeply merge b properties into a**

*merge( a, b )*
```javascript
//result=>
{
  x:1,
  y:{
    w:1,
    z:10,
    u:'name'
  }
}
```

### exclude( obj, excludeObj, [newValue] )

> **Deeply delete exclude_obj(if key has a truthy value) from obj, optionally set to newValue if present**

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


### deepIt( a, b, callback )

> **Iterate b with deeply sync props of a, and callback(objA, objB, key)**
```javascript
deepIt( a, b, function(objA,objB,key){
    objA[key] = objB[key]
} )
// ---> same result of assign(a,b)
```

## Tree Shaking

First, you need install [rollup](https://github.com/rollup/rollup).

Then pass the API methods you want in command line:

``` shell
rollup -c --api assign,pick
```

You can add above as **your npm scripts** in `package.json`:

``` javascript
scripts: {
  ...
  "objutil": "rollup -c ./node_modules/objutil/rollup.config.js --api assign,pick"
}
```

That way it's rebuild from source, keep code minimum.

### MIT
