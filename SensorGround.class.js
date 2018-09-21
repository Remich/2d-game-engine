/* (c)opyright 2018 René Michalke */

var SensorGround = function(i) {

	var that = EngineSensor(i);

	// name to identify this sensor
	that.name						= 'SensorGround';
	// declare of which type this sensor is
	that.type           = 'ground';
	// declare which objects can collide with this sensor
	that.match_objects  = ["char", "beatnik", "ringbounce"];
	// declare of which type the other sensor has to be
	that.match_sensors  = ["ground"];

	return that;

};
