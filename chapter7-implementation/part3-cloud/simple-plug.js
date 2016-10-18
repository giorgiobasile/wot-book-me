var mqtt = require('mqtt');

var config = require('./config.json');
var thngId = config.thngId; 
var thngUrl = '/thngs/' + thngId;
var thngApiKey = config.thngApiKey;
var interval;

console.log('Using Thng #' + thngId + ' with API key ' + thngApiKey);

var client = mqtt.connect("mqtts://mqtt.evrythng.com:8883", {
	username: 'authorization',
	password: thngApiKey
});

client.on('connect', function(){
	client.subscribe(thngUrl + '/properties/');
	updateProperty('livenow', true);
	if(!interval) interval = setInterval(updateProperties, 5000);
});

client.on('message', function(topic, message){
	console.log(message.toString());
});

function updateProperties() {
	var voltage = (219.5 + Math.random()).toFixed(3);
	updateProperty('voltage', voltage);

	var current = (Math.random() * 10).toFixed(3);
	updateProperty('current', current);

	var power = (voltage * current * (0.6 + Math.random() / 10)).toFixed(3);
  	updateProperty('power', power);

}

function updateProperty(property, value){
	client.publish(thngUrl + '/properties/' + property, '[{"value":' + value + '}]');
}

process.on('SIGINT', function () {
	clearInterval(interval);
	updateProperty('livenow', false);
	client.end();
	process.exit();
});