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
        {item: 'apple', number: 10},
        {item: 'pear', number: 23}
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
            {item: 'apple', number: 10},
            {item: 'pear', number: 23}
          ]
        }
      }
    )
  })

  it('@ invert obj', function () {
    expect(lib.invert({a: 1, b: {c: 2}, d: 'xyz'})).deep.equal({
      1: 'a',
      xyz: 'd'
    })
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

  it('@ merge b to a', function () {
    expect(lib.merge(a, b)).to.be.deep.equal(
      {
        'name': 'James',
        'age': 10,
        'prop': {
				  'addr': 1,
				  'sn': 1001,
				  'order': [
            {item: 'apple', number: 10},
            {item: 'pear', number: 23}
				  ],
				  'newAddr': 'xyz'
        }
      }
		)
  })

  it('merge with non-key', function () {
    expect(lib.merge({}, {plugins: {value: 'asdf'}})).deep.equal({plugins: {value: 'asdf'}})
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
            {item: 'apple', number: 10},
            {item: 'pear', number: 23}
          ],
				  'newAddr': 'xyz'
        }
      }
		)
  })

  it('@ exclude without newVal', function () {
    var val = lib.exclude(a, excludeList)
    expect(val).is.deep.equal(
			{'name': 'James', 'prop': {'sn': 1001, 'order': [{item: 'apple', number: 10}, {item: 'pear', number: 23}]}}
		)
  })

  it('@ exclude with newVal', function () {
    var val = lib.exclude(a, {
      hoho: 234,
	    age: null,
	    prop: { addr: null, lulu: true }
    }, true)
    expect(val).is.deep.equal(
			{'name': 'James', 'age': null, 'prop': {'addr': null, 'sn': 1001, 'order': [{item: 'apple', number: 10}, {item: 'pear', number: 23}]}}
		)
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
    var val = lib.get({prop: 1}, 'prop/order/2/item'.split('/'))
    expect(val).to.be.deep.equal([undefined, 1])
  })

  it('@ get return Error on not found', function () {
    var val = lib.get({prop: 1}, 'prop/order/2/item'.split('/'), true)
    expect(val).to.be.an('error')
    expect(val.message).to.equal('NotFound')
  })

  it('@ get return non-array value when set 3rd arg', function () {
    var val = lib.get({prop: {value: 1}}, 'prop/value'.split('/'), true)
    expect(val).to.eql(1)
  })

  it('@ get using string as path (dot path)', function () {
    var val = lib.get({prop: {value: 1}}, 'prop.value', true)
    expect(val).to.eql(1)
  })

  it('@ set using string (dot path)', function () {
    var val = lib.set({}, 'prop.value', 1)
    expect(val).to.deep.eql({prop: {value: 1}})
  })

  it('@ set using array path', function () {
    var val = lib.set({}, 'prop.value'.split('.'), 1)
    expect(val).to.deep.eql({prop: {value: 1}})
  })

  it('@ set with existing path', function () {
    var val = lib.set({prop: {}}, 'prop.value.key'.split('.'), 1)
    expect(val).to.deep.eql({prop: {value: {key: 1}}})
  })

  it('@ set with primitive path', function () {
    var val = lib.set({prop: 2}, 'prop.value.key'.split('.'), 1)
    expect(val).to.be.an('error')
  })

  it('@ set with primitive obj', function () {
    var val = lib.set(234, 'prop.value.key'.split('.'), 1)
    expect(val).to.eql(234)
  })

  it('@ unset with primitive obj', function () {
    var val = lib.unset(234, 'prop.value.key')
    expect(val).to.eql(undefined)
  })

  it('@ unset with normal obj', function () {
    var obj = {prop: {value: 1, abc:2}}
    var val = lib.unset(obj, 'prop.value')
    expect(val).to.eql(true)
    expect(obj).to.deep.eql({prop:{abc: 2}})

    val = lib.unset(obj, 'prop')
    expect(val).to.eql(true)
    expect(obj).to.deep.eql({})

  })

  it('@ unset with non-exists key', function () {
    var val = lib.unset({prop: {value: 1}}, 'prop.value.key')
    expect(val).to.eql(false)
  })

  it('@ unset with delete false', function () {
    var obj = {}
    Object.defineProperty(obj, 'value', {value: 1})
    try {
		  var val = lib.unset(obj, 'value')
    } catch (e) {
		  expect(e).to.be.an('error')
    }
  })

  it('@ pick with exist obj path 1', function () {
    var val = lib.pick({a: 3, b: {c: 2}}, {prop: {order: [0, 1]}})
    expect(val).to.deep.equal(
      {}
    )
  })

  it('@ pick with exist obj path 2', function () {
    var val = lib.pick(a, {prop: {order: [0, 1]}})
    expect(JSON.stringify(val)).to.deep.equal(
      JSON.stringify({
        'prop': {'order': [null, {'item': 'pear', 'number': 23}]}
      })
    )
  })

  it('@ pick with null', function () {
    var val = lib.pick(null, {a: 1, c: {d: 1}})
    expect(val).to.deep.equal({})

    val = lib.pick(3234, {a: 1, c: {d: 1}})
    expect(val).to.deep.equal({})

    val = lib.pick('sdoif', {a: 1, c: {d: 1}})
    expect(val).to.deep.equal({})
  })

  it('@ pick with exist obj path 3', function () {
    var val = lib.pick({a: 10, b: 2, c: {d: 3}}, {a: 1, c: {d: 1}})
    expect(val).to.deep.equal(
      {
        a: 10,
        c: {d: 3}
      }
    )
  })

  it('@ defaults with object', function () {
    var val = lib.defaults({prop: {a: 1}, b: 2}, {prop: {a: 10, order: [0, 1]}, b: 20, c: 30})
    expect(val).to.deep.equal(
      {'prop': {'a': 1, 'order': [0, 1]}, 'b': 2, 'c': 30}
    )
    val = lib.defaults(undefined, {prop: {a: 10, order: [0, 1]}, b: 20, c: 30})
    expect(val).to.deep.equal(
      {prop: {a: 10, order: [0, 1]}, b: 20, c: 30}
    )
  })

  it('@ visit', function () {
    var called = false
    var obj = {a: 1, b: {d: 3}}
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

    lib.visit(obj, function (value, key, path, source) {
      expect(key).eql(keys.shift())
      expect(path).deep.eql(paths.shift())
    })

    expect(keys.length).eql(0)
  })

  it('@ isEqual', function () {
    // not strict equal
    expect(lib.isEqual({a: 1, b: 2}, {a: 1, b: 2})).ok
    expect(lib.isEqual({a: 1, b: 2}, {a: 1, b: '2'})).ok
    expect(lib.isEqual({a: 1, b: 2}, {a: 2, b: 2})).not.ok
    expect(lib.isEqual({a: 1, b: {d: 3}}, {a: 1, b: {d: 3}})).ok
    expect(lib.isEqual(null, {a: 1, b: {d: 3}})).not.ok
    expect(lib.isEqual({a: 1, b: {d: 3}}, null)).not.ok
    expect(lib.isEqual(null, null)).ok

    // isStrict
    expect(lib.isEqual({a: 1, b: {d: '3'}}, {a: 1, b: {d: 3}}, true)).not.ok
    expect(lib.isEqual({a: 1, b: {d: 3}}, {a: 1, b: {d: 3}}, true)).ok
    expect(lib.isEqual(null, {a: 1, b: {d: 3}}, true)).not.ok
    expect(lib.isEqual({a: 1, b: {d: 3}}, null, true)).not.ok
    expect(lib.isEqual(null, null, true)).ok
  })
})
