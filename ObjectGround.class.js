ObjectGround = function() {

	var that = new AbstractGround();

	that.name = 'ground'; // or 'ground'

		// BOOKMARK#1
		// * parent ObjectStatic should not implement collision stuff
		// * ObjectStatic shouldn't even be the parent of ObjectGround
		//		-> ObjectGround, ObjectSlope, ObjectBlock need new parent which acts out collisions of type Ground
	//
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

			var sensor = {};
			sensor.x = null;
			sensor.y = null;
			sensor.width = 1;
			sensor.height = 256;
			sensor.sensor_type = ["char", "beatnik", "ringbounce"];
			sensor.type = "ground";
			sensor.type_other = ["ground", "heightMap"];
			sensor.collide = function(obj, b) {
				// that.collide(b, obj);
			};

			sensor.update = function(x, y, width, height) {
				sensor.x = x + i;
				sensor.y = y + that.heightMaps['floor'][i];// + 12; // + 12 if in grass or something
				sensor.width = 1; 
				sensor.height = 256;
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
		3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 
		4, 4, 4, 4, 4, 4, 1, 1, 1, 1, 
		1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 
		3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 
		3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 
		3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 
		1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 
		2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 
		3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 
		2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 
		3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 
		4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 
		4, 4, 4, 4, 4, 4, 4, 4, 3, 3, 
		3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 
		4, 4, 4, 4, 3, 3, 3, 3, 3, 3, 
		3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 
		2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 
		3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 
		3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 
		3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 
		2, 2, 2, 2, 2, 2, 4, 4, 4, 4, 
		4, 4, 4, 4, 3, 3, 3, 3, 3, 3, 
		3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 
		4, 4, 4, 4, 4, 4, 4, 4, 2, 2, 
		2, 2, 2, 2, 2, 2, ];

	that.angleMaps['floor'] = [ 
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
		0, 0, 0, 0, 0, 0, ];

	return that;

};
