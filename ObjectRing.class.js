/* (c)opyright 2018 René Michalke */

	var ObjectRing = function() {

	var that = new ObjectStatic();

	that.name = 'ring';
	that.collide = function( b ) {
	};

	that.in_air = false;
	that.rolling = false;

	that.get_state = function() {
	};

	that.Chill = function(obj) {

		var foobar = {};

		foobar.id = 0;
		foobar.name = 'Chill';
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
		};
		foobar.update = function(sm, obj) {
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
		foobar.breakable = function(foo) { return true; };
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
			obj.stepcount = 0;
			obj.solid = false;
		};
		foobar.update = function(sm, obj) {
			if(floor(obj.stepcount++) >= 5) {
				obj.destroy = true;
			}
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
		this.sensor_type = [ 'char' ];
	};
	ObjectSensor_Ring.prototype.update = function(x, y, width, height) {
		this.x = x + 5;
		this.y = y + 5;
		this.width = width - 10;
		this.height = height - 10;
	};
	ObjectSensor_Ring.prototype.collide = function(obj, b) {
		if(b.recover === false) {
			obj.sm.changeState( new obj.Collect(obj), obj );
			b.rings++;
		}
	};


	that.initSensors = function() {
		that.sensors = [];
		var sensor = new ObjectSensor_Ring();
		sensor.update( that.x, that.y, that.sm.currentState.frames[floor(that.frames)].width, that.sm.currentState.frames[floor(that.frame)].height );
	 	that.sensors.push(sensor);
		return true;
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

	return that;

};