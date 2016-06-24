# extend_exclude  [![Build Status](https://travis-ci.org/mithriljs-cn/extend_exclude.svg?branch=master)](https://travis-ci.org/mithriljs-cn/extend_exclude)

**js object _extend()/_exclude() for deeply operate two object**

### Usage:

````
var _extend = require('extend_exclude')._extend
var _exclude = require('extend_exclude')._exclude
var a = {
  x:1,
  y:{
    z:2
  }
}

var b= {
  y:{
    z:10,
    u:'name'
  }
}
_extend(a,b)
_exclude(a,b)
````

### _extend( a, b )

**Deeply merge b properties into a**

*_extend( a, b )*
````
{
  x:1,
  y:{
    z:10,
    u:'name'
  }
}
````

### _exclude( a, exclude_obj, [newValue] )

**Deeply delete exclude_obj(if key has a truthy value) from a, optionally set to newValue if present**

*_exclude( a, { y:{z:1} } )*

````
{
  x:1,
  y:{
    u:'name'
  }
}
````
*_exclude( a, { y:{z:10} } , null)*
````
{
  x:1,
  y:{
    z:null,
    u:'name'
  }
}

````

### _deepIt( a, b, callback )

**Iterate deeply with a && b simultaneously, and callback(objA, objB, key)**
````
_deepIt( a, b, function(objA,objB,key){
    objA[key] = objB[key]
} )
---> same result of _extend(a,b)
````

### Copyright @ Mithriljs_CN
