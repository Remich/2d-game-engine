/* (c)opyright 2018 René Michalke */

// TODO: move somewhere better
var default_width = 960;
var default_height = 720;

var Engine = function() {
	this.gameframe = 0;
	this.bench = false;
	this.show_fps = false;
	this.show_debug = true;
	this.show_rings = true;
	this.show_sensors = false;
	this.fps60 = true; // false means 30fps
	this.editor = false;

	if(this.fps60 === true) {
		this.fps_max = 60;
		window.cfg.speedup_constant = 2.0;
	} else {
		this.fps_max = 30;
		window.cfg.speedup_constant = 4.0;
	}

	this.worker = null;
	this.updateCache();
	this.buffers = [document.getElementById("canvas_1"), document.getElementById("canvas_2")];
	this.drawing_buffer = 0;
	this.canvas = this.buffers[this.drawing_buffer].getContext("2d");
	this.canvas.imageSmoothingEnabled = false;
	this.canvas.webkitImageSmoothingEnabled = false;
	this.canvas.mozImageSmoothingEnabled = false;
	this.canvas_zoom_width = 1.0;
	this.canvas_zoom_height = 1.0;
	this.initScreen();
	this.initInputHandler();
};

Engine.prototype.Collision = new Collision();

Engine.prototype.get_interval = function () {
	if(this.bench) {
		return 0;
	} else {
		return 1000 / this.fps_max;
	}
};


Engine.prototype.updateCache = function() {
	window.addEventListener('load', function (e) {
		window.applicationCache.addEventListener('updateready', function (e) {
			window.location.reload();
		}, false);
	}, false);
};

Engine.prototype.initScreen = function() {

	this.canvas_zoom_width = window.innerWidth / default_width;
	this.canvas_zoom_height = window.innerHeight / default_height;


	if (typeof window.innerWidth !== 'undefined')  {
		window.cfg.screen_width = window.innerWidth;
		window.cfg.screen_height = window.innerHeight;
	}

	change_size('html', window.cfg.screen_width, window.cfg.screen_height);
	change_size('body', window.cfg.screen_width, window.cfg.screen_height);
	
	if(!this.show_debug && !this.show_rings) 
		$('#debug').css('display', 'none');

	if(!this.show_fps) 
		$('#fps').css('display', 'none');

	window.cfg.level_width = 6400;
	window.cfg.level_height = 2800;
	
	$('#' + this.buffers[0].id).attr({'width' :  window.cfg.screen_width,
										'height' : window.cfg.screen_height});
	$('#' + this.buffers[1].id).attr({'width' :  window.cfg.screen_width,
										'height' : window.cfg.screen_height});

	// scale canvas
	// if(scaled == false) {
		this.buffers[0].getContext("2d").scale(this.canvas_zoom_width, this.canvas_zoom_height);
		this.buffers[1].getContext("2d").scale(this.canvas_zoom_width, this.canvas_zoom_height);
		scaled = true;
	// }

Engine.prototype.Camera = new Camera(0, 0, window.cfg.screen_width*(1/this.canvas_zoom_width), window.cfg.screen_height*(1/this.canvas_zoom_height), window.cfg.level_width, window.cfg.level_height);
};



Engine.prototype.initInputHandler = function() {

	$(document).keydown(function(e) {
		var add_key = function(keyCode, obj) { if(obj.pressed_keys[obj.pressed_keys.length-1] != keyCode && in_array(keyCode, obj.assigned_keys) && !in_array(keyCode, obj.pressed_keys)) { obj.pressed_keys[obj.pressed_keys.length] = keyCode; } }; 
		objects.each(function(handle) {
			if(handle.assigned_keys === undefined || handle.assigned_keys.length < 0)
				return false;
			if(in_array(e.keyCode, handle.assigned_keys))
				add_key(e.keyCode, handle); 
		});

	});				

	$(document).keyup(function(e) {

		var remove_key = function(keyCode, obj) {
			if(in_array(keyCode, obj.pressed_keys))
				obj.pressed_keys.splice(get_array_key(keyCode, obj.pressed_keys), 1);
				
			if(obj.released_keys.length > 0)
				obj.released_keys.splice(1, 1);
				
			if(obj.released_keys[obj.released_keys.length-1] != keyCode && in_array(keyCode, obj.assigned_keys) && !in_array(keyCode, obj.released_keys))
				obj.released_keys[obj.released_keys.length] = keyCode;
		};

		objects.each(function(handle) {
			if (handle.assigned_keys === undefined || handle.assigned_keys.length < 0)
				return false;
			if (!in_array(e.keyCode, handle.assigned_keys))
				return false;
			if (handle.pressed_keys === undefined || handle.pressed_keys.length < 0)
				return false;

			if (in_array(e.keyCode, handle.pressed_keys)) {
				remove_key(e.keyCode, handle);
				if (handle.sm.currentState.onKeyUp !== undefined)
					handle.sm.currentState.onKeyUp(handle);
			} 
		});
	});
};

Engine.prototype.resetSensors = function() {
	objects.each(function(handle) {
		if(handle.sensors !== undefined) {
			handle.resetSensors();
		}
	});
	return true;	
};

Engine.prototype.draw = function(obj, camx, camy) {

	this.frame_update = function (obj) {


		if(round(obj.frame_counter) === 0) {
			obj.frame++;
			obj.frame_counter = obj.frame_duration;
		}

		if(window.myEngine.fps60 === true)
			obj.frame_counter -= 0.5;
		else
			obj.frame_counter -= 1;


		// obj.frame++;

		// // heavy math
		// obj.frame_speed = 0.05 + Math.abs(1/140*obj.speed_x);
		// //obj.frame_speed = (1 / (obj.top-Math.abs(obj.speed_x)));
		
		// //obj.frame_speed = Math.abs(obj.speed_x) / 6;
		// obj.frame += obj.frame_speed * filter_fps_lag();

	};

	this.frame_check = function (obj) {
		if (obj.frame >= obj.sm.currentState.length) {
			if (obj.sm.currentState.loop !== false) 
				obj.frame = 0;
			else
				obj.frame = obj.sm.currentState.length-1;
		}
	};

	this.collision_check_single_easy = function (a, b) {
		if( a.x  > (b.x + b.width) )
			return false;
		if( ( a.x  + a.width) < b.x )
			return false;
		if( a.y  >  (b.y + b.height) )
			return false;
		if( ( a.y + a.height ) <  b.y )
			return false;
		
		return true;
	};

	this.withinScreen = function(obj, camx, camy) {
		var c_frame 		= floor(obj.frame);
		var c_screen_width 	= window.cfg.screen_width * (1/window.myEngine.canvas_zoom_width);
		var c_screen_height = window.cfg.screen_height * (1/window.myEngine.canvas_zoom_height);
		obj_a = {
			'x' 	 : obj.x,
			'y' 	 : obj.y,
			'width'	 : obj.sm.currentState.frames[c_frame].width,
			'height' : obj.sm.currentState.frames[c_frame].height
		};
		obj_b = {
			'x'		 : camx - c_screen_width / 2,
			'y'		 : camy - c_screen_height / 2,	
			'width'  : c_screen_width * 2,
			'height' : c_screen_height * 2
		};

		if (this.collision_check_single_easy(obj_a, obj_b)) {
			return true;
		}

		return false;
	};

	this.drawSensors = function(obj) {
		for (var a in obj.sensors) {
			window.myEngine.canvas.fillStyle = obj.sensors[a].colliding ? 'rgba(255,0,0,1)' : 'rgba(0,0,255,.5)';
			window.myEngine.canvas.fillRect(
				round(obj.sensors[a].x - camx), 
				round(obj.sensors[a].y - camy),
				obj.sensors[a].width,
				obj.sensors[a].height
			);
		}
	};



	var TO_RADIANS = Math.PI/180; 
	window.myEngine.drawRotatedImage = function(image, x, y, width, height, angle) {
	   
	};

	this.adjust_position = function(obj) {

		if (obj.history.length === 0)
			return false;
		if (!obj.sm.currentState)
			return false;


		// TODO
		// NOT WORKING DUE TO HEIGHTMAP

		// if(obj.name === 'char' && obj.angle < 0)
		// 	obj.y += 55 * Math.sin(obj.angle / 180) * Math.PI;
		// if(obj.name === 'char' && obj.angle > 0)
		// 	obj.y += Math.sin(obj.angle / 180) * Math.PI;

		// // adjust vertical position by change of frame

  //       var height_now = obj.sm.currentState.frames[floor(obj.frame)].height;
  //       var width_now = obj.sm.currentState.frames[floor(obj.frame)].width;
  //       var height_old = obj.history[obj.history.length-1].sm.currentState.frames[floor(obj.history[obj.history.length-1].frame)].height;
  //       var width_old = obj.history[obj.history.length-1].sm.currentState.frames[floor(obj.history[obj.history.length-1].frame)].width;

  //       obj.y += height_old - height_now;	

  //       // adjust horizontal position by change of frame
  //       console.log("adjusting: " + (width_old - width_now));
  //           obj.x += width_old - width_now;
 

	};


	this.drawImageRot = function(img, sx, sy, x, y, width, height, deg, obj){

		var ctx = window.myEngine.canvas;
	    ctx.save();


		// window.myEngine.canvas.drawImage(obj.sm.currentState.image, sx, sy, dw, dh, -dx, dy, dw, dh);

	    //Set the origin to the center of the image
	    var delx = x - camx + width / 2;
	    var dely = y - camy + height / 2;
	    ctx.translate(delx, dely);

	    if(obj.flipped === true) {
			window.myEngine.canvas.scale(-1, 1);
			deg = deg + 2*(360 - deg);		    
		}

	    //Convert degrees to radian 
	    var rad = deg * Math.PI / 180;
	    //Rotate the canvas around the origin
	    ctx.rotate(rad);


	    //draw the image    
	    ctx.drawImage(
	    	img,
	    	sx,
	    	sy,
	    	width,
	    	height,
	    	width / 2 * (-1),
	    	height / 2 * (-1),
	    	width,
	    	height);

	    //reset the canvas  
	    ctx.restore();
	    // ctx.rotate(rad * ( -1 ) );
	    // ctx.translate((x + width / 2) * (-1), (y + height) * (-1));
	}

	var obj_frame = floor(obj.frame);
	// Frameeinstellungen des Objekts
	// TODO: auf obj.sm.currentState.frame_update() umstellen
	if(obj.frame_update !== undefined)
		obj.frame_update();
	else
		this.frame_update(obj);


	this.frame_check(obj);
	this.adjust_position(obj);

	var obj_active_frame_now = obj.sm.currentState.frames[obj_frame];

	var sx = width(obj.sm.currentState.frames, obj_frame);
	var sy = obj.sm.currentState.image.height - obj_active_frame_now.height;
	
	var dw = obj_active_frame_now.width;
	var dh = obj_active_frame_now.height;
	
	var dx = round(obj.x);
	var dy = round(obj.y);

	if (obj.destroy) {
		return false;
	}
	
	if (obj.name === 'background') {
		window.myEngine.canvas.save();
		var pat = window.myEngine.canvas.createPattern(obj.sm.currentState.image, obj.repeat); // or "repeat" for x and y
		window.myEngine.canvas.fillStyle = pat;

		if(obj.fixed === false) {
			window.myEngine.canvas.translate(-camx, -camy);
		}

		window.myEngine.canvas.translate(obj.x, obj.y);

		// parallax scrolling
		if(obj.scroll > 0) {
			window.myEngine.canvas.translate((camx)*obj.scroll, 0);
		}	

		window.myEngine.canvas.fillRect(0, 0, window.cfg.level_width, window.cfg.level_height);
		window.myEngine.canvas.restore();
		return true;
	}

	if( !this.withinScreen(obj, camx, camy) ) {
		return false;
	}


	if(obj.blinking) {

		if(obj.gameframe_blink == 0) {
			obj.blinking_frame_count = window.myEngine.gameframe + obj.blinking_duration;
			obj.render = false;
		} else {
	 		if(window.myEngine.gameframe >= obj.blinking_frame_count) {
	 			obj.render = !obj.render;
		 		obj.blinking_frame_count = window.myEngine.gameframe + obj.blinking_duration;
	 		}
	 	}
 	
	}

 	if(!obj.render) {
 		return false;
 	}

	this.drawImageRot(obj.sm.currentState.image, sx, sy, dx, dy, dw, dh, obj.angle, obj);
	
	if (window.myEngine.show_sensors && obj.sensors !== undefined) {
		this.drawSensors(obj);	
	}

};

Engine.prototype.loop = function() {
	// Get the time when the frame started.
	var frame_time = new Date().getTime();

	// The elapsed milliseconds per frame
	window.cfg.elapsed_time = (frame_time - window.cfg.last_time);

	// reset buffer
	window.myEngine.canvas.clearRect(0,0, window.cfg.screen_width, window.cfg.screen_height);

	objects.each(function(handle) {
		if (handle.get_state !== undefined)
			handle.get_state();
	});

	// Hat Objekt Input ? Nein, dann leerlauf
	objects.each(function(handle) {
		if (handle.hasInput !== undefined && !handle.hasInput() && handle.leer !== undefined)
		 	handle.leer();
	});

	// Reagiere auf Input 
	objects.each(function(handle) {
		if (handle.sm) {
			handle.sm.update(handle);
			// console.log(handle.sm.currentState.name);
		}
	});

	objects.each(function(handle) {
		if (handle.direction !== undefined)
			handle.direction();
	});


	objects.each(function(handle) {
		if (handle.name === 'char' ||
			handle.name === 'beatnik' ||
			handle.name === 'ringbounce')
 			window.myEngine.resetSensors();
	});


	objects.each(function(handle) {
		if(handle.physics !== undefined)
			handle.physics();
	});


	// Check if object is solid, then add it to the collision plane
	objects.each(function(handle) {
		if (handle.solid === true)
			window.myEngine.Collision.add(handle);	
		if (handle.solid === false)
			window.myEngine.Collision.rm(handle);
	});

	objects.each(function(handle) {
		if (handle.name === 'char' ||
			handle.name === 'beatnik' ||
			handle.name === 'ringbounce') {
			handle.in_air = true;
			window.myEngine.Collision.check( handle.id );	
		}
	});

	// Follow ObjectChar with Camera
	objects.each(function(handle) {
		if (handle.name === 'char') { 
			if (window.myEngine.Camera.following === null) {
		 		window.myEngine.Camera.follow(handle);
		 	}
		}
	});

	// update Camera
	window.myEngine.Camera.update();

	//  Objekt zeichnen - CSS Stuff
	objects.each(function(handle) {
		window.myEngine.draw(handle, window.myEngine.Camera.xScroll, window.myEngine.Camera.yScroll);
	});



	// Sachen f?r n?chsten Durchlauf merken 
	objects.each(function(handle) {
		if( handle.saveHistory !== undefined )
			handle.saveHistory();		
	});

	objects.each(function(handle) {
		if(handle.destroy !== undefined && handle.destroy)
			objects.remove(handle.id);
	});

	objects.each(function(handle) {
		if(handle.callback !== undefined) {
			handle.callback(objects, handle.rings);
		}

		delete handle.callback;
	})

	// switch buffers
	window.myEngine.buffers[1-window.myEngine.drawing_buffer].style.visibility='hidden';
	window.myEngine.buffers[window.myEngine.drawing_buffer].style.visibility='visible';

	window.myEngine.drawing_buffer = 1 - window.myEngine.drawing_buffer;
	window.myEngine.canvas = window.myEngine.buffers[window.myEngine.drawing_buffer].getContext("2d");
	window.myEngine.canvas.imageSmoothingEnabled = false;
	window.myEngine.canvas.webkitImageSmoothingEnabled = false;
	window.myEngine.canvas.mozImageSmoothingEnabled = false;

	// debugging, stats
	if(this.show_debug === true)
		this.debug(); 
	else if(this.show_rings === true)
		this.rings();

	if(this.show_fps)
		this.fps();

	window.cfg.last_time = frame_time;

	this.gameframe++;
	
};

Engine.prototype.fps_seconds = new Date().getSeconds();
Engine.prototype.fps_count = 0;	
Engine.prototype.fps = function() {
	if(this.fps_seconds == new Date().getSeconds())
		++this.fps_count;
	else {
		this.fps_seconds = new Date().getSeconds();
		$('#fps').html('fps: '+this.fps_count);
		this.fps_count = 0;	
	}
};

Engine.prototype.debug = function() {
	var obj = objects.getByName('char');
	$('#debug').html('x: ' + round(obj.x) + '<br>' + 
	'y: ' + round(obj.y) + '<br>' + 
	'speed_x: ' + round(obj.speed_x) + '<br>' + 
	'speed_y: ' + round(obj.speed_y) + '<br>');
};
Engine.prototype.rings = function() {
	var obj = objects.getByName("char");
	$('#debug').html('rings: ' + obj.rings);
};
