var utils = require('./../../utils/utils.js'),
	resources = require('./../../resources/model');

var interval, me,pluginName, pollInterval;
var localParams = {'simulate': false, 'frequency': 5000};

function configure(app){
	utils.addDevice('coapDevice', 'A CoAP device', 'A CoAP device',
		{
			'co2':{
				'name' : 'CO2 sensor',
				'description': 'An ambient CO2 sensor',
				'unit': 'ppm',
				'value': 0 
			}
		});
	me = resources.things.coapDevice.sensors.co2;
	pluginName = resources.things.coapDevice.name;
};

exports.start = function (params, app) {
	localParams = params;
	configure();
	if(localParams.simulate){
		simulate();
	} else {
		connectHardware();
	}
};

exports.stop = function() {
	if(localParams.simulate){
		clearInterval(interval);
	} else {
		clearInterval(pollInterval);
	}
	console.info('%s plugin stopped!', pluginName);
};

function connectHardware() {
	var coap = require('coap'),
		bl = require('bl');

	var sensor = {
		read: function() {
			coap
				.request({
					host: 'localhost',
					port: 5683,
					pathname: 'co2',
					options: {'Accept': 'application/json'}
				})
				.on('response', function(res){
					console.info('CoAP response code', res.code);
					if(res.code !== '2.05'){
						console.log('Error while contacting CoAP service: %s', res.code);
					}
					res.pipe(bl(function (err, data) {
						var json = JSON.parse(data);
						me.value = json.co2;
						showValue();
					}));
				})
				.end();
		}
	};
	pollInterval = setInterval(function () {
		sensor.read();
	}, localParams.frequency);
};

function simulate() {
	interval = setInterval(function (){
		me.co2 = utils.randomInt(0, 1000);
		showValue();
	}, localParams.frequency);
	console.info('Simulated %s sensor started', pluginName);
};

function showValue() {
	console.info('CO2 Level: %s ppm', me.value);
};