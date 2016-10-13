var resources = require('./../../resources/model'),
	utils = require('./../../utils/utils.js');

var interval, sensor;
var model = resources.pi.sensors;
var pluginName = 'Temperature & Humidity';
var localParams = {'simulate': false, 'frequency': 5000};

exports.start = function (params) {
	localParams = params;
	if(localParams.simulate){
		simulate();
	} else {
		connectHardware();
	}
};

exports.stop = function () {
	if(localParams.simulate){
		clearInterval(interval);
	} else {
		sensor.unexport();
	}
	console.info('%s plugin stopped!', pluginName);
};

function connectHardware() {
	/* TODO */
};

function simulate() {
	interval = setInterval(function (){
		model.temperature.value = utils.randomInt(0, 40);
		model.humidity.value = utils.randomInt(0, 100);
		showValue();
	}, localParams.frequency);
	console.info('Simulated %s sensor started', pluginName);
};

function showValue() {
	console.info('Temperature: %s C, humidity %s \%',
		model.temperature.value, model.humidity.value);
};