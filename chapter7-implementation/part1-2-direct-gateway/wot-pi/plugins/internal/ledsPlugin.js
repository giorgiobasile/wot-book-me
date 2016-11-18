var resources = require('./../../resources/model')

var interval, actuator;
var model = resources.pi.actuators.leds['1'];
var pluginName = model.name;
var localParams = {'simulate': false, 'frequency': 2000};

exports.start = function (params) {
	localParams = params;
	observe(model);

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

function observe(what){
	Object.observe(what, function(changes){
		console.info('Change detected by plugin for %s...', pluginName);
		switchOnOff(model.value);
	});
}

function switchOnOff(value){
	if(!localParams.simulate){
		actuator.write(value === true ? 1 : 0, function(){
			console.info('Changed value of %s to %s', pluginName, value);
		});
	}
};

function connectHardware() {
	var Gpio = require('onoff').Gpio;
  actuator = new Gpio(model.gpio, 'out');
  console.info('Hardware %s actuator started!', pluginName);
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
