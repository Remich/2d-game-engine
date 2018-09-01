/* (c)opyright 2018 René Michalke */

	var ObjectRingBouncing = function() {

	var that = new Object();

	that.name = 'ringbounce';
	that.solid = true;
	that.collide = function( obj ) {

		if(obj.name === 'char') {
			if(obj.recover === false) {
				that.sm.changeState( new that.Collect(that), that );
				obj.rings++;
			}
		}

		if(obj.name === 'ground') {
			if(obj.speed_y < 0)
				return false;
			if(obj.y > that.y )
		 		return false;
		 	if(obj.speed_y > 0) {
				obj.speed_y *= -0.75;
		 	}
		}
	};

	that.in_air = true;
	that.rolling = false;
	that.grv = 1 * 0.09375;

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
			if(floor(obj.gameframe++) >= 5) {
				obj.destroy = true;
			}
			obj.speed_x = 0;
			obj.speed_y = 0;
		};
		foobar.exit = function(sm, obj) {
		};

		return foobar;
	};


	ObjectSensor_Ring = function() {
		this.x = null;
		this.y = null;
		this.width = null;
		this.height = null;
		this.sensor_type = ["char"];
	};
	ObjectSensor_Ring.prototype.update = function(x, y, width, height) {
		this.x = x + 5;
		this.y = y + 5;
		this.width = width - 10;
		this.height = height - 10;
	};
	ObjectSensor_Ring.prototype.collide = function(obj, b) {
	};


	that.initSensors = function() {
		that.sensors = [];
		var sensor = new ObjectSensor_Ring();

		sensor.update( that.x, that.y, that.sm.currentState.frames[floor(that.frames)].width, that.sm.currentState.frames[floor(that.frame)].height );
	 	that.sensors.push(sensor);

		return true;
	};

	that.updateSensors = function() {
		// Sensor_Ring
		var width = that.sm.currentState.frames[floor(that.frame)].width;
		var height = that.sm.currentState.frames[floor(that.frame)].height;
		that.sensors[0].update(that.x, that.y, width, height);
	};

	that.resetSensors = function() {
		for (var a in that.sensors) {
			that.sensors[a].colliding = false;
		}
		return true; 
	};

	return that;

};