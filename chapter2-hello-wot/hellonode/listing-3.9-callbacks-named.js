var http = require('http');
var request = require('request');
var fs = require('fs');

var port = 8787;
var serviceRootUrl = 'http://localhost:8686';

http.createServer(function(servReq, servResp){
	console.log('New incoming client request');
	if(servReq.url === '/log'){
		getTemperature(servResp)
	} else {
		servResp.writeHeader(200, {"Content-Type":"text/plain"});
		servResp.write("Please use /log");
		servResp.end();
	}
}).listen(port);

function getTemperature(servResp){
	request({url:serviceRootUrl + "/temperature", json:true}, function(err, resp, body){
		if(err) throw err;
		if(resp.statusCode === 200){
			console.log(body);
			var temperature = body.temperature;

			getLight(servResp, temperature);
		}
	});
}

function getLight(servResp, temperature){
	request({url:serviceRootUrl + "/light", json:true}, function(err, resp, body){
		if(err) throw err;
		if(resp.statusCode === 200){
			console.log(body);
			var light = body.light;
			logValuesReply(servResp, temperature, light);
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