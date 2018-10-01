/* (c)opyright 2018 René Michalke */

	var ObjectRingBouncing = function() {

	var that = new Object();

	that.name = 'ringbounce';
	that.solid = true;
	that.in_air = true;
	that.rolling = false;
	that.grv = 1 * 0.09375;

	that.collide = function() {

		/*
		 * check if Sensors 'ground' are colliding
		 */
		if(that.colliding_sensors.has('AB')) {
			that.GroundSensorCollide();	
		}

	};

	that.GroundSensorCollide = function() {

			
		/*
		 * Bouncing
		 */
		if(Math.abs(that.speed_y) > 2) {
			that.speed_y *= -0.75;
			return;
		} 

		/*
		 * calculate the heightMapValue
		 */
		var ar_r = Array.from(that.sensors[1].colliding_with);
		var match = ar_r[0];
		var heightMapIndex = floor(that.sensors[1].x - match.x);

		/*
		 * Collision with Object which has no heightMap
		 * ABORT
		 */
		if(match.heightMaps['floor'] === undefined) {
			return;
		}

		var heightMapValue = match.heightMaps['floor'][heightMapIndex];

		/*
		 * update Object Properties
		 */
		// TODO this should be implemented via a property in the Objects of type "ground"
		// something like a collision-direction
		if(that.speed_y < 0 && that.y > (match.y + heightMapValue) ) {
			console.log("falsing in " + match.name);
			return false;
		}
		if(that.y < match.y + heightMapValue - that.getHeight()) {
			console.log("falsing-2 in " + match.name);
			return false;
		}
		
		that.in_air = false;
		that.isOnSlope = true;
	
		// set y-position according to heightMap 
		that.y = match.y + heightMapValue - that.sm.currentState.frames[floor(that.frame)].height;

		// change y-offset according to current angle
		let offset_y = (that.getHeight() / 4) * Math.sin(that.angle / 180) * Math.PI;

		if(that.angle < 0) {
			offset_y *= -1;
		}

		that.y += offset_y;

		// update sensor positions
		that.updateSensors();

	};

	that.get_state = function() {
	};

	that.Bounce = function(obj) {

		var foobar = {};

		foobar.id = 0;
		foobar.name = 'Bounce';
		foobar.image = new Image();
		foobar.image.src = 'images/ring-chill.png';
		foobar.breakable = function(foo) { return true; };
		foobar.loop = true;
		
		
		foobar.length = 4;

		foobar.frames = new Array();

		foobar.frames[0] = new Array();
		foobar.frames[0].width = 32;
		foobar.frames[0].height = 32;
		foobar.frames[0].margin = 0;

		foobar.frames[1] = new Array();
		foobar.frames[1].width = 32;
		foobar.frames[1].height = 32;
		foobar.frames[1].margin = 1;

		foobar.frames[2] = new Array();
		foobar.frames[2].width = 32;
		foobar.frames[2].height = 32;
		foobar.frames[2].margin = 1;

		foobar.frames[3] = new Array();
		foobar.frames[3].width = 28;
		foobar.frames[3].height = 32;
		foobar.frames[3].margin = 1;

		foobar.enter = function(sm, obj) {
			obj.frame = 0;
			obj.gameframe = 0;
		};
		foobar.update = function(sm, obj) {
			that.physics();
			if(floor(obj.gameframe++) >= 256) {
				obj.destroy = true;
			}
		};
		foobar.exit = function(sm) {
		};

		return foobar;
	};


	that.Collect = function(obj) {

		var foobar = {};

		foobar.id = 1;
		foobar.name = 'Collect';
		foobar.image = new Image();
		foobar.image.src = 'images/ring-collect.png';
		foobar.breakable = function(foo) { return false; };
		foobar.loop = true;
		
		
		foobar.length = 4;

		foobar.frames = new Array();

		foobar.frames[0] = new Array();
		foobar.frames[0].width = 32;
		foobar.frames[0].height = 32;
		foobar.frames[0].margin = 0;

		foobar.frames[1] = [];
		foobar.frames[1].width = 32;
		foobar.frames[1].height = 32;
		foobar.frames[1].margin = 10;

		foobar.frames[2] = [];
		foobar.frames[2].width = 32;
		foobar.frames[2].height = 32;
		foobar.frames[2].margin = 10;

		foobar.frames[3] = [];
		foobar.frames[3].width = 32;
		foobar.frames[3].height = 32;
		foobar.frames[3].margin = 10;

		foobar.enter = function(sm, obj) {
			obj.frame = 0;
			obj.gameframe = 0;
			obj.solid = false;
		};
		foobar.update = function(sm, obj) {
			if(floor(obj.gameframe++) >= 16) {
				obj.destroy = true;
			}
			obj.speed_x = 0;
			obj.speed_y = 0;
		};
		foobar.exit = function(sm, obj) {
		};

		return foobar;
	};


	var ObjectSensor_Ring = function() {

		var bar = new SensorObject();
		bar.match_objects  = ["char"];

		return bar;
	};


	var ObjectSensor_AB = function() {
	
		var bar = new SensorFloor();
		bar.name = "AB";
		bar.update = function(x, y, center, height) {

			bar.x = that.getCenter();
			bar.y = y + height;

			bar.width = 1;
			if(that.in_air === true) {
				bar.height = 16;
				that.isOnSlope = false;
			}
			if(that.isOnSlope === true) {
				bar.height = 128;
			} 

		};

		return bar;	
	};


	that.initSensors = function() {

		that.sensors = [];

		var sensor = new ObjectSensor_Ring();

		sensor.update(
			that.x,
			that.y,
			that.getWidth(),
			that.getHeight()	
		);

	 	that.sensors.push(sensor);

		var sensor_ground = new ObjectSensor_AB();

		sensor.update(
			that.x,
			that.y,
			that.getWidth(),
			that.getHeight()	
		);

	 	that.sensors.push(sensor_ground);
	};

	that.updateSensors = function() {
		var width = that.getWidth();
		var height = that.getHeight();
		that.sensors[0].update(that.x, that.y, width, height);
		that.sensors[1].update(that.x, that.y, width, height);
	};

	
	/*
	 * Create new State Machine
	 */
	that.sm = new EngineStateMachine();
	that.sm.changeState( new that.Bounce(), that );

	return that;

};
