import { EngineSensor } from './EngineSensor.class.js';

var SensorObject = function(i) {

	var that = EngineSensor(i);

	that.name						= 'SensorObject';
	that.type           = 'object';
	that.match_objects  = ["beatnik", "ringbounce"];
	that.match_sensors  = ["object"];

	// possible values: 0 - 0.5
	that.shrink_factor_x = 0.15;
	// possible values: 0 - 0.5
	that.shrink_factor_y = 0.15;

	that.update = function(x, y, width, height) {
		var shrink_x = that.shrink_factor_x * width;
		var shrink_y = that.shrink_factor_y * height;
		that.x = x + shrink_x;
		that.y = y + shrink_y;
		that.width = width - 2 * shrink_x;
		that.height = height - 2 * shrink_y;
	};

	return that;

};

export { SensorObject }
