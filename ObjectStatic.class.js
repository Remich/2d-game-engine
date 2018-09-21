/* (c)opyright 2018 René Michalke */

var ObjectStatic = function() {

	var that = new Object();

	that.sensors_flipped = null;
	that.heightMaps = [];
	that.heightMaps_flipped = [];

	that.default_sensor_height = 42;

	that.physics = function() {
	};

	that.frame_update = function () {
		this.frame_speed = 0.2;
		this.frame += this.frame_speed /** filter_fps_lag()*/;
	};

	that.updateSensors = function() {
		for (var a in that.sensors) {
			that.sensors[a].update(that);
		}
	};

	that.resetSensors = function() {
		for (var a in that.sensors) {
			that.sensors[a].colliding_with.clear();
			that.sensors[a].colliding = false;
		}
		that.colliding_sensors.clear();
	};

	that.initFlippedHeightMaps = function() {
		that.heightMaps_flipped['floor'] = that.heightMaps['floor'].slice(0).reverse() ;
	};

	that.flip = function() {

		var tmp;
		that.flipped = true;

		/*
		 * Flip Sensors
		 */

		that.initFlippedSensors();

		tmp = that.sensors;
		that.sensors = that.sensors_flipped;
		that.sensors_flipped = tmp;

		/*
		 * Flip HeightMaps
		 */
		that.initFlippedHeightMaps();
		tmp = that.heightMaps;
		that.heightMaps = that.heightMaps_flipped;
		that.heightMaps_flipped = tmp;

		that.updateSensors();
	
	};

	return that;
	
};
