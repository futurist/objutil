# objutil  [![Build Status](https://travis-ci.org/mithriljs-cn/objutil.svg?branch=master)](https://travis-ci.org/mithriljs-cn/objutil)

**js object extend()/exclude() for deeply operate two object**

### Usage:

````
var extend = require('objutil').extend
var exclude = require('objutil').exclude
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
extend(a,b)
exclude(a,b)
````

### extend( a, b )

**Deeply merge b properties into a**

*extend( a, b )*
````
{
  x:1,
  y:{
    z:10,
    u:'name'
  }
}
````

### exclude( a, exclude_obj, [newValue] )

**Deeply delete exclude_obj(if key has a truthy value) from a, optionally set to newValue if present**

*exclude( a, { y:{z:1} } )*

````
{
  x:1,
  y:{
    u:'name'
  }
}
````
*exclude( a, { y:{z:10} } , null)*
````
{
  x:1,
  y:{
    z:null,
    u:'name'
  }
}

````

### deepIt( a, b, callback )

**Iterate deeply with a && b simultaneously, and callback(objA, objB, key)**
````
deepIt( a, b, function(objA,objB,key){
    objA[key] = objB[key]
} )
---> same result of extend(a,b)
````

### Copyright @ Mithriljs_CN
