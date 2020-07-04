import { EngineSensor } from './EngineSensor.class.js';

var SensorGround = function(i) {

	var that = EngineSensor(i);

	that.name						= 'SensorGround';
	that.type           = 'ground';
	that.match_objects  = ["char", "beatnik", "ringbounce"];
	that.match_sensors  = ["ground"];

	return that;

};

export { SensorGround }
