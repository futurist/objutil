'use strict'

var assert = require('assert')
var expect = require('chai').expect
var lib = require('../dist/objutil.cjs.js')

var a, b, c
var newObj = function (obj) {
  return JSON.parse(JSON.stringify(obj))
}

beforeEach(function () {
  a = newObj({
    name: 'James',
    age: 22,
    prop: {
      addr: 'ABC',
      sn: 1001,
      order: [
        { item: 'apple', number: 10 },
        { item: 'pear', number: 23 }
      ]
    }
  })

  b = newObj({
    age: 10,
    prop: {
      addr: 1,
      newAddr: 'xyz'
    }
  })

  c = newObj({
    age: 33
  })
})

var excludeList = {
  age: 1,
  prop: { addr: 1 },
  notExist: 1
}

describe('Test a/b with lib', function () {
  it('@ is test', function () {
    var obj = {}
    var arr = []
    var re = /abc/
    var date = new Date()
    var func = function(){}
    expect(lib.is(obj, 'Object')).ok
    expect(lib.is(arr, 'Array')).ok
    expect(lib.is(re, 'RegExp')).ok
    expect(lib.is(date, 'Date')).ok
    expect(lib.is(func, 'Function')).ok
  })

  it('hasOwnProperty test', function () {
    var x = Object.create(b)
    x.age = 30
    expect(lib.assign(a, x)).deep.equal(
      {
        name: 'James',
        age: 30,
        prop: {
          addr: 'ABC',
          sn: 1001,
          order: [
            { item: 'apple', number: 10 },
            { item: 'pear', number: 23 }
          ]
        }
      }
    )
  })

  it('@ isPrimitive test', function () {
    expect(lib.isPrimitive(null)).ok
    expect(lib.isPrimitive(undefined)).ok
    expect(lib.isPrimitive('undefined')).ok
    expect(lib.isPrimitive(NaN)).ok
    expect(lib.isPrimitive(true)).ok
    expect(lib.isPrimitive(false)).ok
    expect(lib.isPrimitive(123)).ok
    if (typeof Symbol != "undefined") lib.isPrimitive(Symbol()).ok
    expect(lib.isPrimitive({})).not.ok
  })
  
  it('@ isIterable test', function () {
    expect(lib.isIterable({})).ok
    expect(lib.isIterable([])).ok
    expect(lib.isIterable(new Date())).ok
    expect(lib.isIterable(/asdf/)).ok
    var a = class{}
    expect(lib.isIterable(new a())).ok
  })

  it('@ invert obj', function () {
    expect(lib.invert({ a: 1, b: { c: 2 }, d: 'xyz' })).deep.equal({
      1: 'a',
      xyz: 'd'
    })
  })

  it('@ assign target is null', function () {
    try {
      var obj = lib.assign(null, { a: 1 })
    } catch (e) {
      expect(e).is.an('error')
    }
  })

  it('@ assign target is primitive', function () {
    var obj = lib.assign(2, { a: 1 })
    expect(obj).deep.eql({a:1})
    expect(({}).toString.call(obj)).eql('[object Number]')
  })

  it('@ assign should not deep', function () {
    const obj = lib.assign({a: {b: 0}}, {a: {b: 1, c: 2}}, {a: {c: 3}})
    expect(obj).deep.eql({a: {c: 3}})
  })

  it('@ assign dest is null', function () {
    var o1 = { a: 1 }
    var o2 = { a: undefined, b: undefined }
    var obj = lib.assign({}, o1, o2)
    expect(obj).deep.eql({ a: undefined, b: undefined })
    expect(lib.assign({}, { a: 'a' }, { a: undefined })).deep.eql({ a: undefined })
    expect(lib.assign({}, { a: 'a' }, { a: null })).deep.eql({ a: null })
    expect(lib.assign({}, { a: ['a'] }, { a: ['bb', ['dd']] })).deep.eql({ 'a': ['bb', ['dd']] })
  })

  it('@ merge dest is null', function () {
    var o1 = { a: 1 }
    var o2 = { a: undefined, b: undefined }
    var obj = lib.merge({}, o1, o2)
    expect(obj).deep.eql({ a: 1, b: undefined })
    expect(lib.merge({}, { a: 'a' }, { a: undefined })).deep.eql({ a: 'a' })
    expect(lib.merge({}, { a: 'a' }, { a: null })).deep.eql({ a: null })
    expect(lib.merge({}, { a: ['a'] }, { a: ['bb', ['dd']] })).deep.eql({ 'a': ['bb', ['dd']] })
  })

  it('@ defaults dest is null', function () {
    var o1 = { a: 1 }
    var o2 = { a: undefined, b: undefined }
    var obj = lib.defaults({}, o1, o2)
    expect(obj).deep.eql({ a: 1, b: undefined })
    expect(lib.defaults({}, { a: 'a' }, { a: undefined })).deep.eql({ a: 'a' })
    expect(lib.defaults({}, { a: 'a' }, { a: null })).deep.eql({ a: 'a' })
    expect(lib.defaults({}, { a: { a: 'a' } }, { a: { b: 'bb' } })).deep.eql({ 'a': { 'a': 'a', 'b': 'bb' } })
  })

  it('@ assign o1 o2 o3', function () {
    var o1 = { a: 1, b: 1, c: 1 }
    var o2 = { b: 2, c: 2 }
    var o3 = { c: 3 }
    var obj = lib.assign({}, o1, o2, o3)
    expect(obj).deep.eql({ a: 1, b: 2, c: 3 })
    expect(o1).deep.eql({ a: 1, b: 1, c: 1 })
    expect(o2).deep.eql({ b: 2, c: 2 })
    expect(o3).deep.eql({ c: 3 })
  })

  it('@ assign b to a', function () {
    expect(lib.assign(a, b)).deep.equal(
      {
        'name': 'James',
        'age': 10,
        prop: {
          addr: 1,
          newAddr: 'xyz'
        }
      }
    )
  })

  it('@ merge null target', function () {
    try {
      var obj = lib.merge(null, { a: 1 })
    } catch (e) {
      expect(e).is.an('error')
    }
  })

  it('@ merge o1 o2 o3', function () {
    var o1 = { a: { b: 1, c: 1 } }
    var o2 = { a: { c: 2 } }
    var o3 = { c: 3 }
    var obj = lib.merge({}, o1, o2, o3)
    expect(obj).deep.eql({ a: { b: 1, c: 2 }, c: 3 })
    expect(o1).deep.eql({ a: { b: 1, c: 1 } })
    expect(o2).deep.eql({ a: { c: 2 } })
    expect(o3).deep.eql({ c: 3 })
  })

  it('@ merge b to a', function () {
    expect(lib.merge(a, b)).to.be.deep.equal(
      {
        'name': 'James',
        'age': 10,
        'prop': {
          'addr': 1,
          'sn': 1001,
          'order': [
            { item: 'apple', number: 10 },
            { item: 'pear', number: 23 }
          ],
          'newAddr': 'xyz'
        }
      }
    )
  })

  it('merge with non-key', function () {
    expect(lib.merge({}, { plugins: { value: 'asdf' } })).deep.equal({ plugins: { value: 'asdf' } })
  })

  it('@ merge with multiple args', function () {
    expect(lib.merge(a, b, c)).to.be.deep.equal(
      {
        'name': 'James',
        'age': 33,
        'prop': {
          'addr': 1,
          'sn': 1001,
          'order': [
            { item: 'apple', number: 10 },
            { item: 'pear', number: 23 }
          ],
          'newAddr': 'xyz'
        }
      }
    )
  })

  it('@ filter recursive obj', function () {
    var d = {}
    var c = { root: d, a: 1 }
    d.c = c
    // it's Circular object, c.root->d, d.c->c, ...
    let count = 0
    expect(lib.filter(c, function (v) {
      count++
      // console.log(count, v)
      return v.val == 1
    }))
    expect(count).eql(3)
  })

  it('@ filter', function () {
    expect(lib.filter({ a: 1, b: { c: 2, d: 3 }, e: 4 }, function (v) {
      return v.path == '' && v.val % 2
    })).deep.eql(['a'])

    expect(lib.filter({ a: 1, b: { c: 2, d: 3 }, e: 4 }, function (v) {
      return v.val % 2 == 0
    })).deep.eql(['b.c', 'e'])
  })

  it('@ remove', function () {
    var val = lib.remove(a, excludeList)
    expect(val).is.deep.equal(
      { 'name': 'James', 'prop': { 'sn': 1001, 'order': [{ item: 'apple', number: 10 }, { item: 'pear', number: 23 }] } }
    )
    expect(lib.remove({ a: 1, b: 2 }, {
      a: 0,
      b: 1,
      notExist: 1
    })).is.deep.equal(
      { a: 1 }
      )
  })

  it('@ remove with force', function () {
    var val = lib.remove(a, {
      age: 0,
      prop: { addr: 1 },
      notExist: 1
    }, true)
    expect(val).is.deep.equal(
      { 'name': 'James', 'prop': { 'sn': 1001, 'order': [{ item: 'apple', number: 10 }, { item: 'pear', number: 23 }] } }
    )
  })

  it('@ got with string path', function () {
    var val = lib.got(a, 'prop.order.1.item')
    expect(val).is.deep.equal('pear')
  })

  it('@ got with exist path', function () {
    var val = lib.got(a, [['prop', 'order', 1, 'item']])
    expect(val).is.deep.equal('pear')
  })

  it('@ got with fallback path', function () {
    var val = lib.got(a, ['some', 'name'])
    expect(val).is.deep.equal('James')
  })

  it('@ got with default value', function () {
    var val = lib.got(a, ['some', 'other'], 'Jane')
    expect(val).is.deep.equal('Jane')
  })

  it('@ get with exist path', function () {
    var val = lib.get(a, ['prop', 'order', 1, 'item'])
    expect(val).is.deep.equal(['pear'])
  })

  it('@ get with non-exist path', function () {
    var val = lib.get(a, 'prop/order/2/item'.split('/'))
    expect(val).to.deep.equal([undefined, 1])
  })

  it('@ get with primitive path', function () {
    var val = lib.get({ prop: 1 }, 'prop/order/2/item'.split('/'))
    expect(val).to.be.deep.equal([undefined, 1])
  })

  it('@ get return Error on not found', function () {
    var val = lib.get({ prop: 1 }, 'prop/order/2/item'.split('/'), true)
    expect(val).to.be.an('error')
    expect(val.message).to.equal('NotFound')
  })

  it('@ get return non-array value when set 3rd arg', function () {
    var val = lib.get({ prop: { value: 1 } }, 'prop/value'.split('/'), true)
    expect(val).to.eql(1)
  })

  it('@ get using string as path (dot path)', function () {
    var val = lib.get({ prop: { value: 1 } }, 'prop.value', true)
    expect(val).to.eql(1)
  })

  it('@ ensure', function () {
    var obj = {}
    var val = lib.ensure(obj, 'prop.value', 1)
    expect(val).to.deep.eql([1, 1])
    val = lib.ensure(obj, 'prop.value', 2)
    expect(val).eql([1])
    expect(obj).to.deep.eql({ prop: { value: 1 } })
  })

  it('@ set using string (dot path)', function () {
    var val = lib.set({}, 'prop.value', 1)
    expect(val).to.deep.eql({ prop: { value: 1 } })
  })

  it('@ set using array path', function () {
    var val = lib.set({}, 'prop.value'.split('.'), 1)
    expect(val).to.deep.eql({ prop: { value: 1 } })
  })

  it('@ set with existing path', function () {
    var val = lib.set({ prop: {} }, 'prop.value.key'.split('.'), 1)
    expect(val).to.deep.eql({ prop: { value: { key: 1 } } })
  })

  it('@ set with primitive path', function () {
    var val = lib.set({ prop: 2 }, 'prop.value.key'.split('.'), 1)
    expect(val).to.be.an('error')
  })

  it('@ set with primitive obj', function () {
    var val = lib.set(234, 'prop.value.key'.split('.'), 1)
    expect(val).to.eql(234)
  })

  it('@ set with obj descriptor', function () {
    var val = lib.set({}, 'prop.value', 1, {writable: false})
    expect(()=>val.prop.value=2).to.throw
    expect(val.prop.value).to.eql(1)
  })

  it('@ set with descriptor shortcuts', function () {
    var val = lib.set({}, 'prop.value', 1, {c:1})
    expect(val.prop.value).to.eql(1)
    expect(Object.getOwnPropertyDescriptor(val.prop, 'value')).deep.eql({
        "configurable": true,
        "enumerable": false,
        "value": 1,
        "writable": false,
    })
  })

  it('@ unset with primitive obj', function () {
    var val = lib.unset(234, 'prop.value.key')
    expect(val).to.eql(undefined)
  })

  it('@ unset with normal obj', function () {
    var obj = { prop: { value: 1, abc: 2 } }
    var val = lib.unset(obj, 'prop.value')
    expect(val).to.eql(true)
    expect(obj).to.deep.eql({ prop: { abc: 2 } })

    val = lib.unset(obj, 'prop')
    expect(val).to.eql(true)
    expect(obj).to.deep.eql({})

  })

  it('@ unset with non-exists key', function () {
    var val = lib.unset({ prop: { value: 1 } }, 'prop.value.key')
    expect(val).to.eql(false)
  })

  it('@ unset with delete false', function () {
    var obj = {}
    Object.defineProperty(obj, 'value', { value: 1 })
    try {
      var val = lib.unset(obj, 'value')
    } catch (e) {
      expect(e).to.be.an('error')
    }
  })

  it('@ pick with exist obj path 1', function () {
    var val = lib.pick({ a: 3, b: { c: 2 } }, { prop: { order: [0, 1] } })
    expect(val).to.deep.equal(
      {}
    )
  })

  it('@ pick with array', function () {
    var val = lib.pick({ a: 3, b: { c: 2 } }, ['a', 'c'])
    expect(val).to.deep.equal(
      {a:3}
    )
  })

  it('@ pick with exist obj path 2', function () {
    var val = lib.pick(a, { prop: { order: [0, 1] } })
    expect(JSON.stringify(val)).to.deep.equal(
      JSON.stringify({
        'prop': { 'order': [null, { 'item': 'pear', 'number': 23 }] }
      })
    )
  })

  it('@ pick with null', function () {
    var val = lib.pick(null, { a: 1, c: { d: 1 } })
    expect(val).to.deep.equal({})

    val = lib.pick(3234, { a: 1, c: { d: 1 } })
    expect(val).to.deep.equal({})

    val = lib.pick('sdoif', { a: 1, c: { d: 1 } })
    expect(val).to.deep.equal({})
  })

  it('@ pick with force', function () {
    var val = lib.pick({ a: 1, b: 2 }, { a: 0 }, true)
    expect(val).to.deep.equal({ a: 1 })
  })

  it('@ pick with exist obj path 3', function () {
    var val = lib.pick({ a: 10, b: 2, c: { d: 3 } }, { a: 1, c: { d: 1 } })
    expect(val).to.deep.equal(
      {
        a: 10,
        c: { d: 3 }
      }
    )
  })

  it('@ defaults with object', function () {
    var val = lib.defaults({ prop: { a: 1 }, b: 2 }, { prop: { a: 10, order: [0, 1] }, b: 20, c: 30 })
    expect(val).to.deep.equal(
      { 'prop': { 'a': 1, 'order': [0, 1] }, 'b': 2, 'c': 30 }
    )
    val = lib.defaults(undefined, { prop: { a: 10, order: [0, 1] }, b: 20, c: 30 })
    expect(val).to.deep.equal(
      { prop: { a: 10, order: [0, 1] }, b: 20, c: 30 }
    )
  })

  it('@ visit', function () {
    var called = false
    var obj = { a: 1, b: { d: 3 } }
    var keys = ['a', 'b', 'd']
    var paths = [
      [],
      [],
      ['b']
    ]

    lib.visit(null, function () { called = true })
    expect(called).equal(false)

    lib.visit('string', function () { called = true })
    expect(called).equal(false)

    lib.visit(234, function () { called = true })
    expect(called).equal(false)

    lib.visit(obj, function (v) {
      expect(v.key).eql(keys.shift())
      expect(v.path).deep.eql(paths.shift())
    })

    expect(keys.length).eql(0)
  })

  it('@ isEqual', function () {
    // not strict equal
    expect(lib.isEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).ok
    expect(lib.isEqual({ a: 1, b: 2 }, { a: 1, b: '2' })).ok
    expect(lib.isEqual({ a: 1, b: 2 }, { a: 2, b: 2 })).not.ok
    expect(lib.isEqual({ a: 1, b: { d: 3 } }, { a: 1, b: { d: 3 } })).ok
    expect(lib.isEqual(null, { a: 1, b: { d: 3 } })).not.ok
    expect(lib.isEqual({ a: 1, b: { d: 3 } }, null)).not.ok
    expect(lib.isEqual(null, null)).ok

    // isStrict
    expect(lib.isEqual({ a: 1, b: { d: '3' } }, { a: 1, b: { d: 3 } }, true)).not.ok
    expect(lib.isEqual({ a: 1, b: { d: 3 } }, { a: 1, b: { d: 3 } }, true)).ok
    expect(lib.isEqual(null, { a: 1, b: { d: 3 } }, true)).not.ok
    expect(lib.isEqual({ a: 1, b: { d: 3 } }, null, true)).not.ok
    expect(lib.isEqual(null, null, true)).ok

    // keys different
    expect(lib.isEqual({ a: 11, b: 22 }, {})).not.ok
    expect(lib.isEqual({}, { a: 11, b: 22 })).not.ok

  })

  it('@ map', function () {
    var obj = {
      a:1, b:2
    }
    expect(lib.map(obj, (v,k)=>k+v)).deep.eql(
      ['a1', 'b2']
    )
  })

  it('@ some', function () {
    var obj = {
      a:1, b:2
    }
    expect(lib.some(obj, (v,k)=>v>1)).eql(true)
  })

  it('@ every', function () {
    var obj = {
      a:1, b:2
    }
    expect(lib.every(obj, (v,k)=>v>1)).eql(false)
  })

  it('@ forEach', function () {
    var vals = [3, 4]
    var keys = [0, 1]
    lib.forEach([3, 4], function (val, key, obj) {
      expect(val == vals.shift()).ok
      expect(key == keys.shift()).ok
    })
    expect(keys.length == 0).ok
    expect(vals.length == 0).ok

    var count = 0
    lib.forEach({a:1, b:2}, function (val, key, obj) {
      expect(val == 1).ok
      expect(key == 'a').ok
      count++
      return false // this will stop iteration
    })
    expect(count).equal(1)

    var called = false
    lib.forEach(5, function (val, key, obj) {
      called = true
    })
    expect(called).not.ok

    function Foo() {
      this.a = 3
      this.b = 4
    }
    Foo.prototype.c = 3
    vals = [3, 4]
    keys = ['a', 'b']
    lib.forEach(new Foo(), function (val, key, obj) {
      expect(val == vals.shift()).ok
      expect(key == keys.shift()).ok
    })

    expect(keys.length == 0).ok
    expect(vals.length == 0).ok

  })
})
