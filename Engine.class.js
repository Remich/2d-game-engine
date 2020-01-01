/* (c)opyright 2018 René Michalke */

// TODO: move somewhere better
var default_width = 960;
var default_height = 720;

var Engine = function() {

	// current gameframe
	this.gameframe = 0;

	// boolean, to disable fps limit (benchmark mode)
	// best combined with show_debug = true
	this.bench = false;

	// boolean, to show fps in the top right corner
	this.show_fps = true;
	
	// boolean, to show debug info in the top right corner
	this.show_debug = true;

	// boolean, to show ring score
	this.show_rings = true;

	// boolean, to show sensors (hitboxes)
	this.show_sensors = false;

	// boolean, to output 60fps
	// false means 30fps
	this.fps60 = true;

	// boolean, to enable editor mode
	this.editor = false;

	// Quadtree for fast collisions
	this.quadtree = true;

	// Pause
	this.pause = false;
	
	// Game Objects
	this.objects = null;


	/*
	 * change speedup according to fps speed
	 * this ”speedup_constant” defines how sluggish/slow the movements feel
	 *
	 * one could simulate an object underwater by changing this speedup_constant
	 * on a ”per-object” basis
	 */
	if(this.fps60 === true) {
		this.fps_max = 60;
		window.cfg.speedup_constant = 1.0;
	} else {
		this.fps_max = 30;
		window.cfg.speedup_constant = 2.0; // TODO fix this: set to 1.0 or something else
	}

	// webworker for parallel calculations (NOT IN USE)
	this.worker = null;

	// update Browser Cache
	this.updateCache();

	// get handlers of both drawing buffers
	this.buffers = [ 
		document.getElementById("canvas_1"), 
		document.getElementById("canvas_2")
	];

	// index to address which buffer is currently the drawing buffer
	this.drawing_buffer = 0;

	// actual canvas-api object
	this.canvas = this.buffers[this.drawing_buffer].getContext("2d");

	// disable image smoothing
	this.canvas.imageSmoothingEnabled = false;

	// set zoom along the x-axis
	this.canvas_zoom_width = 1.0;

	// set zoom along the y-axis
	this.canvas_zoom_height = 1.0;

	// initalize actual screen in browser
	this.initScreen();

	// initalize Input Handler
	this.InputHandler = new InputHandler();

	// initalize Collision Handler
	this.Collision = new Collision();
	
	// initialize QuadTree for Collision Detection
	this.initQuadTree({x: 0, y: 0, width: window.cfg.level_width, height: window.cfg.level_height});

	// toggle Pause
	document.addEventListener("keydown", function(e) {
		var key = e.keyCode ? e.keyCode : e.which;
		if (key === 13) {
			window.myEngine.pause = ! window.myEngine.pause;
		}	
	});
};

/*
 * Returns the length of a gameframe in ms
 */
Engine.prototype.get_interval = function () {
	if(this.bench) {
		return 0;
	} else {
		return 1000 / this.fps_max;
	}
};

/*
 * Updates the Browser Cache
 */
Engine.prototype.updateCache = function() {
	window.addEventListener('load', function (e) {
		window.applicationCache.addEventListener('updateready', function (e) {
			window.location.reload();
		}, false);
	}, false);
};

Engine.prototype.isPaused = function() {
		return this.pause;
};

/*
 * Init Screen in the Browser
 */
Engine.prototype.initScreen = function(camx, camy) {

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
};


/*
 * reset sensors to their default state, for next round of collisions
 */
Engine.prototype.resetSensors = function(objs) {
	objs.each(function(handle) {
		if(handle.sensors !== undefined) {
			handle.resetSensors();
		}
	});
	return true;	
};

/*
 * Draw the current Scene
 */
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

	/*
	 * Check if the object's frame numbers are overflowing
	 * and reset them accordingly
	 */
	this.frame_check = function (obj) {
		if (obj.frame >= obj.sm.currentState.length) {
			if (obj.sm.currentState.loop !== false) 
				obj.frame = 0;
			else
				obj.frame = obj.sm.currentState.length-1;
		}
	};

	/*
	 * Check if the object is within the drawing Screen
	 */
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

		/*
		 * TODO 
		 * this fails on trees, why?
		 * Answer: ObjectBackgroundTree is of type Background
		 */
		if (Collision.collision_check_single_strict_with_sensor(obj_a, obj_b)) {
			return true;
		}

		return false;
	};

	/*
	 * Draw all Sensors of current Object
	 */
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

	this.adjust_position = function(obj) {

		if (obj.history.length === 0)
			return false;
		if (!obj.sm.currentState)
			return false;


		/*
		 * TODO
		 * NOT WORKING DUE TO HEIGHTMAP
		 * RE-IMPLEMENT
		 * this should change the x and y-positions of an object
		 * according to the delta-width, and delta-height
		 * bettween two animation frames
		 * NOTE: then we can remove ”ObjectChar.class.js line 203,204)
		 *				and won't have to check for many other animation-states
		 */

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
	    	width * obj.speed_z,
	    	height * obj.speed_z,
	    	width / 2 * (-1),
	    	height / 2 * (-1),
	    	width,
	    	height
			);

	    //reset the canvas  
	    ctx.restore();
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

	/*
	 * Object has been destroyed, don't draw
	 */
	if (obj.destroy) {
		return false;
	}
	
	/*
	 * Object is of type Background
	 */
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

		window.myEngine.canvas.fillRect(0, 0, obj.getWidth(), obj.getHeight());

		window.myEngine.canvas.restore();

		return true;
	}


	/*
	 * Object is within drawing Screen, so keep on drawing
	 */
	if( !this.withinScreen(obj, camx, camy) ) {
		return false;
	}


	/*
	 * Object is blinking
	 */
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

	/*
	 * Should we explicitly not render this Object?
	 */
 	if(!obj.render) {
 		return false;
 	}

	/*
	 * Render the Object
	 */
	this.drawImageRot(obj.sm.currentState.image, sx, sy, dx, dy, dw, dh, obj.angle, obj);

	/*
	 * Draw Sensors
	 */
	if (window.myEngine.show_sensors && obj.sensors !== undefined) {
		this.drawSensors(obj);	
	}

	/*
	 * Draw Callback (for debug)
	 */
	if(window.myEngine.drawCallback !== undefined)
		window.myEngine.drawCallback();

};

/*
 * Main Game Loop
 */

var rings = 0;

Engine.prototype.loop = function() {
	
	var objects = window.myEngine.objects
	
	// pause?
	if(window.myEngine.pause === true) 
		return;

	// Get the time when the frame started.
	var frame_time = new Date().getTime();

	// The elapsed milliseconds per frame
	window.cfg.elapsed_time = (frame_time - window.cfg.last_time);
	
	// reset buffer
	window.myEngine.canvas.clearRect(0,0, window.cfg.screen_width, window.cfg.screen_height);

	/*
	 * Check spawn status
	 * Note: We can't use objects.each() here.
	 * Because we really want to iterate over all objects
	 */
	for (var a in objects.myList) {
		if (objects.myList[a] === undefined)
			continue;
		/*
		 * dirty workaround for backgrounds, because of parallax scrolling
		 * TODO: use repeat-x, repeat-y and  parallax scrolling position, to determine if it is within screen
		 */
		if (objects.myList[a].name === "background")
			objects.myList[a].spawned = true;
		else
			objects.myList[a].spawned = window.myEngine.isWithinScreen(objects.myList[a]);
	}
	
	// debug test, to see if spawn / despawn is working
	rings = 0;
	objects.each(function(handle) {
		if(handle.name === "ring") {
			rings++;
		}
	});
	
	// get state for each statemachine
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

	/*
	 * Change direction
	 */
	objects.each(function(handle) {
		if (handle.direction !== undefined)
			handle.direction();
	});

	
	/*
	 * Reset Sensors of all collidable Objects
	 */
	objects.each(function(handle) {
		if (handle.name === 'char' ||
			handle.name === 'beatnik' ||
			handle.name === 'ringbounce')
 			window.myEngine.resetSensors(objects);
	});


	/*
	 * Physics a.k.a. changing an Objects x and y position 
	 * according to its State
	 */
	objects.each(function(handle) {
		if(handle.physics !== undefined)
			handle.physics();
	});

	/*
	 * Update width and height
	 */
	objects.each(function(handle) {
		handle.updateDimensions();
	});

	/*
	 * Collisions
	 */

	// Check if Object is solid, then add it to collidable Objects
	objects.each(function(handle) {
		if (handle.solid === true)
			window.myEngine.Collision.add(handle);	
		else
			window.myEngine.Collision.rm(handle);
	});

	// Clear and Rebuild QuadTree
	window.myEngine.Collision.rebuildQuadTree();
	
	// Check for Collisions 
	window.myEngine.Collision.check();

	// Act out Collisions
	window.myEngine.Collision.act();

	// re-calculate Angles of collided Objects
	window.myEngine.Collision.correctAngles();


	/*
	 * Camera
	 */

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

	/*
	 * Drawing
	 */

	//  Objekt zeichnen - CSS Stuff
	objects.each(function(handle) {
		window.myEngine.draw(handle, window.myEngine.Camera.xScroll, window.myEngine.Camera.yScroll);
	});
	
	/*
	 * Update width and height; YES, AGAIN
	 */
	objects.each(function(handle) {
		handle.updateDimensions();
	});


	// Sachen für nächsten Durchlauf merken 
	objects.each(function(handle) {
		if( handle.saveHistory !== undefined )
			handle.saveHistory();		
	});

	
	/*
	 * remove destroy objects
	 */
	objects.each(function(handle) {
		if(handle.destroy !== undefined && handle.destroy)
			objects.remove(handle.id);
	});

	/*
	 * Some Objects have callbacks which get called before their destruction (e.g. Rings)
	 * Here they are called
	 */
	objects.each(function(handle) {
		if(handle.callback !== undefined) {
			handle.callback(objects, handle.rings);
		}

		delete handle.callback;
		// TODO delete handle??
	})

	// switch buffers
	window.myEngine.buffers[1-window.myEngine.drawing_buffer].style.visibility='hidden';
	window.myEngine.buffers[window.myEngine.drawing_buffer].style.visibility='visible';

	window.myEngine.drawing_buffer = 1 - window.myEngine.drawing_buffer;
	window.myEngine.canvas = window.myEngine.buffers[window.myEngine.drawing_buffer].getContext("2d");
	window.myEngine.canvas.imageSmoothingEnabled = false;
	window.myEngine.canvas.webkitImageSmoothingEnabled = false;
	window.myEngine.canvas.mozImageSmoothingEnabled = false;

	/*
	 * draw debuging and stats
	 */
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
	var obj = window.myEngine.objects.getByName('char')
	$('#debug').html(
		'x: '         + obj.x          + '<br>' +
		'y: '         + obj.y          + '<br>' +
		'speed_x: '   + obj.speed_x    + '<br>' +
		'speed_y: '   + obj.speed_y    + '<br>' +
		'gameframe: ' + this.gameframe + '<br>' +
		'angle: '			+ obj.angle			 + '<br>'
	);
};
Engine.prototype.rings = function() {
	var obj = objects.getByName("char");
	$('#debug').html('rings: ' + obj.rings);
};

Engine.prototype.initQuadTree = function(boundaries) {
	this.quadtree = new QuadTree(boundaries, false, 7);
};

// TODO move somewhere
var drawSquare = function(x, y, width, height) {
	var ctx = window.myEngine.canvas;
	ctx.save();
	ctx.fillStyle = 'rgba(255,0,0,1)';
	ctx.fillRect(
		x - window.myEngine.Camera.xScroll, 
		y - window.myEngine.Camera.yScroll,
		width,
		height
	);
	ctx.restore();
}

Engine.prototype.isWithinScreen = function(handle) {

	obj_a = {
		'x' : handle.x,
		'y' : handle.y,
		'width'  : handle.getWidth(),
		'height' : handle.getHeight()
	};

	obj_b = {
		'x' : window.myEngine.Camera.xScroll,
		'y' : window.myEngine.Camera.yScroll,
		'width'  : window.cfg.screen_width / window.myEngine.canvas_zoom_width,
		'height' : window.cfg.screen_height / window.myEngine.canvas_zoom_height
	};

	// for debugging
	// window.myEngine.drawCallback = function()	{
	// 	drawSquare(obj_b.x, obj_b.y, obj_b.width, obj_b.height);
	// };

	return Collision.collision_check_single_strict_with_sensor(obj_a, obj_b);
};
