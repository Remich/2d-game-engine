/* (c)opyright 2018 René Michalke */

var ObjectBeatnik = function() {

	var that = new Object();

	that.name = 'beatnik';
	that.collide = function( obj ) {

		if ((obj.sm.currentState.name === 'Jump' &&
			obj.speed_y > 0) ||
			obj.sm.currentState.name === 'Roll') {
			that.replace = new ObjectExplosion();
			that.replace.x = that.x;
			that.replace.y = that.y;
			that.replace.id = that.id;
			that.replace.zindex = 2;
			that.replace.sm.changeState( that.replace.Explode(), that.replace );
			that.destroy = true;
			obj.speed_y = -1 * obj.speed_y;
			return;
		}

		if(obj.recover === true) {
			return; 
		}

		if (obj.name === "char") {
			obj.recover = true;
			obj.callback = obj.RingLossReal;
			obj.sm.changeState( new obj.RingLoss(), obj);

			// compute enemy direction
			var x = obj.x - b.x;
			// TODO: fix this
			obj.enemy_direction = x > 0 ? 1 : x < 0 ? -1 : 0;
			return;
		}
	};

	// ground-sensors, 2 lines each 16px down, 16px apart from the sprite center
	// sensor coordinates are relative to the top / left coordinates of the object
	ObjectSensor_A = function() {
		this.x = null;
		this.y = null;
		this.width = null; 
		this.height = null;
		this.match_objects = ["ground"];
	};
	ObjectSensor_A.prototype.update = function(x, y, center, height) {
		this.x = x + 32 + 16;
		this.y = y + height;
		this.width = 1;
		this.height = 16;

		if(that.in_air === true) {
			this.height = 16;
			that.isOnSlope = false;
		}
		if(that.isOnSlope === true) {
			this.height = 128;
		} 

	};
	ObjectSensor_A.prototype.collide = function(obj, b) {
		if(obj.speed_y < 0)
			return false;
		if(obj.y > b.y )
	 		return false;
		if(obj.speed_y >= 0) { 
			obj.in_air = false;
			obj.y = b.sensors[0].y - obj.sm.currentState.frames[floor(obj.frame)].height;
	 	}
	}; 

	ObjectSensor_B = function() {
		this.x = null;
		this.y = null;
		this.width = null; 
		this.height = null;
		this.match_objects = ["ground"];
	};
	ObjectSensor_B.prototype.update = function(x, y, center, height) {
		this.x = x + 32 - 16;
		this.y = y + height;
		this.width = 1;
		this.height = 16;

		if(that.in_air === true) {
			this.height = 16;
			that.isOnSlope = false;
		}
		if(that.isOnSlope === true) {
			this.height = 128;
		} 
	};
	ObjectSensor_B.prototype.collide = function(obj, b) {
	// 	if (b.solid !== true) {
	// 		return false;
	// 	}
	// 	b.collide(obj, b);


	};

	ObjectSensor_C = function() {
		this.x = null;
		this.y = null;
		this.width = null; 
		this.height = null;
		this.match_objects = ["char"];
		this.type = "objects";
		this.match_sensors = ["objects"];
	};
	ObjectSensor_C.prototype.update = function(x, y, width, height) {
		var shrink_x = 0.15 * width;
		var shrink_y = 0.15 * height;
		this.x = x + shrink_x;
		this.y = y + shrink_y;
		this.width = width - 2 * shrink_x;
		this.height = height - 2 * shrink_y;
	};
	ObjectSensor_C.prototype.collide = function(obj, b) {
		console.log("jo");
	};

	ObjectSensor_D = function() {
		this.x = null;
		this.y = null;
		this.width = null; 
		this.height = null;
	};
	ObjectSensor_D.prototype.update = function(x, y, center, height) {
		this.x = x + 32 + 32;
		this.y = y + round(height/2) + 8; //y + height;

		this.width = 16;
		this.height = 1;
	};

	ObjectSensor_D.prototype.collide = function(obj, b) {
		if (b.solid !== true) {
			return false;
		}
		b.collide(obj, b);
	};


	ObjectSensor_E = function() {
		this.x = null;
		this.y = null;
		this.width = null; 
		this.height = null;
	};
	ObjectSensor_E.prototype.update = function(x, y, center, height) {
		this.x = x + 32 + 32;
		this.y = y + round(height/2) - 8; //y + height;

		this.width = 16;
		this.height = 1;
	};

	ObjectSensor_E.prototype.collide = function(obj, b) {
		if (b.solid !== true) {
			return false;
		}
		b.collide(obj, b);
	};


	that.initSensors = function() {
		that.sensors = [];
	 	that.sensors.push(new ObjectSensor_A());
	 	that.sensors.push(new ObjectSensor_B());
	 	that.sensors.push(new ObjectSensor_C());
	 	// that.sensors.push(new ObjectSensor_D());
	 	// that.sensors.push(new ObjectSensor_E());

		return true;
	};

	that.updateSensors = function() {
		var center = floor(that.sm.currentState.frames[floor(that.frame)].width / 2);
		var height = that.sm.currentState.frames[floor(that.frame)].height;

		that.sensors[0].update(that.x, that.y, center, height);
		that.sensors[1].update(that.x, that.y, center, height);

		var width = that.sm.currentState.frames[floor(that.frame)].width;

		that.sensors[2].update(that.x, that.y, width, height);
		// that.sensors[3].update(that.x, that.y, width, height);
		// that.sensors[4].update(that.x, that.y, width, height);
	};

	that.resetSensors = function() {
		for (var a in that.sensors) {
			that.sensors[a].colliding = false;
		}
		return true; 
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

	return that;

};
