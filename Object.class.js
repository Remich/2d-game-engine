/* (c)opyright 2018 René Michalke */

/*
 * TODO comment variables
 */
var Object = function() {

	var that = {};
	
	that.x = 0;
	that.y = 0;
	that.width = 0;
	that.height = 0;
	that.camera_offset_x = 0;
	that.camera_offset_y = 0;
	that.gsp = 0; // ground speed
	that.speed_x = 0;
	that.speed_y = 0;
	that.speed_z = 1;
	that.flipped = false;
	that.enemy_direction = 0; // 0 right, 1 left
	that.recover = false;
	that.frame = 0;
	that.frame_speed = 1;
	that.frame_duration = 1 * window.cfg.speedup_constant;
	that.frame_counter = that.frame_duration;
	that.gravitation = 1;
	that.history = [];
	that.spawned = true;


	that.destroy = false;
	that.in_air = true;
	that.isOnSlope = false;
	that.blocked = [];
	that.indexHeightMap = 0;


	that.blinking = false;
	that.blinking_duration = 4;
	that.blinking_frame_count = 0;
	that.render = true;

	that.colliding_sensors = new Set();

	that.acc = window.cfg.speedup_constant * 0.046875;/*6 * 0.046875 /*+ 0.046875 + 0.046875 + 0.046875 + 0.046875 + 0.046875*/;
	that.frc = window.cfg.speedup_constant * 0.046875;
	that.dec = window.cfg.speedup_constant * 0.5;
	that.grv = window.cfg.speedup_constant * 0.21875;
	that.grv_hazard = window.cfg.speedup_constant * 0.1875;
	that.air = window.cfg.speedup_constant * 0.09375;
	that.air_drag = 0.96875;
	that.top = window.cfg.speedup_constant * 6; 
	that.dash = window.cfg.speedup_constant * 12;

	that.jmp = window.cfg.speedup_constant * -7.5;	

	that.slp = window.cfg.speedup_constant * 0.025;
	that.slp_rolling_uphill = window.cfg.speedup_constant * 0.078125;
	that.slp_rolling_downhill = window.cfg.speedup_constant * 0.3125;



	that.player_1 = false;
	that.assigned_keys = [];
	that.pressed_keys  = [];
	that.released_keys = [];

	that.heightMap = [];
	that.angle = 0
	
	that.mode = 'floor';  // 'right-wall', 'left-wall', 'ceiling'

	that.repeat = 'repeat'; // or 'repeat-x', 'repeat-y'
	that.fixed = false;
	that.scroll = 0; // amount of parallax scrolling

	that.updateDimensions = function() {
		that.width = that.getWidth();
		that.height = that.getHeight();
	};


	that.getWidth = function() {
		return that.sm.currentState.frames[floor(that.frame)].width;
	};

	that.getCenter = function() {
		return floor(that.x + (that.getWidth() / 2));
	};

	that.getHeight = function() {
		return that.sm.currentState.frames[floor(that.frame)].height;
	};

	that.saveHistory = function () {
		that.history.push(that);
	};

	that.BlockedAnimations = function() {
	};
	that.BlockedAnimations.add = function(obj) {
		var now = new Date().getTime();
		that.blocked.push( {'name' : obj.sm.currentState.name, 'timestamp' : now} );
		return true;
	};
	that.BlockedAnimations.isBlocked = function(name, interlock) {
		if (interlock === undefined ) {
			return false;
		}

		var now = new Date().getTime(),
		i;
		for (i=0; i<that.blocked.length; i++) {
			if (now - that.blocked[i].timestamp > interlock) {
				that.blocked.splice(i, 1);
				continue;
			}
			if (that.blocked[i].name === name) {
				return true;
			}
		}
		return false;
	};

	that.direction = function() {
		if(that.speed_x > 0 && that.flipped) {
			that.flipped = false;
		}
		if(that.speed_x < 0 && !that.flipped) {
			that.flipped = true;
		}
	};

	that.flip = function() {
		that.flipped = true;

		if(that.heightMaps !== undefined)
			that.heightMaps['floor'].reverse();

		if(that.angleMaps !== undefined)
			for(var a=0; a < that.angleMaps['floor'].length; a++) {
				that.angleMaps['floor'][a] = 360 - that.angleMaps['floor'][a];
			}

		if(that.initSensors !== undefined)
			that.initSensors();
	};


	that.physics = function() {

		// TODO: add angle calculation

		if (that.y > window.cfg.level_height) {
			that.y = 0; //return false;
		}

		// speed y
		if(that.gravitation && that.in_air) 
			that.speed_y += that.grv /** filter_fps_lag()*/;

		// Speed Y maximal
		if(that.speed_y > 0 && that.speed_y >= that.dash)
			that.speed_y = that.dash;


		// Uncomment for maximum upward speed:
		// if(that.speed_y < 0 && that.speed_y < -3 * that.dash)
		// 	that.speed_y = -3 * that.dash;
		
		if(!that.in_air && that.sm.currentState.name != "Jump") 
			that.speed_y = 0;

		if(that.in_air) {
			that.y += that.speed_y; 
		} else {
			// Here Nothing to do because HeightMap of Colliding Object will take care of new that.y Position
		}
			

		// Speed X
		//  X maximal
		
		if(that.speed_x > 0 && that.speed_x >= that.sm.currentState.top)
			that.speed_x = that.sm.currentState.top;
			
		if(that.speed_x < 0 && that.speed_x <= -1 * that.sm.currentState.top - 1)
			that.speed_x = -1 * that.sm.currentState.top - 1;


		if(that.in_air) {
			that.x += that.speed_x;
		} else {

			// Slope Factor
			var slope_factor = that.slp;

			if(that.angle >= 0 && that.angle <= 5)
				slope_factor = 1.0;
			if(that.angle < 0 && that.angle >= -5)
				slope_factor = 1.0;


			// Decide Slope Factor while Rolling
			if(that.rolling === true) {

				// going left and moving a slope upwards
				if(this.speed_x < 0) {
					if(that.angle > 0 && that.angle <= 90) {
						slope_factor = that.slp_rolling_uphill;
					}
					if(that.angle > 270 && that.angle <=359) {
						slope_factor = that.slp_rolling_downhill;
					}
				} else // going right and moving slope downwards
				if(this.speed_x >= 0) {
					if(that.angle > 0 && that.angle <= 90) {
						slope_factor = that.slp_rolling_downhill;
					}
					if(that.angle > 270 && that.angle <=359) {
						slope_factor = that.slp_rolling_uphill;
					}
				}

			}

			// console.log(that.sm.currentState);
			if(that.sm.currentState.name !== 'Crouch')
				that.speed_x += slope_factor * Math.sin((that.angle / 180) * Math.PI);

			// Let Sonic fall is abs(Gsp) < 2.5
			// if(that.mode === 'right-wall'
			// 	|| that.mode === 'ceiling'
			// 	|| that.mode === 'left-wall') {

			// 	if(that.speed_x < 2.5 * window.cfg.speedup_constant) {
			// 		that.speed_x = 0;
			// 		that.in_air = true;
			// 		that.angle = 0;
			// 		that.isOnSlope = false
			// 		that.mode = 'floor';
			// 	}

			// }


			if(that.mode === 'floor'
				|| that.mode === 'ceiling') {
				Xsp = that.speed_x * Math.cos((that.angle/180) * Math.PI );
				that.x += round(Xsp);
			} else if(that.mode === 'right-wall') {
				Xsp = that.speed_x * Math.sin((that.angle/180) * Math.PI );
				that.y += round(Xsp);
			}


		}

		// Wand simulieren
		if(that.x < 0 - 60)
			that.x = window.cfg.level_width;
			
		if(that.x > window.cfg.level_width)
			that.x = 0 - 60;

		if (that.sensors !== undefined) {
			that.updateSensors();
		}
	};

	that.collide = function() {};

	that.resetSensors = function() {
		for (var a in that.sensors) {
			that.sensors[a].colliding = false;
			that.sensors[a].colliding_with.clear();
		}
		that.colliding_sensors.clear();
	};

	/*
	 * Default “Dummy”-Animation
	 */
	that.Chill = function() {
		var foobar = {};

		foobar.id = 0;
		foobar.name = 'Chill';
		foobar.image = new Image();
		foobar.image.src = 'images/blank.png';
		foobar.breakable = function(foo) { return true; };
		foobar.loop = false;
		foobar.length = 1;

		foobar.frames = [];

		foobar.frames[0] = [];
		foobar.frames[0].width = 32;
		foobar.frames[0].height = 32;
		foobar.frames[0].margin = 0;

		foobar.enter = function(sm, obj) {
			obj.frame = 0;
		};
		foobar.update = function(sm, obj) {
		};
		foobar.exit = function(sm) {
		};

		return foobar;

	};

	that.sm = new EngineStateMachine();
	that.sm.changeState( that.Chill(), that );

	return that;
};
