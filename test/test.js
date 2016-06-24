var assert = require('assert')
var expect = require('chai').expect
var lib = require('../src/extend_exclude')

var a = {
  name:"James",
  age:22,
  prop:{
		addr:"ABC",
		sn:1001,
		order:['apple', 'pear']
  }
}

var b= {
	age:10,
	prop:{
		addr:1,
		newAddr:"xyz"
	}
}

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
				      "apple",
				      "pear"
				    ],
				    "newAddr": "xyz"
				  }
				}
			)
	})

	it('@ _exclude without newVal', function(){
		var val = lib._exclude(a, excludeList)
		expect( val ).be.deep.equal(
			{"name":"James","prop":{"sn":1001,"order":["apple","pear"],"newAddr":"xyz"}}
		)
	})

	it('@ _exclude with newVal', function(){
		var val = lib._exclude(a, excludeList, null)
		expect( val ).be.deep.equal(
			{"name":"James","age":null,"prop":{"addr":null,"sn":1001,"order":["apple","pear"],"newAddr":"xyz"}}
		)
	})

})
