/* (c)opyright 2018 René Michalke */

var ObjectStatic = function() {

	var that = new Object();

	that.parentCollide = function( obj, b ) { 
		// console.log("obj.name: " + obj.name);
		// console.log("b.name: " + b.name);
		
	};

	that.physics = function() {
	};

	that.frame_update = function () {
		this.frame_speed = 0.2;
		this.frame += this.frame_speed /** filter_fps_lag()*/;
	};

	return that;
	
};