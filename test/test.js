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
	prop:{ addr:1 }
}

describe('Test a/b with lib', function  () {
	it('@ extend b to a', function(){
		expect( lib.extend(a,b) ).to.be.deep.equal(
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

  it('extend with non-key', function() {
    expect(lib.extend({}, {plugins:{value:'asdf'}})).deep.equal({plugins:{value:'asdf'}})
  })

	it('@ extend with multiple args', function(){
		expect( lib.extend(a,b,c) ).to.be.deep.equal(
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

	it('@ pick2 with non-exist obj path 1', function(){
		var val = lib.pick2({a:3, b:{c:2}}, {prop:{order:[0,1]}})
		expect( val ).to.deep.equal(
      {a:3, b:{c:2}}
    )
	})

	it('@ pick2 with non-exist obj path 2', function(){
		var val = lib.pick2(a, {prop:{order:[0,1]}})
		expect( val ).to.deep.equal(
      {"name":"James","age":22,"prop":{"addr":"ABC","sn":1001,"order":[{"item":"apple","number":10}]}}
    )
	})

	it('@ defaults with object', function(){
		var val = lib.defaults({prop:{a:1}, b:2}, {prop:{a:10, order:[0,1]}, b:20, c:30})
		expect( val ).to.deep.equal(
      {"prop":{"a":1,"order":[0,1]},"b":2,"c":30}
    )
	})

})
