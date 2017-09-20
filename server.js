"use strict";

const fs = require('fs');
const http = require('http');
const url = require('url');
const querystring = require('querystring');

const get6 = require('./get6.js');


let writeAlertJsonInfo = function(req, res){
	
	res.write('alertJson = '+ JSON.stringify(alertJson)+ ';' );
	res.write('alertApp.onready();');
	res.write('</script></body></html>');
	res.end();
}

let homepage = function(req, res){
	res.writeHead(200, {'Content-Type':'text/html'});

	//console.log(__dirname);
	let rs = fs.createReadStream("./get6rh.html");

	rs.pipe(res, {end:false});
	rs.on('end', ()=>{

		//writeAlertJsonInfo(req, res);
		res.end();
	});
}

let newItem = function(req, res, config){
	res.writeHead(200, {'Content-Type':'application/json'});
	
	config.response = res;
	
	get6.getdata(config);
	
}

let startHttpServer = function(){
	http.createServer(function(req, res) {
		const host = req.headers.host;
		const hostname = url.parse('http://'+host).hostname;

		let pathname = url.parse(req.url).pathname;
		console.log(pathname);
		if( pathname === '/' ){
			homepage(req, res);
		}else if( pathname.slice(0,5) === '/post' ){
			    
			var post = '';     
			var config = {};
			
			req.on('data', function(chunk){    
				post += chunk;
			});
 
			req.on('end', function(){    
				config = querystring.parse(post);
				console.log(config);
				newItem(req, res, config);
			});
		  		  
		  
		}
		
	}).listen(8086,()=>{
	   console.log('listen on port 8086...');
	 });
}

//--------test begin---------------------
/*
startHttpServer();
*/
//---------test end----------------------

exports.start = function(){
	startHttpServer();
}