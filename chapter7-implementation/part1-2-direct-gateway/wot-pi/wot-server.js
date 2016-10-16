var httpServer = require('./servers/http'),
	wsServer = require('./servers/websockets'),
	resources = require('./resources/model');

var pirPlugin = require('./plugins/internal/pirPlugin'),
	ledsPlugin = require('./plugins/internal/ledsPlugin'),
	dhtPlugin = require('./plugins/internal/DHT22SensorPlugin');
	coapPlugin = require('./plugins/external/coapPlugin');


pirPlugin.start({'simulate': true, 'frequency': 2000});
ledsPlugin.start({'simulate': true, 'frequency': 10000});
dhtPlugin.start({'simulate': true, 'frequency': 10000});
coapPlugin.start({'simulate': false, 'frequency': 10000});

var server = httpServer.listen(resources.pi.port, function(){
	console.log('HTTP server started...');
	wsServer.listen(server);
	console.info('Your WoT Pi is up and running on port %s', resources.pi.port);
});

