/* (c)opyright 2018 René Michalke */

var ObjectBeatnik = function() {

	var that = new Object();

	that.bootstrap = 'new ObjectBeatnik()';
	that.name = 'beatnik';

	that.collide = function( obj ) {

		/*
		 * check if Sensors 'ground' are colliding
		 */
		if(that.colliding_sensors.has('AB')
			|| that.colliding_sensors.has('BB')) {
			that.GroundSensorCollide();	
		}
		
		/*
		 * check if Sensor 'object' is colliding
		 */
		if(that.colliding_sensors.has('CB')) {
			that.ObjectSensorCollide();
		}


	};

	that.ObjectSensorCollide = function() {

		that.sensors[2].colliding_with.forEach(function(match) {

			if ((match.sm.currentState.name === 'Jump' &&
				match.speed_y > 0) ||
				match.sm.currentState.name === 'Roll') {
				that.replace = new ObjectExplosion();
				that.replace.x = that.x;
				that.replace.y = that.y;
				that.replace.id = that.id;
				that.replace.zindex = 2;
				that.replace.sm.changeState( that.replace.Explode(), that.replace );
				that.destroy = true;
				match.speed_y = -1 * match.speed_y;
				return;
			}

			if(match.recover === true) {
				return; 
			}

			if (match.name === "char") {
				match.recover = true;
				match.callback = match.RingLossReal;
				match.sm.changeState( new match.RingLoss(), match);

				// compute enemy direction
				var x = match.x - that.x;
				// TODO: fix this
				match.enemy_direction = x > 0 ? 1 : x < 0 ? -1 : 0;
				return;
			}

		}, that);
	
	};

	that.GroundSensorCollide = function() {


		// here we store the index of the heightMap, to decide the new y-position
		var heightMapIndex;
		// here we store the Object, of which the heightMap will be used
		var match;
		// here we store the new y-position for our object
		var heightMapValue; 

		/*
		 * check which Ground Sensors are colliding
		 * and calculate the heightMapValue accordingly
		 */
		if(that.colliding_sensors.has('AB') === true
				&& that.colliding_sensors.has('BB') === true) {

			// both Ground Sensors are colliding
			console.log("both ground sensors");

			// calculate the center of both Ground Sensors
			var sensorCenter = floor((that.sensors[0].x-that.x + that.sensors[1].x-that.x) / 2 + that.x);

			// set angle according to the heightMap value of the ground-sensors
			let angleNew = that.calculateAngle(
											that.sensors[0].getNewPositionAfterCollision(), 
											that.sensors[1].getNewPositionAfterCollision()
										);
		
			// if((angleNew >= 0 && angleNew <= 5)
				// || (angleNew < 0 && angleNew >= -5)) {
				// // ... 
			// } else
				that.angle = angleNew;


			/*
			 * are both Sensors colliding with the same Object?
			 * TODO: the following will cause issues, 
			 *				if one or both sensors is/are colliding with multiple Objects
			 *				unless we implement something like a collision priority, which states
			 *				the precedence of collision.
			 *				If the implementation makes sure that the prioritized Objects is always at Index 0
			 *				we should be good to go.
			 */
			var ar_r = Array.from(that.sensors[0].colliding_with);
			var ar_l = Array.from(that.sensors[1].colliding_with);
			if(ar_r[0] === ar_l[0]) {

				// both Sensors are colliding with the same Object

				// it doesn't matter if we  use ar_r or ar_l
				match = ar_r[0];
				heightMapIndex = sensorCenter - match.x;
			} else {

				// each Sensor is colliding with a different Object
				
				// decide which Object's heightMap to use
				if(sensorCenter < ar_r[0].x
					&& sensorCenter > ar_l[0].x + ar_l[0].getWidth()) {
					// sensorCenter is in a gap between the Objects
					
					// check to which Object sensorCenter is closer
					var closeness_l = sensorCenter - (ar_l[0].x + ar_l[0].getWidth());
					var closeness_r = ar_r[0].x - sensorCenter;

					if(closeness_l < closeness_r) {
						match = ar_l[0];
						heightMapIndex = ar_l[0].getWidth() - 1;
					} else {
						match = ar_r[0];
						heightMapIndex = 0;
					}
				
				} else if(sensorCenter < ar_l[0].x + ar_l[0].getWidth()) {
					// left side
					match = ar_l[0];
					heightMapIndex = sensorCenter - match.x;
				} else { 
					// right side	
					match = ar_r[0];
					heightMapIndex = sensorCenter - match.x;
				}

			}

			
		} else if(that.colliding_sensors.has("AB")) {

			// only Left Ground Sensor is colliding
			console.log("only right ground sensor");

			var ar_r = Array.from(that.sensors[0].colliding_with);
			match = ar_r[0];
			heightMapIndex = that.sensors[0].x - match.x;
			
		} else if(that.colliding_sensors.has("BB")) {

			// only Right Ground Sensor is colliding
			console.log("only left ground sensor");

			var ar_l = Array.from(that.sensors[1].colliding_with);
			match = ar_l[0];
			heightMapIndex = that.sensors[1].x - match.x;
			
		}


		/*
		 * Collision with Object which has no heightMap
		 * ABORT
		 */
		if(match.heightMaps['floor'] === undefined) {
			return;
		}

		heightMapValue = match.heightMaps['floor'][heightMapIndex];

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
	
		console.log(that.name);

		
		// not when crouching
		if(that.sm.currentState === 'Crouch')
			return false;

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

	that.calculateAngle = function(pt1, pt2) {
		return round( Math.atan2( pt1.y - pt2.y, pt1.x - pt2.x) * (180/Math.PI));
	};

	/**
	 * Floor Sensor A (the one on the right side)
	 */
	var ObjectSensor_AB = function() {
	
		var bar = new SensorFloor();
		bar.name = "AB";
		bar.update = function(x, y, center, height) {

			bar.x = that.getCenter() + 16;
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

	/*
	 * Floor Sensor B (the one on the left side)
	 */
	var ObjectSensor_BB = function() {
	
		var bar = new SensorFloor();
		bar.name = "BB";
		bar.update = function(x, y, center, height) {

			bar.x = that.getCenter() - 16;
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

	/*
	 * Object Sensor
	 */
	var ObjectSensor_CB = function() {

		var bar = new SensorObject();
		bar.name = "CB";

		return bar;	
	};

	that.initSensors = function() {

		that.sensors = [];
	 	that.sensors.push(new ObjectSensor_AB());
	 	that.sensors.push(new ObjectSensor_BB());
	 	that.sensors.push(new ObjectSensor_CB());

		return true;
	};

	that.updateSensors = function() {
		var center = that.getCenter();
		var height = that.getHeight();

		that.sensors[0].update(round(that.x), that.y, center, height);
		that.sensors[1].update(round(that.x), that.y, center, height);
		that.sensors[2].update(round(that.x), that.y, that.getWidth(), height);
	};

	that.get_state = function() {
	};

	that.isOnEdge = function() {
		if ((that.sensors[0].colliding && !that.sensors[1].colliding) ||
			(!that.sensors[0].colliding && that.sensors[1].colliding)) {
			return true;
		}
		return false;
	};

	that.Beat = function(obj) {

		var foobar = {};

		foobar.id = 0;
		foobar.name = 'Beat';
		foobar.image = new Image();
		foobar.image.src = 'images/beatnik.png';
		foobar.breakable = function(foo) { return true; };
		foobar.loop = true;
		foobar.top = 3;
		
		foobar.length = 4;
		foobar.frames = new Array();
		foobar.frames[0] = new Array();
		foobar.frames[0].width = 80;
		foobar.frames[0].height = 58;
		foobar.frames[0].margin = 0;
		foobar.frames[1] = new Array();
		foobar.frames[1].width = 80;
		foobar.frames[1].height = 58;
		foobar.frames[1].margin = 16;
		foobar.frames[2] = new Array();
		foobar.frames[2].width = 80;
		foobar.frames[2].height = 58;
		foobar.frames[2].margin = 14;
		foobar.frames[3] = new Array();
		foobar.frames[3].width = 80;
		foobar.frames[3].height = 58;
		foobar.frames[3].margin = 16;

		foobar.enter = function(sm, obj) {
			obj.frame = 0;
		};
		foobar.update = function(sm, obj) {

			if(obj.isOnEdge() === true) {

				if(obj.flipped === true) {
					obj.flipped = false;
					obj.speed_x *= -1;
				} else {
					obj.flipped = true
					obj.speed_x *= -1;
				}

			}

			if(obj.flipped === false)
				obj.speed_x += obj.acc;
			else
				obj.speed_x -= obj.acc;
		};

		foobar.exit = function(sm) {
		};

		return foobar;
	};



	/*
	 * Create new State Machine
	 */
	that.sm = new EngineStateMachine();
	that.sm.changeState( that.Beat(), that );

	return that;

};
