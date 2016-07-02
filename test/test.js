var assert = require('assert')
var expect = require('chai').expect
var lib = require('../cjs/extend_exclude')

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
	prop:{ addr:1 }
}

describe('Test a/b with lib', function  () {
	it('@ _extend b to a', function(){
		expect( lib._extend(a,b) ).to.be.deep.equal(
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

	it('@ _extend with multiple args', function(){
		expect( lib._extend(a,b,c) ).to.be.deep.equal(
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

	it('@ _exclude without newVal', function(){
		var val = lib._exclude(a, excludeList)
		expect( val ).is.deep.equal(
			{"name":"James","prop":{"sn":1001,"order":[{item:'apple', number:10}, {item:'pear', number:23}]}}
		)
	})

	it('@ _exclude with newVal', function(){
		var val = lib._exclude(a, excludeList, null)
		expect( val ).is.deep.equal(
			{"name":"James","age":null,"prop":{"addr":null,"sn":1001,"order":[{item:'apple', number:10}, {item:'pear', number:23}]}}
		)
	})

	it('@ _get with exist path', function(){
		var val = lib._get(a, ['prop', 'order', 1, 'item'])
		expect( val ).is.deep.equal('pear')
	})

	it('@ _get with non-exist path', function(){
		var val = lib._get(a, 'prop/order/2/item'.split('/'))
		expect( val ).to.be.undefined
	})

	it('@ _get with primitive path', function(){
		var val = lib._get({prop:1}, 'prop/order/2/item'.split('/'))
		expect( val ).to.be.undefined
	})

	it('@ _get return Error on not found', function(){
		var val = lib._get({prop:1}, 'prop/order/2/item'.split('/'), true)
		expect( val ).to.be.an('error')
		expect( val.message ).to.equal('NotFound')
	})


	it('@ _pick with exist obj path 1', function(){
		var val = lib._pick({a:3, b:{c:2}}, {prop:{order:[0,1]}})
		expect( val ).to.deep.equal(
      {}
    )
	})

	it('@ _pick with exist obj path 2', function(){
		var val = lib._pick(a, {prop:{order:[0,1]}})
		expect( JSON.stringify(val) ).to.deep.equal(
      JSON.stringify({
        "prop":{"order":[null,{"item":"pear","number":23}]}
      })
    )
	})

	it('@ _pick2 with non-exist obj path 1', function(){
		var val = lib._pick2({a:3, b:{c:2}}, {prop:{order:[0,1]}})
		expect( val ).to.deep.equal(
      {a:3, b:{c:2}}
    )
	})

	it('@ _pick2 with non-exist obj path 2', function(){
		var val = lib._pick2(a, {prop:{order:[0,1]}})
		expect( val ).to.deep.equal(
      {"name":"James","age":22,"prop":{"addr":"ABC","sn":1001,"order":[{"item":"apple","number":10}]}}
    )
	})

	it('@ _default with object', function(){
		var val = lib._default({prop:{a:1}, b:2}, {prop:{a:10, order:[0,1]}, b:20, c:30})
		expect( val ).to.deep.equal(
      {"prop":{"a":1,"order":[0,1]},"b":2,"c":30}
    )
	})

})
