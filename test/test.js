var request = require('request')
, express = require('express')
,assert = require("assert")
,http = require("http");

describe('http tests', function(){

	it('should return the login if the url is correct', function(done){
		http.get('http://localhost:3333/', function(res) {
			assert.equal(200, res.statusCode);
			done();
		})
	});

	it('should not return the home page if the url is wrong', function(done){
		http.get('http://localhost:3333/hone', function(res) {
			assert.equal(404, res.statusCode);
			done();
		})
	});

	it('should login', function(done) {
		request.post(
			    'http://localhost:3333/afterSignIn',
			    { form: { inputUsername: 'savan@thakker.com',inputPassword:'savan' } },
			    function (error, response, body) {
			    	assert.equal(200, response.statusCode);
			    	done();
			    }
			);
	  });
	
	it('should display home page', function(done) {
		request.get(
			    'http://localhost:3333/home',
			    function (error, response, body) {
			    	assert.equal(200, response.statusCode);
			    	done();
			    }
			);
	  });
	it('fetch tweets ', function(done) {
		request.get(
			    'http://localhost:3333/home',
			    function (error, response, body) {
			    	assert.equal(200, response.statusCode);
			    	done();
			    }
			);
	  });
});
