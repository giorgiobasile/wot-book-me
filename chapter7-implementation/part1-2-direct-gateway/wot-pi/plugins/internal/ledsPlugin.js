var resources = require('./../../resources/model')

var interval, actuator;
var model = resources.pi.actuators.leds['1'];
var pluginName = model.name;
var localParams = {'simulate': false, 'frequency': 2000};

exports.start = function (params) {
	localParams = params;
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
		actuator.unexport();
	}
	console.info('%s plugin stopped!', pluginName);
};

function connectHardware() {
	/* TODO */
};

function simulate() {
	interval = setInterval(function (){
		model.value = !model.value;
		showValue();
	}, localParams.frequency);
	console.info('Simulated %s actuator started', pluginName);
};

function showValue() {
	console.info(model.value ? 'LED ON' : 'LED OFF');
};