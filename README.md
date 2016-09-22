# objutil

JS object util methods, with tree shaking building-in, methods: extend, merge, exclude, default, pick etc.

[![Build Status](https://travis-ci.org/futurist/objutil.svg?branch=master)](https://travis-ci.org/futurist/objutil) <a href='https://coveralls.io/github/futurist/objutil?branch=master'><img src='https://coveralls.io/repos/github/futurist/objutil/badge.svg?branch=master' alt='Coverage Status' /></a>

### Usage:

```javascript
var merge = require('objutil').merge
var exclude = require('objutil').exclude
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
merge(a,b)
exclude(a,b)
```

### extend( a, b )

**Deeply extend b properties into a**

*extend( a, b )*
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

### merge( a, b )

**Deeply merge b properties into a**

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

### exclude( a, exclude_obj, [newValue] )

**Deeply delete exclude_obj(if key has a truthy value) from a, optionally set to newValue if present**

*exclude( a, { y:{z:1} } )*

```javascript
//result=>
{
  x:1,
  y:{
    w:1
  }
}
```
*exclude( a, { y:{z:10} } , null)*
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

### get( obj, pathArray, isThrow )

**Get object value from pathArray. Throw error or return undefined**

*get( a, ['y', 'z'] )*

```javascript
//result=>
2
```


### deepIt( a, b, callback )

**Iterate b with deeply sync props of a, and callback(objA, objB, key)**
```javascript
deepIt( a, b, function(objA,objB,key){
    objA[key] = objB[key]
} )
// ---> same result of merge(a,b)
```

### MIT
