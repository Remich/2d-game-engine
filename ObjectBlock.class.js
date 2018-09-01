/* (c)opyright 2018 René Michalke */

var ObjectBlock = function() {

	// var that = new ObjectStatic();
	var that = new AbstractGround();

	that.name = 'ground'; // or 'ground'

	// that.collide = function( obj ) {
		// return that.parentCollide( obj );
	// };
	that.in_air = false;
	that.rolling = false;

	that.get_state = function() {
	};

	that.Chill = function() {
		var foobar = {};

		foobar.id = 0;
		foobar.name = 'Chill';
		foobar.image = new Image();
		foobar.image.src = 'images/Block.png';
		foobar.breakable = function(foo) { return true; };
		foobar.loop = false;
		foobar.length = 1;

		foobar.frames = [];

		foobar.frames[0] = [];
		foobar.frames[0].width = 256;
		foobar.frames[0].height = 256;
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

			var sensor = {};
			sensor.x = null;
			sensor.y = null;
			sensor.width = 1;
			sensor.height = 128;

			// TODO: better names for .sensor_type, .type, .type_other
			// declare which objects can collide with this sensor
			sensor.sensor_type = ["char", "beatnik", "ringbounce"];
			// declare of which type this sensor is
			sensor.type = 'ground';
			// declare of which type the other sensor has to be
			sensor.type_other = ["ground"];

			sensor.collide = function(obj, b) {
				// that.collide(b, obj);
			};

			sensor.update = function(x, y, width, height) {
				sensor.x = x + i;
				sensor.y = y + that.heightMaps['floor'][i];// + 12; // + 12 if in grass or something
				sensor.width = 1; 
				sensor.height = 128;
			};

			sensor.update( that.x, that.y, that.sm.currentState.frames[floor(that.frames)].width, that.sm.currentState.frames[floor(that.frame)].height );
			that.sensors.push(sensor);
		}
	};

	that.updateSensors = function() {
		var width = that.sm.currentState.frames[floor(that.frame)].width;
		var height = that.sm.currentState.frames[floor(that.frame)].height;
		for (var a in that.sensors) {
			that.sensors[a].update(that.x, that.y, width, height);
		}
	};

	that.resetSensors = function() {
		for (var a in that.sensors) {
			that.sensors[a].colliding = false;
		}
		return true; 
	};

	that.heightMaps = Array();
	that.angleMaps = Array();
	
	that.heightMaps['floor'] = [ 
		19, 19, 19, 19, 19, 19, 19, 19, 8, 8, 
		8, 8, 8, 8, 8, 8, 4, 4, 4, 4, 
		4, 4, 4, 4, 3, 3, 3, 3, 3, 3, 
		3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 
		3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 
		1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 
		2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 
		1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 
		4, 4, 4, 4, 3, 3, 3, 3, 3, 3, 
		3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 
		2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 
		4, 4, 4, 4, 4, 4, 4, 4, 3, 3, 
		3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 
		1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 
		2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 
		1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 
		4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 
		4, 4, 4, 4, 4, 4, 4, 4, 9, 9, 
		9, 9, 9, 9, 9, 9, ];

	that.angleMaps['floor'] = [ 
		360, 360, 360, 360, 290, 290, 290, 290, 360, 360, 
		360, 360, 315, 315, 315, 315, 360, 360, 360, 360, 
		346, 346, 346, 346, 360, 360, 360, 360, 374, 374, 
		374, 374, 360, 360, 360, 360, 346, 346, 346, 346, 
		360, 360, 360, 360, 333, 333, 333, 333, 360, 360, 
		360, 360, 374, 374, 374, 374, 360, 360, 360, 360, 
		360, 360, 360, 360, 360, 360, 360, 360, 360, 360, 
		360, 360, 360, 360, 360, 360, 360, 360, 360, 360, 
		360, 360, 360, 360, 346, 346, 346, 346, 360, 360, 
		360, 360, 397, 397, 397, 397, 360, 360, 360, 360, 
		346, 346, 346, 346, 360, 360, 360, 360, 333, 333, 
		333, 333, 360, 360, 360, 360, 374, 374, 374, 374, 
		360, 360, 360, 360, 360, 360, 360, 360, 360, 360, 
		360, 360, 360, 360, 360, 360, 360, 360, 360, 360, 
		360, 360, 360, 360, 360, 360, 360, 360, 346, 346, 
		346, 346, 360, 360, 360, 360, 397, 397, 397, 397, 
		360, 360, 360, 360, 346, 346, 346, 346, 360, 360, 
		360, 360, 333, 333, 333, 333, 360, 360, 360, 360, 
		374, 374, 374, 374, 360, 360, 360, 360, 360, 360, 
		360, 360, 360, 360, 360, 360, 360, 360, 360, 360, 
		360, 360, 360, 360, 360, 360, 360, 360, 360, 360, 
		360, 360, 346, 346, 346, 346, 360, 360, 360, 360, 
		397, 397, 397, 397, 360, 360, 360, 360, 346, 346, 
		346, 346, 360, 360, 360, 360, 374, 374, 374, 374, 
		360, 360, 360, 360, 411, 411, 411, 411, 360, 360, 
		360, 360, 360, 360, 360, 360, ];

	return that;

};
