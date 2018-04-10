/* (c)opyright 2018 René Michalke */

var ObjectWithInput = function() {

	var that = new Object();

	that.camx = 0;
	that.camy = 0;

	that.updateCam = function() {
		that.camx = round(that.x - window.cfg.screen_width / 2);
		that.camy = round(that.y - window.cfg.screen_height / 2);
	};
	that.cam = function() {
		that.updateCam();
		//window.scrollTo(that.camx, that.camy);
	};
	that.hasInput = function() {
		if(that.pressed_keys === 'undefined')
			return false;
		if(that.pressed_keys.length > 0)
			return true;
	};
	that.keyUp = function() {
		if(that.pressed_keys[that.pressed_keys.length-1] == that.assigned_keys[4])
			return true;
	};
	that.key2Up = function() {
		if(that.pressed_keys[that.pressed_keys.length-2] == that.assigned_keys[4])
			return true;
	};
	that.keyLeft = function() {
		if(that.pressed_keys[that.pressed_keys.length-1] == that.assigned_keys[0])
			return true;
	};
	that.keyRight = function() {
		if(that.pressed_keys[that.pressed_keys.length-1] == that.assigned_keys[1])
			return true;
	};
	that.keyDown = function() {
		if(that.pressed_keys[that.pressed_keys.length-1] == that.assigned_keys[2])
			return true;
	};
	that.keySpace = function() {
		if(that.pressed_keys == undefined)
			return false;
		if(that.pressed_keys.length == 0)
			return false;
		if(that.pressed_keys[that.pressed_keys.length-1] == that.assigned_keys[3]) {
			return true;
		}
		return false;
	};
	that.keySpaceRelease = function() {
		if(that.released_keys == undefined)
			return false;
		if(that.released_keys.length == 0)
			return false;
		if(that.released_keys[that.released_keys.length-1] == that.assigned_keys[3]) {
			return true;
		}
		return false;
	};

	return that;

};