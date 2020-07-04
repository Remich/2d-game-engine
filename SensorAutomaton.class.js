var SensorAutomaton = function( ) {

	var that = EngineSensor(0);

	// name to identify this sensor
	that.name						= 'SensorAutomaton'
	// declare of which type this sensor is
	that.type           = 'automaton';
	// declare which objects can collide with this sensor
	that.match_objects  = ["char", "beatnik", "ringbounce", "ground" ];
	// declare of which type the other sensor has to be
	that.match_sensors  = ["ground", "object"];

	that.update = function(obj) {
		that.x      = obj.x;
		that.y      = obj.y; 
	};

	return that;

};
