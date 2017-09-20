"use strict";

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const moment = require('moment');
const iconv = require('iconv-lite');

const querystring = require('querystring');
const http = require('http');
const fs = require('fs');

let getRH = function(content){

	
	//console.log(content);

	let dom208 = new JSDOM(content);
	let $ = require("jquery")(dom208.window);

	console.log('table size: ' + $('table').length );
	
	let stationList = $('body table').eq(2).find('tr');
	
	//console.log( $('body table').eq(2).html() );
	
	console.log('stationList size: ' + stationList.length );
	
	let result = [];
	stationList.each((index, item)=>{
		if(index === 0) return;
		let tdList = $('td', item);
		//console.log(tdList.length); //temph, pressure, wind
		
		let time = tdList.eq(1).text().slice(0,17),
		rain = tdList.eq(2).text(),
		T = tdList.eq(4).text(),
		windVal = tdList.eq(13).text(),
		windDir = tdList.eq(14).text(),		
		rh = tdList.eq(21).text(),
		localP = tdList.eq(24).text();
		
		console.log(`${time} ${rh}`);
		
		result.push({time, rain, T, windVal, windDir, rh, localP});
	})
	
	return result;
}

let getPage = function({t='621', countyno='O2672', startdate='20170918200000', endate='20170919080000', response}={}, callback=getRH){
//http://172.18.152.216/biao2013six.php?t=621&countyno=O2672&city=ly&county=%C2%E5%D1%F4&startdate=20170918200000&endate=20170919080000
	var rh6URL = `http://172.18.152.216/biao2013six.php`;

	rh6URL += '?'+ querystring.stringify({t, countyno, startdate, endate});

	http.get( rh6URL , (res) => {
		console.log('statusCode:', res.statusCode);
		//console.log('headers:', res.headers);
		
		//res.setEncoding('utf8');
		
		const chunks = [];
		let size = 0;
		res.on('data', (chunk) => {
			//console.log(chunk);
			
			chunks.push(chunk);
			size += chunk.length;
		});
		
		res.on('end', () => {
			const content = Buffer.concat(chunks, size);
			let str = iconv.decode( content, 'GB2312');
			
			let data = callback(str);
			
			response.end(JSON.stringify(data));
		});

	}).on('error', (e) => {
	  console.error(e);
	});
	
	return [];
}

exports.getdata = function(config={}){
	
	getPage(config);
}




