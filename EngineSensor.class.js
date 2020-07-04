var EngineSensor = function(i) {

	var that            = {};

	// name to identify this sensor
	that.name						= 'EngineDefaultSensor';

	// declare of which type this sensor is
	that.type           = 'ground';

	// declare which objects can collide with this sensor
	that.match_objects  = ["char", "beatnik", "ringbounce"];

	// declare of which type the other sensor has to be
	that.match_sensors  = ["ground"];
	that.x              = null;
	that.y              = null;
	that.width          = 1;
	that.height         = 256;

	// set of Objects are colliding with this sensor
	that.colliding_with = new Set();

	//  do something while collision
	that.collide        = function() {};

	/*
	 * method to update position of this sensor
	 */
	that.update = function(obj) {
		that.x      = obj.x + i;
		that.y      = obj.y + obj.heightMaps['floor'][i];
	};

	that.setHeight = function(val) {
		that.height = val;
	};

	that.setWidth = function(val) {
		that.width = val;
	};

	return that;

};

export { EngineSensor }
