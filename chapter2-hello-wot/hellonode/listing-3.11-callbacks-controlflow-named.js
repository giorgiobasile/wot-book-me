var http = require('http');
var request = require('request');
var fs = require('fs');
var async = require('async');

var port = 8787;
var serviceRootUrl = 'http://localhost:8686';

http.createServer(function(servReq, servResp){
	console.log('New incoming client request');
	if(servReq.url === '/log'){
		async.parallel([
				getTemperature,
				getLight
			],	
			function(err, results){
				if(!err) logValuesReply(servResp, results[0], results[1]);
			});
	} else {
		servResp.writeHeader(200, {"Content-Type":"text/plain"});
		servResp.write("Please use /log");
		servResp.end();
	}
}).listen(port);

function getTemperature(callback){
	request({url:serviceRootUrl + "/temperature", json:true}, function(err, resp, body){
		if(err) throw err;
		if(resp.statusCode === 200){
			console.log(body);
			var temperature = body.temperature;
			callback(null, temperature);		
		}else{
			callback(null, null);
		}
	});
}

function getLight(callback){
	request({url:serviceRootUrl + "/light", json:true}, function(err, resp, body){
		if(err) throw err;
		if(resp.statusCode === 200){
			console.log(body);
			var light = body.light;
			callback(null, light);		
		}else{
			callback(null, null);
		}
	});
}

function logValuesReply(servResp, temperature, light){
	var logEntry = 'Temperature: ' + temperature + ' Light: ' + light;
	fs.appendFile('log.txt', logEntry + '\n', encoding = 'utf-8', function(err){
		if(err) throw err;
		servResp.writeHeader(200, {"Content-Type":"text/plain"});
		servResp.write(logEntry);
		servResp.end();
	});
}


console.log('Server listening on http://localhost:' + port);