
import { ObjectStatic } from './ObjectStatic.class.js'
import { EngineStateMachine } from './EngineStateMachine.class.js';
import { SensorGround } from './SensorGround.class.js';

var ObjectGround = function() {

	var that = new ObjectStatic();

	that.bootstrap = "new ObjectGround()";
	that.default_sensor_height = 128;

	that.name = 'ground';
	that.in_air = false;
	that.rolling = false;

	that.get_state = function() {
	};

	that.Chill = function() {
		var foobar = {};

		foobar.id = 0;
		foobar.name = 'Chill';
		foobar.image = new Image();
		foobar.image.src = 'images/Ground.png';
		foobar.breakable = function(foo) { return true; };
		foobar.loop = false;
		foobar.length = 1;

		foobar.frames = [];

		foobar.frames[0] = [];
		foobar.frames[0].width = 256;
		foobar.frames[0].height = 190;
		foobar.frames[0].margin = 0;

		foobar.enter = function(sm, obj) {
			obj.frame = 0;
		};
		foobar.update = function(sm, obj) {
		};
		foobar.exit = function(sm) {
		};

		return foobar;

	};

	that.initSensors = function() {

		that.sensors = [];

		for(var i=0; i<that.heightMaps['floor'].length; i++) {

			var new_sensor = SensorGround(i);

			// TODO wrong place , this first update should be taken care of by the engine
			new_sensor.update(that);	// important!
			

			new_sensor.setHeight(that.default_sensor_height);
			that.sensors.push(new_sensor);
		}
	};

	that.initFlippedSensors = function() {

		that.sensors_flipped = [];

		for(var i=that.heightMaps['floor'].length-1; i>=0; i--) {

			var new_sensor = SensorGround(i);

			// TODO wrong place , this first update should be taken care of by the engine
			new_sensor.update(that);	// important!
			

			new_sensor.setHeight(that.default_sensor_height);
			that.sensors_flipped.push(new_sensor);
		}

	};

	that.heightMaps['floor'] = [ 
		
		// real heightmap:
		// 
		// 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 
		// 4, 4, 4, 4, 4, 4, 1, 1, 1, 1, 
		// 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 
		// 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 
		// 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 
		// 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 
		// 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 
		// 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 
		// 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 
		// 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 
		// 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 
		// 4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 
		// 4, 4, 4, 4, 4, 4, 4, 4, 3, 3, 
		// 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 
		// 4, 4, 4, 4, 3, 3, 3, 3, 3, 3, 
		// 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 
		// 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 
		// 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 
		// 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 
		// 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 
		// 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 
		// 2, 2, 2, 2, 2, 2, 4, 4, 4, 4, 
		// 4, 4, 4, 4, 3, 3, 3, 3, 3, 3, 
		// 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 
		// 4, 4, 4, 4, 4, 4, 4, 4, 2, 2, 
		// 2, 2, 2, 2, 2, 2, ];
		 
		// make it even:
		3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 
		4, 4, 4, 4, 4, 4, 3, 3, 3, 3, 
		3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 
		3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 
		3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 
		3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 
		3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 
		2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 
		3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 
		3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 
		3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 
		3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 
		3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 
		3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 
		3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 
		3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 
		3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 
		3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 
		3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 
		3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 
		3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 
		3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 
		3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 
		3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 
		3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 
		2, 2, 2, 2, 2, 2, ];


	/*
	 * Create new State Machine
	 */
	that.sm = new EngineStateMachine();
	that.sm.changeState( that.Chill(), that );

	return that;

};

export { ObjectGround }
