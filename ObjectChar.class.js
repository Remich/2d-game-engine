 
/* (c)opyright 2018 René Michalke */

//SPG:Solid Tiles
//SPG:Running (DONE)
//SPG:Jumping (DONE)
//SPG:Rolling (DONE)
//SPG:Ring Loss
//SPG:Underwater
//SPG:Springs and Things
//SPG:Super Speeds
//SPG:Special Abilities
//SPG:Camera
//SPG:Getting Hit
//SPG:Rebound
//SPG:Animations (new)
//SPG:Game Objects (new - updated with bridges)

var ObjectChar = function() {

	var that = new ObjectWithInput();

	that.rolling = false;
	that.rings = 0;
	that.name = 'char';

	that.collide = function() {

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

			/*
			 * Ring Collision
			 */
			if(match.name === "ring") {
				if(that.recover === false) {
					match.sm.changeState( new match.Collect(that), match );
					that.rings++;
				}	
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

		// set y-position according to heightMap 
		that.y = match.y + heightMapValue - that.sm.currentState.frames[floor(that.frame)].height;

		// change y-offset according to current angle
		that.y += (that.getHeight() / 2) * Math.sin(that.angle / 180) * Math.PI;

		// update sensor positions
		that.updateSensors();
	};

	that.calculateAngle = function(pt1, pt2) {
		return round( Math.atan2( pt1.y - pt2.y, pt1.x - pt2.x) * (180/Math.PI));
	};


	/**
	 * Ground Sensor A (the one on the right side)
	 * Sensor Coordinates are relative to the top-left coordinates of the object
	 *
	 * @class      ObjectSensor_A
	 */
	ObjectSensor_AB = function() {
		this.name           = 'AB';
		// declare of which type this sensor is
		this.type           = 'ground'
		// declare which objects can collide with this sensor
		this.match_objects  = ["ground", "slope"];
		// declare of which type the other sensor has to be
		this.match_sensors  = ["ground"];
		this.x              = null;
		this.y              = null;
		this.width          = null;
		this.height         = null;
		this.colliding_with = new Set();
		/*
		 * TODO move to new Object: ObjectSensorGround;
		 */
		this.getNewPositionAfterCollision = function() {

			/*
			 * This Sensor has no Collisions
			 */
			if(this.colliding_with.size === 0) {

				// return current values
				return new Point(this.x, this.y);
			}


			/*
			 * Calculate the new Y-Position
			 */
			let ar = Array.from(this.colliding_with);
			let heightMapIndex = this.x - ar[0].x;
			let newYPosition = ar[0].y + ar[0].heightMaps['floor'][heightMapIndex];

			return new Point( this.x, newYPosition );

		};
	};

	ObjectSensor_AB.prototype.update = function(x, y, center, height) {

		this.x = x + 32 + 8;
		this.y = y + height;

		this.width = 1;
		if(that.in_air === true) {
			this.height = 16;
			that.isOnSlope = false;
		}
		if(that.isOnSlope === true) {
			this.height = 128;
		} 

	};
	ObjectSensor_AB.prototype.collide = function(obj, b) {
	}; 

	// ObjectSensor_A_Right = function() {
	// 	this.x = null;
	// 	this.y = null;
	// 	this.width = null; 
	// 	this.height = null;
	// 	this.match_objects = "ground";
	// };
	// ObjectSensor_A_Right.prototype.update = function(x, y, center, height) {

	// 	this.x = x + 64 + 8;
	// 	this.y = y + 18;
	// 	this.height = 3;

	// 	this.width = 16;
	// 	if(that.in_air === true) {
	// 		this.width = 16;
	// 		that.isOnSlope = false;
	// 	}
	// 	if(that.isOnSlope === true) {
	// 		this.width = 16;
	// 	}

	// };
	// ObjectSensor_A_Right.prototype.collide = function(obj, b) {
	// 	if (b.solid !== true) {
	// 		return false;
	// 	}

	// 	if(obj.mode !== 'right-wall') {
	// 		return false;
	// 	}

	// 	// the following replaces call "b.collide(obj, b);" of b object type Slope
	// 	var indexAngleMap = floor(obj.x-b.x);
	// 	if(indexAngleMap < 0)
	// 			indexAngleMap = 0;

	// 	if(indexAngleMap >= b.getWidth()) {
	// 		indexAngleMap = b.getWidth();	
	// 	}

	// 	var indexHeightMap = floor(obj.x-b.x) + floor(obj.getHeight());

	// 	if(indexHeightMap < 0)
	// 		indexHeightMap = 0;
	// 	if(indexHeightMap >= b.getWidth()) {
	// 		indexHeightMap = b.getWidth();	
	// 	}

	// 	var indexHeightMapAlt = round(obj.y - b.y);
	// 		if(indexHeightMapAlt < 0)
	// 			indexHeightMapAlt = 0;

	// 	// Why 'floor'? Because angles are only correctly calculated in angleMap['floor']	
	// 	var angle = b.angleMaps['right-wall'][indexHeightMap] % 360;
	// 		console.log("angle:" + angle);
	// 	// debugger;

	// 	if( angle <= 360 
	// 		&& ( angle > 225 && angle <= 315) 
	// 		) {

	// 		console.log("right-wall");
	// 		console.log("angle:" + angle);
	// 		console.log("");

	// 		// obj.angle = b.angleMaps['floor'][indexHeightMap]; // TODO fix generation of angles in other than floor-mode
	// 		obj.angle = angle;

	// 		obj.mode = "right-wall";
	// 		var angle_deg = -Math.sin((angle/180) * Math.PI );
	// 		var offs = ( ( obj.getHeight() - obj.getWidth() ) * angle_deg )

	// 		obj.x = b.x + b.heightMaps['right-wall'][indexHeightMapAlt] - obj.getWidth() - round(offs);
	// 		obj.in_air = false;
	// 		obj.isOnSlope = true;
	// 	}
	// 	obj.updateSensors();
	// }; 

	// ObjectSensor_A_Up = function() {
	// 	this.x = null;
	// 	this.y = null;
	// 	this.width = null; 
	// 	this.height = null;
	// 	this.match_objects = "ground";
	// };
	// ObjectSensor_A_Up.prototype.update = function(x, y, center, height) {

	// 	this.x = x + 32 + 8;
	// 	this.y = y - 32 + 8;

	// 	this.width = 1;
	// 	if(that.in_air === true) {
	// 		this.height = 16;
	// 		that.isOnSlope = false;
	// 	}
	// 	if(that.isOnSlope === true) {
	// 		this.height = 16;
	// 	} 

	// };
	// ObjectSensor_A_Up.prototype.collide = function(obj, b) {
	// 	if (b.solid !== true) {
	// 		return false;
	// 	}
	// 	b.collide(obj, b);


	// 	/**
	// 	 * The following section is not working, and was written to implement Right-Wall Mode (a.k.a. Loopings)
	// 	 */

	// 	// if (b.solid !== true) {
	// 	// 	return false;
	// 	// }

	// 	// var indexHeightMap = floor(obj.x-b.x);
	// 	// if(indexHeightMap < 0)
	// 	// 		indexHeightMap = 0;

	// 	// if(indexHeightMap >= b.getWidth()) {
	// 	// 	indexHeightMap = b.getWidth()-1;	
	// 	// }

	// 	// if(obj.speed_y < 0 && obj.y > (b.y + b.heightMaps['ceiling'][indexHeightMap]) ) {
	// 	// 	console.log("falsing");
	// 	// 	return false;
	// 	// }

	// 	// // if(obj.y < b.y + b.heightMaps['ceiling'][indexHeightMap] - obj.getHeight()) {
	// 	// // 	console.log("falsing2");
	// 	// // 	return false;
	// 	// // }

	// 	// if(obj.speed_y >= 0) { 
	// 	// 	// var angle = obj.angle % 360;
	// 	// 	var angle = b.angleMaps['ceiling'][indexHeightMap] % 360;


	// 	// 	// TODO very wrong: angle has to be different
	// 	// 	if(angle <= 225 && angle > 135) {
	// 	// /*	console.log("ceiling");
	// 	// 	console.log("angle:" + angle);
	// 	// 	console.log("");*/

	// 	// 		obj.angle = b.angleMaps['ceiling'][indexHeightMap];
	// 	// 		obj.mode = "ceiling";

	// 	// 		var angle_deg = -Math.sin((angle/180) * Math.PI );
	// 	// 		var offs = ( ( obj.getHeight() - obj.getWidth() ) * angle_deg )

	// 	// 			// obj.y = b.y + b.heightMaps['ceiling'][indexHeightMap] - obj.getHeight() ;

	// 	// 		// if(obj.in_air === true
	// 	// 		// 	&& obj.y > b.y + b.heightMaps['ceiling'][indexHeightMap] - obj.getHeight())
	// 	// 		// 	obj.y = b.y + b.heightMaps['ceiling'][indexHeightMap] - obj.getHeight() ;
	// 	// 		// else if(obj.isOnSlope === true)

	// 	// 		console.log("indexHeightMap: " + indexHeightMap);
	// 	// 		console.log("map: " + b.heightMaps['ceiling'][indexHeightMap]);
	// 	// 		obj.y = b.y + b.heightMaps['ceiling'][indexHeightMap];// - obj.getHeight() ;

	// 	// 		obj.in_air = false;
	// 	// 		obj.isOnSlope = true;
	// 	// 	}

	// 	// }
	// 	// obj.updateSensors();
	

	// };

	ObjectSensor_BB = function() {
		this.name           = 'BB';
		this.type           = 'ground'
		this.match_objects  = ["ground", "slope"];
		this.match_sensors  = ["ground"];
		this.x              = null;
		this.y              = null;
		this.width          = null;
		this.height         = null;
		this.colliding_with = new Set();
		this.getNewPositionAfterCollision = function() {

			/*
			 * This Sensor has no Collisions
			 */
			if(this.colliding_with.size === 0) {

				// return current values
				return new Point(this.x, this.y);
			}


			/*
			 * Calculate the new Y-Position
			 */
			let ar = Array.from(this.colliding_with);
			let heightMapIndex = this.x - ar[0].x;
			let newYPosition = ar[0].y + ar[0].heightMaps['floor'][heightMapIndex];

			return new Point( this.x, newYPosition );

		};
	};
	ObjectSensor_BB.prototype.update = function(x, y, center, height) {
		this.x = x + 32 - 8 - 16;
		this.y = y + height;

		this.width = 1;
		if(that.in_air === true) {
			this.height = 16;
			that.isOnSlope = false;
		}
		if(that.isOnSlope === true) {
			this.height = 128;
		} 
	};
	ObjectSensor_BB.prototype.collide = function(obj, b) {
	};


	ObjectSensor_CB = function() {
		this.name           = 'CB';
		this.type           = 'object'
		this.match_objects  = ["beatnik", "ringbounce"];
		this.match_sensors  = ["object"];
		this.x              = null;
		this.y              = null;
		this.width          = null;
		this.height         = null;
		this.colliding_with = new Set();
	};
	ObjectSensor_CB.prototype.update = function(x, y, width, height) {
		var shrink_x = 0.15 * width;
		var shrink_y = 0.15 * height;
		this.x = x + shrink_x;
		this.y = y + shrink_y;
		this.width = width - 2 * shrink_x;
		this.height = height - 2 * shrink_y;
	};
	ObjectSensor_CB.prototype.collide = function(obj, b) {
	};

	// ObjectSensor_D = function() {
	// 	this.x = null;
	// 	this.y = null;
	// 	this.width = null; 
	// 	this.height = null;
	// };
	// ObjectSensor_D.prototype.update = function(x, y, center, height) {
	// 	this.x = x + 32 + 32;
	// 	this.y = y + round(height/2) + 8; //y + height;

	// 	this.width = 16;
	// 	this.height = 1;
	// };

	// ObjectSensor_D.prototype.collide = function(obj, b) {
	// 	if (b.solid !== true) {
	// 		return false;
	// 	}
	// 	b.collide(obj, b);
	// };


	// ObjectSensor_E = function() {
	// 	this.x = null;
	// 	this.y = null;
	// 	this.width = null; 
	// 	this.height = null;
	// };
	// ObjectSensor_E.prototype.update = function(x, y, center, height) {
	// 	this.x = x + 32 + 32;
	// 	this.y = y + round(height/2) - 8; //y + height;

	// 	this.width = 16;
	// 	this.height = 1;
	// };

	// ObjectSensor_E.prototype.collide = function(obj, b) {
	// 	if (b.solid !== true) {
	// 		return false;
	// 	}
	// 	b.collide(obj, b);
	// };

	ObjectSensor_Dummy = function() {
		this.x = null;
		this.y = null;
		this.width = null; 
		this.height = null;
	};
	ObjectSensor_Dummy.prototype.update = function(x, y, center, height) {
	};
	ObjectSensor_Dummy.prototype.collide = function(obj, b) {
	};

	that.initSensors = function() {
		that.sensors = [];
	 	that.sensors.push(new ObjectSensor_AB());
	 	// that.sensors.push(new ObjectSensor_A_Right());

	 	// that.sensors.push(new ObjectSensor_A_Up());
	 	// that.sensors.push(new ObjectSensor_Dummy());	

	 	that.sensors.push(new ObjectSensor_BB());
	 	that.sensors.push(new ObjectSensor_CB());
	 	// that.sensors.push(new ObjectSensorChar_HeightMap());
	 	// that.sensors.push(new ObjectSensor_D());
	 	// that.sensors.push(new ObjectSensor_E());

		return true;
	};

	that.updateSensors = function() {
		var center = floor(that.sm.currentState.frames[floor(that.frame)].width / 2);
		var height = that.sm.currentState.frames[floor(that.frame)].height;


	/**
	 * NOTE: if changing indices, side-effects will appear!! (e.g.: isOnEdge())
	 * TODO: address sensors by name, instead of index
	 */  


	/**
		  * somehow this will not work: 
		  */   

		// for(var i=0; i<that.sensors.length; i++) {
		// 	that.sensors[i].update(that.x, that.y, center, height);
		// }

		/**
		 * so we do it manually: 
		 */  

		// Sensor A Down
		that.sensors[0].update(round(that.x), that.y, center, height);
		// Sensor A Right
		// that.sensors[1].update(that.x, that.y, center, height);
		// Sensor A Up
		// that.sensors[1].update(that.x, that.y, center, height);

		// Sensor B
		that.sensors[1].update(round(that.x), that.y, center, height);

		// Sensor C
		that.sensors[2].update(round(that.x), that.y, that.getWidth(), height);

		// that.sensors[3].update(that.x, that.y, that.getWidth(), height);
		// that.sensors[2].update(that.x, that.y, width, height);
		// that.sensors[3].update(that.x, that.y, width, height);
		// that.sensors[4].update(that.x, that.y, width, height);
	};

	that.resetSensors = function() {
		for (var a in that.sensors) {
			that.sensors[a].colliding = false;
			that.sensors[a].colliding_with.clear();
		}
		that.colliding_sensors.clear();
	};

	that.get_state = function() {
		//is in air?
		if(that.in_air) {
			//that.sm.changeState( new InAir(), that );
			// that.sm.changeState( new that.Stand(), that);
		} else {
			new that.OnGround(that);
		}
	};

	that.isBreaking = function() {
		if(round(that.speed_x) === 0)
			return false;
		if(that.speed_x > 0 && that.keyLeft())
			return true;
		if(that.speed_x < 0 && that.keyRight())
			return true;
	}

	that.isRolling = function() {
		return that.rolling;
	}

	that.isMaxSpeed = function() {
		if(that.speed_x >= that.top || that.speed_x <= -1 * that.top)
			return true;
		return false;
	}

	that.isRunSpeed = function() {
		if(Math.abs(round(that.speed_x)) >= that.top )
			return true;
		return false;
	}
	that.isDashSpeed = function() {
		if(Math.abs(round(that.speed_x)) >= that.dash)
			return true;
		return false;
	}
	that.isRollSpeed = function() {
		if(Math.abs(that.speed_x) >= 1.03125 * window.cfg.speedup_constant)
			return true;
		return false;
	};
	that.isOnEdge = function() {
		if ((that.sensors[0].colliding && !that.sensors[1].colliding) ||
			(!that.sensors[0].colliding && that.sensors[1].colliding)) {
			return true;
		}
		return false;
	};


	that.OnGround = function(obj) {
		
		if (round(obj.speed_x) === 0) {

			if(obj.hasInput()) {

				if (obj.keyUp()) {
					obj.sm.changeState( new that.LookUp(obj), obj );
					return true;
				}

				if (obj.keyDown()) {
					obj.sm.changeState( new that.Crouch(obj), obj);
					return true;
				}

				if( ( obj.keyLeft() || obj.keyRight() )) {
					obj.sm.changeState( new that.Walk(obj), obj );
					return true;
				}

				if( obj.keySpace() && obj.key2Up() ) {
					obj.sm.changeState( new that.Charge(obj), obj );
					return true;
				}

				if( obj.keySpace() && obj.sm.currentState.id != '9') {
					obj.sm.changeState( new that.Jump(obj), obj );
					return true;
				}

			}


			if (obj.isOnEdge()) {
				obj.sm.changeState( new that.OnEdge(obj), obj );
				return true;
			}

			if ((obj.sm.currentState.counter !== undefined &&
				obj.sm.currentState.counter > 150) || 
				obj.sm.currentState.name === 'Wait')
				obj.sm.changeState( new that.Wait(obj), obj );
			else
				obj.sm.changeState( new that.Stand(obj), obj );

			return true;
		}
		// is rolling?
		// if(obj.rolling) {
		// 	// var _tree = new that.Rolling(obj);
		// 	if(obj.)
		// 	return true;
		// }
		// so obj must be running
		if(obj.hasInput()) {

			if(obj.rolling === true) {
				if(obj.keyUp()) {
					obj.rolling = false;
				}	
			} else 
				if(obj.keyLeft() || obj.keyRight()) {
					if(obj.isBreaking()) {
						obj.sm.changeState( new that.Break(obj), obj );
						return true;
					} else {
						if(obj.isDashSpeed()) {
							obj.sm.changeState( new that.Dash(obj), obj );
							return true;
						}
						if(obj.isRunSpeed()) {
							obj.sm.changeState( new that.Run(obj), obj );
							return true;
						} else {
							obj.sm.changeState ( new that.Walk(obj), obj );
							return true;
						}
					}
				} 

			if(obj.keyDown()) {

				// if(obj.isOneSlope === true) {
				// 	obj.sm.changeState( new that.Roll(obj), obj );
				// 	return true;				
				// }

				if(obj.isRollSpeed())
					obj.sm.changeState( new that.Roll(obj), obj );

				return true;
			}

			if( obj.keySpace() && obj.key2Up() ) {
				obj.sm.changeState( new that.Charge(obj), obj );
				return true;
			}


			if( obj.keySpace() && obj.sm.currentState.id != '9'
				&& obj.sm.currentState.id !== '11') {
				obj.sm.changeState( new that.Jump(obj), obj );
				return true;
			}


			if(!obj.rolling)
			if(obj.isRunSpeed())
				obj.sm.changeState( new that.SlowDownRun(obj), obj );
			else {
				if(floor(obj.speed_x) === 0)
					obj.sm.changeState( new that.Stand(obj), obj );
				else
					obj.sm.changeState( new that.SlowDownWalk(obj), obj );

			}

			
		} else {		
			if(!obj.rolling)
			if(obj.isRunSpeed())
				obj.sm.changeState( new that.SlowDownRun(obj), obj );
			else {

				if( obj.angle < 352 && obj.angle > 8) 
					if( floor(obj.speed_x) === 0) {
						obj.sm.changeState( new that.Stand(obj), obj );
					} else {
						obj.sm.changeState( new that.SlowDownWalk(obj), obj );
					}
				else {
					if( floor(obj.speed_x) === 0) {
						obj.sm.changeState( new that.Stand(obj), obj );
					} else {
						obj.sm.changeState( new that.SlowDownWalk(obj), obj );
					}
				}
			}
		}

		// var_tree = new Walk(obj);
		return true;
	}

	that.Stand = function(obj) {

		var foobar = {};

		foobar.id = 0;
		foobar.name = 'Stand';
		foobar.image = new Image();
		foobar.image.src = 'images/sonic-stand.png';
		foobar.breakable = function(foo) { return true; };
		foobar.loop = true;
		
		foobar.top = 6 * 6;
		foobar.length = 1;
		foobar.frames = new Array();
		foobar.frames[0] = new Array();
		foobar.frames[0].width = 58;
		foobar.frames[0].height = 78;
		foobar.frames[0].margin = 0;

		foobar.enter = function(sm, obj) {
			obj.frame = 0;
			foobar.counter = 0;
		};
		foobar.update = function(sm, obj) {
			obj.speed_x = 0;
			foobar.counter++;
		};
		foobar.exit = function(sm) {
		};

		return foobar;
	};

	that.LookUp = function(obj) {

		var foobar = {};

		foobar.id = 1;
		foobar.name = 'LookUp';
		foobar.image = new Image();
		foobar.image.src = 'images/sonic-lookup.png';
		foobar.breakable = function(foo) { return true; };
		foobar.loop = false;
		foobar.top = 12 * 6;
		
		foobar.length = 1;
		foobar.frames = new Array();
		foobar.frames[0] = new Array();
		foobar.frames[0].width = 54;
		foobar.frames[0].height = 76;
		foobar.frames[0].margin = 0; 

		foobar.enter = function(sm, obj) {
			obj.frame = 0;
			obj.camera_offset_y = -128;
		};
		foobar.update = function(sm, obj) {
			obj.speed_x = 0;
		};
		foobar.exit = function(sm, obj) {
			obj.y += 128;
			obj.camera_offset_y = 0;
		};

		return foobar;

	};

	that.Walk = function(obj) {

		var foobar = {};

		foobar.id = 2;
		foobar.name = 'Walk';
		foobar.image = new Image();
		foobar.image.src = 'images/sonic-walk.png';
		foobar.breakable = function(foo) { return true; };
		foobar.loop = true;
		
		foobar.top = 12 * 6;
		foobar.length = 6;
		
		foobar.frames = new Array();
		foobar.frames[0] = new Array();
		foobar.frames[0].width = 74;
		foobar.frames[0].height = 76;
		foobar.frames[0].margin = 0;
		
		foobar.frames[1] = new Array();
		foobar.frames[1].width = 74;
		foobar.frames[1].height = 76;
		foobar.frames[1].margin = 12;
		
		foobar.frames[2] = new Array();
		foobar.frames[2].width = 74;
		foobar.frames[2].height = 76;
		foobar.frames[2].margin = 30;
		
		foobar.frames[3] = new Array();
		foobar.frames[3].width = 74;
		foobar.frames[3].height = 76;
		foobar.frames[3].margin = 28;
		
		foobar.frames[4] = new Array();
		foobar.frames[4].width = 74;
		foobar.frames[4].height = 76;
		foobar.frames[4].margin = 2;
		
		foobar.frames[5] = new Array();
		foobar.frames[5].width = 74;
		foobar.frames[5].height = 76;
		foobar.frames[5].margin = 22;

		foobar.enter = function(sm, obj) {
			obj.frame = 0;
			// TODO finish
			// obj.frame_duration = Math.max((obj.sm.currentState.top-Math.abs(obj.speed_x)) / window.cfg.speedup_constant, 1);
		};
		foobar.update = function(sm, obj) {

			if(obj.keyLeft()) {
				// Weiter beschleunigen
				obj.speed_x -= obj.acc /* * filter_fps_lag()*/;

				// if(obj.speed_x > 0)
				// 	obj.speed_x = 0;

			}
			if(obj.keyRight()) {
				// Weiter beschleunigen
				obj.speed_x += obj.acc /* * filter_fps_lag()*/;

				// if(obj.speed_x < 0)
				// 	obj.speed_x = 0;

			}

		};
		foobar.exit = function(sm) {
		};

		return foobar;
		
	};

	that.SlowDownWalk = function() {

		var foobar = new that.Walk( that );
		foobar.id = 3;
		foobar.name = 'SlowDownWalk';
		foobar.enter = function(sm, obj) {
			if(obj.history == undefined && obj.history.sm.currentState.id != 2) {
				foobar.frame = 0;
				// obj.frame_duration = Math.max(obj.sm.currentState.top-Math.abs(obj.speed_x), 1);
			}
		}
		foobar.update = function(sm, obj) {

			if(obj.flipped) {

				// Weiter beschleunigen
				obj.speed_x += obj.dec /* * filter_fps_lag()*/;

				if(obj.speed_x > 0)
					obj.speed_x = 0;

			} else {

				// Weiter beschleunigen
				obj.speed_x -= obj.dec /* * filter_fps_lag()*/;

				if(obj.speed_x < 0)
					obj.speed_x = 0;

			}

		};

		return foobar;

	};


	that.Run = function(obj) {

		var foobar = {};

		foobar.id = 4;
		foobar.name = 'Run';
		foobar.image = new Image();
		foobar.image.src = 'images/sonic-run.png';
		foobar.breakable = function(foo) { return true; };
		foobar.loop = true;

		foobar.top = 12 * 6;
		foobar.length = 4;
		
		foobar.frames = new Array();
		foobar.frames[0] = new Array();
		foobar.frames[0].width = 62;
		foobar.frames[0].height = 74;
		foobar.frames[0].margin = 0;
		
		foobar.frames[1] = new Array();
		foobar.frames[1].width = 62;
		foobar.frames[1].height = 74;
		foobar.frames[1].margin = 14;
		
		foobar.frames[2] = new Array();
		foobar.frames[2].width = 62;
		foobar.frames[2].height = 74;
		foobar.frames[2].margin = 18;
		
		foobar.frames[3] = new Array();
		foobar.frames[3].width = 62;
		foobar.frames[3].height = 74;
		foobar.frames[3].margin = 18;

		foobar.enter = function(sm, obj) {
			obj.frame = 0;
			// obj.frame_duration = Math.max(obj.sm.currentState.top-Math.abs(obj.speed_x), 1);
		};
		foobar.update = function(sm, obj) {

			if(obj.keyLeft()) {

				// Weiter beschleunigen
				obj.speed_x -= obj.acc /* * filter_fps_lag()*/;

			}
			if(obj.keyRight()) {

				// Weiter beschleunigen
				obj.speed_x += obj.acc /* * filter_fps_lag()*/;
			}

		};
		foobar.exit = function(sm) {
		};

		return foobar;
	};


	that.SlowDownRun = function() {

		var foobar = new that.Run( that );

		foobar.id = 5;
		foobar.name = 'SlowDownRun';
		foobar.enter = function(sm, obj) {
			if(obj.history == undefined && obj.history.sm.currentState.id != 2)
				that.frame = 0;
		}
		foobar.update = function(sm, obj) {

			if(obj.flipped) {

				obj.speed_x += obj.dec /* * filter_fps_lag()*/;

			} else {

				obj.speed_x -= obj.dec /* * filter_fps_lag()*/;

			}

		};

		return foobar;
	};

	that.Break = function(obj) {

		var foobar = {};

		foobar.id = 6;
		foobar.name = 'Break';
		foobar.image = new Image();
		foobar.image.src = 'images/sonic-break.png';
		foobar.breakable = function(foo) { return true; };
		foobar.loop = true;
		foobar.top = 12 * 6;

		foobar.length = 3;
		
		foobar.frames = new Array();
		foobar.frames[0] = new Array();
		foobar.frames[0].width = 64;
		foobar.frames[0].height = 72;
		foobar.frames[0].margin = 0;
		
		foobar.frames[1] = new Array();
		foobar.frames[1].width = 64;
		foobar.frames[1].height = 72;
		foobar.frames[1].margin = 14;
		
		foobar.frames[2] = new Array();
		foobar.frames[2].width = 64;
		foobar.frames[2].height = 72;
		foobar.frames[2].margin = 16;

		foobar.enter = function(sm, obj) {
			obj.frame = 0;
		};
		foobar.update = function(sm, obj) {

			if(obj.keyLeft()) {
				obj.speed_x -= obj.dec /* * filter_fps_lag()*/;

				if(obj.speed_x < 0)
					obj.speed_x = 0;
			}
			if(obj.keyRight()) {
				obj.speed_x += obj.dec /* * filter_fps_lag()*/;

				if(obj.speed_x > 0) 
					obj.speed_x = 0;
			}

		};
		foobar.exit = function(sm) {
		};

		return foobar;
	};


	that.Roll = function(obj) {

		var foobar = {};

		foobar.id = 7;
		foobar.name = 'Roll';
		foobar.image = new Image();
		foobar.image.src = 'images/sonic-roll.png';
		foobar.breakable = function(foo) { return true; };
		foobar.loop = true;

		foobar.top = 12 * 6;
		foobar.length = 4;
		
		foobar.frames = new Array();
		foobar.frames[0] = new Array();
		foobar.frames[0].width = 60;
		foobar.frames[0].height = 62;
		foobar.frames[0].margin = 0;
		
		foobar.frames[1] = new Array();
		foobar.frames[1].width = 60;
		foobar.frames[1].height = 62;
		foobar.frames[1].margin = 8;
		
		foobar.frames[2] = new Array();
		foobar.frames[2].width = 60;
		foobar.frames[2].height = 62;
		foobar.frames[2].margin = 10;
		
		foobar.frames[3] = new Array();
		foobar.frames[3].width = 60;
		foobar.frames[3].height = 62;
		foobar.frames[3].margin = 6;

		foobar.enter = function(sm, obj) {
			obj.frame = 0;
			obj.rolling = true;
			obj.frc = 1/2 * obj.frc;
			obj.frame_duration /= 1.5;
		};
		foobar.update = function(sm, obj) {

			if(obj.speed_x >= 0) {
				if(obj.keyLeft())
					obj.speed_x -= 0.125 * window.cfg.speedup_constant;
				obj.speed_x -= obj.frc /* * filter_fps_lag()*/;
			}
			if(obj.speed_x <= 0) {
				if(obj.keyRight())
					obj.speed_x += 0.125 * window.cfg.speedup_constant;
				obj.speed_x += obj.frc /* * filter_fps_lag()*/;
			}
			if(Math.abs(obj.speed_x) <= 1.03125 * window.cfg.speedup_constant) {
				sm.changeState( new that.Walk( obj ), obj );
			}
		};
		foobar.exit = function(sm, obj) {
			obj.rolling = false;
			obj.frc = 2 * obj.frc;
			obj.frame_duration *= 1.5;
		};

		return foobar;
	};

	that.Crouch = function(obj) {

		var foobar = {};

		foobar.id = 8;
		foobar.name = 'Crouch';
		foobar.image = new Image();
		foobar.image.src = 'images/sonic-crouch.png';
		foobar.breakable = function(foo) { return true; };
		foobar.loop = false;
		foobar.top = 12 * 6;

		foobar.length = 1;
		foobar.frames = new Array();
		foobar.frames[0] = new Array();
		foobar.frames[0].width = 58;
		foobar.frames[0].height = 52;
		foobar.frames[0].margin = 0;

		foobar.enter = function(sm, obj) {
			obj.frame = 0;
		};
		foobar.update = function(sm, obj) {
			if(obj.keySpace())
				obj.sm.changeState( new that.Charge(obj), obj );
		};
		foobar.exit = function(sm) {
		};

		return foobar;
		
	};

	that.Jump = function(obj) {

		var foobar = {};

		foobar.id = 9;
		foobar.name = 'Jump';
		foobar.image = new Image();
		foobar.image.src = 'images/sonic-roll.png';
		foobar.breakable = function (obj) {

			// // console.log(round(speed_y));
			// if(round(obj.speed_y) == 0 && round(obj.history.speed_y)) {
			// 	obj.in_air = false;
			// 	return true;
			// }
			return true;
		
		};
		foobar.loop = true;
		foobar.top = 12 * 6;
		foobar.interlock = 0.10* 1000; // number of ms until Jump can be executed again

		foobar.length = 4;
		
		foobar.frames = new Array();
		foobar.frames[0] = new Array();
		foobar.frames[0].width = 60;
		foobar.frames[0].height = 62;
		foobar.frames[0].margin = 0;
		
		foobar.frames[1] = new Array();
		foobar.frames[1].width = 60;
		foobar.frames[1].height = 62;
		foobar.frames[1].margin = 8;
		
		foobar.frames[2] = new Array();
		foobar.frames[2].width = 60;
		foobar.frames[2].height = 62;
		foobar.frames[2].margin = 10;
		
		foobar.frames[3] = new Array();
		foobar.frames[3].width = 60;
		foobar.frames[3].height = 62;
		foobar.frames[3].margin = 6;

		foobar.enter = function(sm, obj) {
			obj.frame = 0;
			obj.frame_duration /= 2;

			// Jumping at an angle
			if(obj.isOnSlope === true) {
				var d = obj.jmp * Math.sin(obj.angle / 180 * Math.PI)
				obj.speed_x -= d;

				var d = obj.jmp * Math.cos(obj.angle / 180 * Math.PI)
				obj.speed_y += d;

				obj.in_air = true;
				obj.mode = 'floor';
				obj.angle = 0;
			}
		};
		foobar.update = function(sm, obj) {	
			obj.BlockedAnimations.add( obj ); 
			if(obj.keyLeft()) {

				// Weiter beschleunigen
				if(floor(obj.speed_x) > -6)
				obj.speed_x -= obj.air /* * filter_fps_lag()*/;

			}
			if(obj.keyRight()) {

				// Weiter beschleunigen
				if(floor(obj.speed_x) < 6)
				obj.speed_x += obj.air /* * filter_fps_lag()*/;
			}
			// Air Drag
			// if (obj.speed_y < 0 && obj.speed_y > -4) {
			// 	if (Math.abs(obj.speed_x) >= 0.125)
			// 		obj.speed_x = obj.speed_x * obj.air_drag;
			// } 
		};
		foobar.exit = function(sm) {
			obj.frame_duration *= 2;
		};

		foobar.onKeyUp = function(obj) {
			if(obj.speed_y >= 0)
				return false;
			if(obj.speed_y < -4 * 6)
				obj.speed_y = -4 * 6;
		}

		return foobar;
	};


	that.Charge = function(obj) {

		var foobar = {};

		foobar.id = 10;
		foobar.name = 'Charge';
		foobar.image = new Image();
		foobar.image.src = 'images/sonic-dash.png';
		foobar.breakable = function(foo) { return true; };
		foobar.loop = true;
		foobar.top = 12 * 6;

		foobar.length = 4;

		foobar.frames = new Array();
		foobar.frames[0] = new Array();
		foobar.frames[0].width = 78;
		foobar.frames[0].height = 64;
		foobar.frames[0].margin = 0;

		foobar.frames[1] = new Array();
		foobar.frames[1].width = 78;
		foobar.frames[1].height = 64;
		foobar.frames[1].margin = 10;

		foobar.frames[2] = new Array();
		foobar.frames[2].width = 78;
		foobar.frames[2].height = 64;
		foobar.frames[2].margin = 10;

		foobar.frames[3] = new Array();
		foobar.frames[3].width = 78;
		foobar.frames[3].height = 64;
		foobar.frames[3].margin = 10;

		foobar.enter = function(sm, obj) {
			obj.frame = 0;
			obj.step = 0;
		};
		foobar.update = function(sm, obj) {
			obj.step++;
		};
		foobar.exit = function(sm, obj) {
		};
		foobar.onKeyUp = function(obj) {
			if(obj.step <= 30)
				return false;
				
			if(obj.flipped == true)
				obj.speed_x -= obj.dash;
			else
				obj.speed_x += obj.dash;
			obj.sm.changeState( new that.Dash( obj ), obj );
		};

		return foobar;

	};



	that.Dash = function(obj) {

		var foobar = {};

		foobar.id = 11;
		foobar.name = 'Dash';
		foobar.image = new Image();
		foobar.image.src = 'images/sonic-dash.png';
		foobar.breakable = function(foo) { return true; };
		foobar.loop = true;
		foobar.top = 12 * 8;

		foobar.length = 4;

		foobar.frames = new Array();
		foobar.frames[0] = new Array();
		foobar.frames[0].width = 78;
		foobar.frames[0].height = 64;
		foobar.frames[0].margin = 0;

		foobar.frames[1] = new Array();
		foobar.frames[1].width = 78;
		foobar.frames[1].height = 64;
		foobar.frames[1].margin = 10;

		foobar.frames[2] = new Array();
		foobar.frames[2].width = 78;
		foobar.frames[2].height = 64;
		foobar.frames[2].margin = 10;

		foobar.frames[3] = new Array();
		foobar.frames[3].width = 78;
		foobar.frames[3].height = 64;
		foobar.frames[3].margin = 10;

		foobar.enter = function(sm, obj) {
			obj.frame = 0;
		};
		foobar.update = function(sm, obj) {

			if(obj.keyLeft()) {

				// Weiter beschleunigen
				obj.speed_x -= obj.acc /* * filter_fps_lag()*/;

			}
			if(obj.keyRight()) {

				// Weiter beschleunigen
				obj.speed_x += obj.acc /* * filter_fps_lag()*/;
			}

		};
		foobar.exit = function(sm, obj) {

			var now = new Date().getTime();
			obj.blocked.push( {'name' : 'Jump', 'timestamp' : now} );
		};

		return foobar;
	};

	that.OnEdge = function(obj) {

		var foobar = {};

		foobar.id = 12;
		foobar.name = 'OnEdge';
		foobar.image = new Image();
		foobar.image.src = 'images/sonic-on-edge.png';
		foobar.breakable = function(foo) { return true; };
		foobar.loop = true;
		foobar.top = 12 * 6;

		foobar.length = 4;

		foobar.frames = [];
		foobar.frames[0] = new Array();
		foobar.frames[0].width = 69;
		foobar.frames[0].height = 80;
		foobar.frames[0].margin = 0;

		foobar.frames[1] = new Array();
		foobar.frames[1].width = 69;
		foobar.frames[1].height = 80;
		foobar.frames[1].margin = 0;

		foobar.frames[2] = new Array();
		foobar.frames[2].width = 69;
		foobar.frames[2].height = 78;
		foobar.frames[2].margin = 0;

		foobar.frames[3] = new Array();
		foobar.frames[3].width = 69;
		foobar.frames[3].height = 80;
		foobar.frames[3].margin = 0;

		foobar.enter = function(sm, obj) {
			obj.frame = 0;
			obj.speed_x = 0;
		};
		foobar.update = function(sm, obj) {
			if (obj.sensors === undefined) {
				return true;
			}
			if (obj.sensors[0].colliding && !obj.sensors[1].colliding) {
				obj.flipped = true;
			}
			if (obj.sensors[1].colliding && !obj.sensors[0].colliding) {
				obj.flipped = false;
			}
		};
		foobar.exit = function(sm) {
		};

		return foobar;
	};

	that.Wait = function(obj) {

		var foobar = {};

		foobar.id = 13;
		foobar.name = 'Wait';
		foobar.image = new Image();
		foobar.image.src = 'images/sonic-wait.png';
		foobar.breakable = function(foo) { return true; };
		foobar.loop = true;
		foobar.top = 12 * 6;

		foobar.length = 4;

		foobar.frames = [];

		foobar.frames[0] = new Array();
		foobar.frames[0].width = 60;
		foobar.frames[0].height = 76;
		foobar.frames[0].margin = 0;
		
		foobar.frames[1] = new Array();
		foobar.frames[1].width = 60;
		foobar.frames[1].height = 76;
		foobar.frames[1].margin = 0;
		
		foobar.frames[2] = new Array();
		foobar.frames[2].width = 60;
		foobar.frames[2].height = 76;
		foobar.frames[2].margin = 0;
		
		foobar.frames[3] = new Array();
		foobar.frames[3].width = 60;
		foobar.frames[3].height = 76;
		foobar.frames[3].margin = 0;

		foobar.enter = function(sm, obj) {
			obj.frame = 0;
		};
		foobar.update = function(sm, obj) {
		};
		foobar.exit = function(sm) {
		};

		return foobar;

	};

	that.RingLoss = function(obj) {

		var foobar = {};

		foobar.id = 14;
		foobar.name = 'RingLoss';
		foobar.image = new Image();
		foobar.image.src = 'images/sonic-hit.png';
		foobar.breakable = function(foo) { return true; };
		foobar.loop = false;
		
		foobar.top = 6 * 6;
		foobar.length = 1;
		foobar.frames = new Array();
		foobar.frames[0] = new Array();
		foobar.frames[0].width = 80;
		foobar.frames[0].height = 56;
		foobar.frames[0].margin = 0;

		foobar.enter = function(sm, obj) {
			obj.frame = 0;
			obj.stepcount = 0;

			that.blinking = true;

			var tmp = obj.grv;
			obj.grv = obj.grv_hazard;
			obj.grv_hazard = tmp;

			// TODO: fix this
			var sgn = 1;
			if(obj.enemy_direction === 0) {
				sgn = -1;
			}

			obj.speed_x = 6 * 1 * ( sgn );
			obj.speed_y = 6 * -2;

		};
		foobar.update = function(sm, obj) {
		};
		foobar.exit = function(sm, obj) {
			var tmp = obj.grv_hazard;
			obj.grv_hazard = obj.grv;
			obj.grv = tmp;
				
			var foo = setTimeout(function() {
				// clearInterval(intvl)
				obj.recover = false;
				obj.blinking = false;
				obj.render = true;
			}, (1/window.myEngine.fps_max) * 120 * 500); // TODO change to gameframes
	
		};

		return foobar;
	};

	

	that.RingLossReal = function(objects, rings) {
		var t = 0;
		var angle = 101.25; //; assuming 0=right, 90=up, 180=left, 270=down
		var n = false;
		var speed = 4;

		var obj = objects.getByName('char');

		while(t < obj.rings && t < 32) {

			var ring = new ObjectRingBouncing();
			ring.solid = true;
			ring.sm.changeState( new ring.Bounce(), ring );
			ring.x = obj.x; 
			ring.y = obj.y;
			ring.initSensors();

			ring.speed_y = 1.5 * -1 * Math.sin(angle)* speed;
			ring.speed_x = 1.5 * Math.cos(angle) * speed;
			if(t % 3 === 0) {
				ring.speed_z = 1.5 * Math.sin(angle-180) * speed;
			}

			if(n === true) {
				ring.speed_x *= -1;
				angle += 22.5;
			}

			if(n === false) {
				n = true;
			} else {
				n = false;
			}
			t++;
			if( t === 16 ) {
				speed = 2; // we're on the second circle now, so decrease the speed
				angle = 101.25; // reset angle
			}

			objects.add(ring);

		}

		obj.rings = 0;

	}

	return that;

};

