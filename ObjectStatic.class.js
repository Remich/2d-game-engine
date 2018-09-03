/* (c)opyright 2018 René Michalke */

var ObjectStatic = function() {

	var that = new Object();

	that.physics = function() {
	};

	that.frame_update = function () {
		this.frame_speed = 0.2;
		this.frame += this.frame_speed /** filter_fps_lag()*/;
	};

	return that;
	
};
