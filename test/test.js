var assert = require('assert')
var expect = require('chai').expect
var lib = require('../dist/objutil.cjs.js')

var a,b,c
var newObj = function (obj){
  return JSON.parse(JSON.stringify(obj))
}

beforeEach(function(){
  a = newObj({
    name:"James",
    age:22,
    prop:{
		  addr:"ABC",
		  sn:1001,
		  order:[
        {item:'apple', number:10},
        {item:'pear', number:23}
      ]
    }
  })

  b= newObj({
	  age:10,
	  prop:{
		  addr:1,
		  newAddr:"xyz"
	  }
  })

  c=newObj({
    age:33
  })
})

var excludeList = {
	age:1,
	prop:{ addr:1 },
  notExist: 1
}

describe('Test a/b with lib', function  () {

	it('hasOwnProperty test', function(){
    var x = Object.create(b)
    x.age = 30
    expect(lib.assign(a,x)).deep.equal(
      {
        name:"James",
        age:30,
        prop:{
		      addr:"ABC",
		      sn:1001,
		      order:[
            {item:'apple', number:10},
            {item:'pear', number:23}
          ]
        }
      }
    )
  })

	it('@ invert obj', function(){
    expect(lib.invert({a:1, b:{c:2}, d:'xyz'})).deep.equal({
      1:'a',
      xyz: 'd'
    })
  })

	it('@ assign b to a', function(){
    expect(lib.assign(a,b)).deep.equal(
      {
				"name": "James",
				"age": 10,
	      prop:{
		      addr:1,
		      newAddr:"xyz"
	      }
      }
    )
  })

	it('@ merge b to a', function(){
		expect( lib.merge(a,b) ).to.be.deep.equal(
			{
				"name": "James",
				"age": 10,
				"prop": {
				  "addr": 1,
				  "sn": 1001,
				  "order": [
            {item:'apple', number:10},
            {item:'pear', number:23}
				  ],
				  "newAddr": "xyz"
				}
			}
		)
	})

  it('merge with non-key', function() {
    expect(lib.merge({}, {plugins:{value:'asdf'}})).deep.equal({plugins:{value:'asdf'}})
  })

	it('@ merge with multiple args', function() {
		expect( lib.merge(a,b,c) ).to.be.deep.equal(
			{
				"name": "James",
				"age": 33,
				"prop": {
				  "addr": 1,
				  "sn": 1001,
				  "order": [
            {item:'apple', number:10},
            {item:'pear', number:23}
          ],
				  "newAddr": "xyz"
				}
			}
		)
	})

	it('@ exclude without newVal', function(){
		var val = lib.exclude(a, excludeList)
		expect( val ).is.deep.equal(
			{"name":"James","prop":{"sn":1001,"order":[{item:'apple', number:10}, {item:'pear', number:23}]}}
		)
	})

	it('@ exclude with newVal', function(){
		var val = lib.exclude(a, {
      hoho:234,
	    age:null,
	    prop:{ addr:null, lulu:true }
    }, true)
		expect( val ).is.deep.equal(
			{"name":"James","age":null,"prop":{"addr":null,"sn":1001,"order":[{item:'apple', number:10}, {item:'pear', number:23}]}}
		)
	})

	it('@ get with exist path', function(){
		var val = lib.get(a, ['prop', 'order', 1, 'item'])
		expect( val ).is.deep.equal('pear')
	})

	it('@ get with non-exist path', function(){
		var val = lib.get(a, 'prop/order/2/item'.split('/'))
		expect( val ).to.be.undefined
	})

	it('@ get with primitive path', function(){
		var val = lib.get({prop:1}, 'prop/order/2/item'.split('/'))
		expect( val ).to.be.undefined
	})

	it('@ get return Error on not found', function(){
		var val = lib.get({prop:1}, 'prop/order/2/item'.split('/'), true)
		expect( val ).to.be.an('error')
		expect( val.message ).to.equal('NotFound')
	})


	it('@ pick with exist obj path 1', function(){
		var val = lib.pick({a:3, b:{c:2}}, {prop:{order:[0,1]}})
		expect( val ).to.deep.equal(
      {}
    )
	})

	it('@ pick with exist obj path 2', function(){
		var val = lib.pick(a, {prop:{order:[0,1]}})
		expect( JSON.stringify(val) ).to.deep.equal(
      JSON.stringify({
        "prop":{"order":[null,{"item":"pear","number":23}]}
      })
    )
	})

	it('@ defaults with object', function(){
		var val = lib.defaults({prop:{a:1}, b:2}, {prop:{a:10, order:[0,1]}, b:20, c:30})
		expect( val ).to.deep.equal(
      {"prop":{"a":1,"order":[0,1]},"b":2,"c":30}
    )
		val = lib.defaults(undefined, {prop:{a:10, order:[0,1]}, b:20, c:30})
		expect( val ).to.deep.equal(
      {prop:{a:10, order:[0,1]}, b:20, c:30}
    )
	})

	it('@ isEqual', function(){
    // not strict equal
		expect( lib.isEqual({a:1, b:2}, {a:1, b:2}) ).ok
		expect( lib.isEqual({a:1, b:2}, {a:1, b:'2'}) ).ok
		expect( lib.isEqual({a:1, b:2}, {a:2, b:2}) ).not.ok
		expect( lib.isEqual({a:1, b:{d:3}}, {a:1, b:{d:3}}) ).ok
		expect( lib.isEqual(null, {a:1, b:{d:3}}) ).not.ok
		expect( lib.isEqual({a:1, b:{d:3}}, null) ).not.ok
		expect( lib.isEqual(null, null) ).ok

    // isStrict
		expect( lib.isEqual({a:1, b:{d:'3'}}, {a:1, b:{d:3}}, true) ).not.ok
		expect( lib.isEqual({a:1, b:{d:3}}, {a:1, b:{d:3}}, true) ).ok
		expect( lib.isEqual(null, {a:1, b:{d:3}}, true) ).not.ok
		expect( lib.isEqual({a:1, b:{d:3}}, null, true) ).not.ok
		expect( lib.isEqual(null, null, true) ).ok
	})

})
