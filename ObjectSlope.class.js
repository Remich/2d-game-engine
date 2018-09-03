var ObjectSlope = function() {

	var that = new ObjectStatic();

	that.name = 'slope';
	that.in_air = false;
	that.rolling = false;

	that.get_state = function() {
	};

	that.Chill = function() {
		var foobar = {};

		foobar.id = 0;
		foobar.name = 'Chill';
		foobar.image = new Image();
		foobar.image.src = 'images/Slope.png';
		foobar.breakable = function(foo) { return true; };
		foobar.loop = false;
		foobar.length = 1;

		foobar.frames = []; //new Array();

		foobar.frames[0] = []; //new Array();
		foobar.frames[0].width = 896;
		foobar.frames[0].height = 512;
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

	that.initSensors = function() {

		that.sensors = [];

		for(var i=0; i<that.heightMaps['floor'].length; i++) {

			var sensor            = {};
			sensor.x              = null;
			sensor.y              = null;
			sensor.width          = 1;
			sensor.height         = 128;
			sensor.sensor_type    = ["char", "beatnik", "ringbounce"];
			sensor.colliding_with = new Set();
			sensor.collide        = function(obj, b) {
				// that.collide(b, obj);
			};


			sensor.update = function(x, y, width, height) {
				sensor.x = x + i;
				sensor.y = y + that.heightMaps['floor'][i] + 12;
				sensor.width = 1; 
				sensor.height = 128;
			};

			sensor.update( that.x, that.y, that.sm.currentState.frames[floor(that.frames)].width, that.sm.currentState.frames[floor(that.frame)].height );
			that.sensors.push(sensor);
		}

		return true;
	};

	that.copyOfSensors = function() {

		var copy = [];

		for(var i=0; i<that.heightMaps['floor'].length; i++) {


			var sensor            = {};
			sensor.x              = null;
			sensor.y              = null;
			sensor.width          = 1;
			sensor.height         = 128;
			sensor.sensor_type    = ["char", "beatnik", "ringbounce"];
			sensor.colliding_with = new Set();
			sensor.collide        = function(obj, b) {
				// that.collide(b, obj);
			};

			sensor.update = function(x, y, width, height) {
				this.x = x + i;
				this.y = y + that.heightMaps['floor'][i] + 12;
				this.width = 1; 
				this.height = 128;
			};

			sensor.update( that.x, that.y, that.sm.currentState.frames[floor(that.frames)].width, that.sm.currentState.frames[floor(that.frame)].height );
			copy.push(sensor);
		}

	 	return copy;
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
			that.sensors[a].colliding_with.clear();
			that.sensors[a].colliding = false;
		}
		that.colliding_sensors.clear();
	};

	that.flip = function() {

		var copy = that.copyOfSensors();
		var index = 0;
		var tmp;

		for(var a=that.sensors.length-1; a>-1; a--) {

			tmp = that.sensors[a].width;
			copy[index].width = that.sensors[a].width;
			copy[index].height = that.sensors[a].height;
			copy[index].x = (that.x + that.getWidth() - that.sensors[a].x) + that.x - that.sensors[a].width;
			copy[index].y = that.sensors[a].y;
			index++;
		}
		that.sensors = copy;

		that.heightMaps['floor'] = flipArrayHorizontal(that.heightMaps['floor']);
		that.angleMaps['floor'] = flipArrayHorizontal(that.angleMaps['floor']);

		for(var a=0; a<that.angleMaps['floor'].length;a++) {
			that.angleMaps['floor'][a] = (-1) * that.angleMaps['floor'][a];
		}

	};



	that.heightMaps = Array();
	that.angleMaps = Array();

	that.heightMaps['floor'] = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 8, 8, 8, 8, 8, 8, 8, 8, 10, 10, 10, 10, 10, 10, 10, 10, 12, 12, 12, 12, 12, 12, 12, 12, 14, 14, 14, 14, 14, 14, 16, 16, 16, 16, 16, 16, 16, 16, 18, 18, 18, 18, 20, 20, 20, 20, 22, 22, 22, 22, 22, 22, 24, 24, 24, 24, 26, 26, 26, 26, 26, 26, 28, 28, 28, 28, 30, 30, 30, 30, 32, 32, 32, 32, 34, 34, 34, 34, 36, 36, 36, 36, 38, 38, 38, 38, 40, 40, 40, 40, 42, 42, 44, 44, 44, 44, 46, 46, 46, 46, 48, 48, 50, 50, 50, 50, 52, 52, 52, 52, 54, 54, 56, 56, 58, 58, 58, 58, 60, 60, 62, 62, 62, 62, 64, 64, 66, 66, 68, 68, 70, 70, 72, 72, 74, 74, 76, 76, 78, 78, 80, 80, 82, 82, 84, 84, 86, 86, 88, 88, 90, 90, 92, 92, 94, 94, 96, 96, 98, 98, 100, 100, 102, 102, 104, 104, 106, 106, 108, 108, 110, 110, 112, 112, 114, 114, 116, 116, 118, 118, 120, 120, 122, 122, 124, 124, 126, 126, 128, 128, 130, 130, 132, 132, 134, 134, 136, 136, 138, 138, 140, 140, 142, 142, 144, 144, 146, 146, 148, 148, 150, 150, 152, 152, 154, 154, 156, 156, 158, 158, 160, 160, 162, 162, 164, 164, 166, 166, 168, 168, 170, 170, 172, 172, 174, 174, 176, 176, 178, 178, 180, 180, 182, 182, 184, 184, 186, 186, 188, 188, 190, 190, 192, 192, 194, 194, 196, 196, 198, 198, 200, 200, 202, 202, 204, 204, 206, 206, 208, 208, 210, 210, 212, 212, 214, 214, 216, 216, 218, 218, 220, 220, 222, 222, 224, 224, 226, 226, 228, 228, 230, 230, 232, 232, 234, 234, 236, 236, 238, 238, 240, 240, 242, 242, 244, 244, 246, 246, 248, 248, 250, 250, 252, 252, 254, 254, 256, 256, 258, 258, 260, 260, 262, 262, 264, 264, 266, 266, 268, 268, 270, 270, 272, 272, 274, 274, 276, 276, 278, 278, 280, 280, 282, 282, 284, 284, 286, 286, 288, 288, 290, 290, 292, 292, 294, 294, 296, 296, 298, 298, 300, 300, 302, 302, 304, 304, 306, 306, 308, 308, 310, 310, 312, 312, 314, 314, 316, 316, 318, 318, 320, 320, 322, 322, 324, 324, 326, 326, 328, 328, 330, 330, 332, 332, 334, 334, 336, 336, 338, 338, 340, 340, 342, 342, 344, 344, 346, 346, 348, 348, 350, 350, 352, 352, 354, 354, 356, 356, 358, 358, 360, 360, 362, 362, 364, 364, 366, 366, 368, 368, 370, 370, 372, 372, 374, 374, 376, 376, 378, 378, 380, 380, 382, 382, 384, 384, 386, 386, 388, 388, 390, 390, 392, 392, 394, 394, 396, 396, 398, 398, 400, 400, 402, 402, 404, 404, 406, 406, 408, 408, 410, 410, 412, 412, 414, 414, 416, 416, 418, 418, 420, 420, 422, 422, 424, 424, 426, 426, 428, 428, 430, 430, 432, 432, 434, 434, 436, 436, 438, 438, 440, 440, 442, 442, 444, 444, 446, 446, 448, 448, 448, 448, 450, 450, 452, 452, 452, 452, 454, 454, 456, 456, 458, 458, 458, 458, 460, 460, 460, 460, 462, 462, 464, 464, 464, 464, 466, 466, 466, 466, 468, 468, 470, 470, 470, 470, 472, 472, 472, 472, 474, 474, 474, 474, 476, 476, 476, 476, 478, 478, 478, 478, 480, 480, 480, 480, 482, 482, 482, 482, 484, 484, 484, 484, 484, 484, 486, 486, 486, 486, 488, 488, 488, 488, 488, 488, 490, 490, 490, 490, 492, 492, 492, 492, 492, 492, 494, 494, 494, 494, 494, 494, 496, 496, 496, 496, 496, 496, 498, 498, 498, 498, 498, 498, 498, 498, 500, 500, 500, 500, 500, 500, 500, 500, 502, 502, 502, 502, 502, 502, 502, 502, 504, 504, 504, 504, 504, 504, 504, 504, 504, 504, 506, 506, 506, 506, 506, 506, 506, 506, 506, 506, 506, 506, 506, 506, 508, 508, 508, 508, 508, 508, 508, 508, 508, 508, 508, 508, 508, 508, 508, 508, 508, 508, 510, 510, 510, 510, 510, 510, 510, 510, 510, 510, 510, 510, 510, 510, 510, 510, 510, 510, 510, 510, 510, 510, 510, 510, 510, 510 ];


	that.angleMaps['floor'] = [ 0, 0, 0, 0, 0, 2, 4, 8, 16, 40, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 40, 16, 8, 4, 2, 0 ];


	return that;

};
