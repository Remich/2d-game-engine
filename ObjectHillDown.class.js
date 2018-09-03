var ObjectHillDown = function() {

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
		foobar.image.src = 'images/HillDown.png';
		foobar.breakable = function(foo) { return true; };
		foobar.loop = false;
		foobar.length = 1;

		foobar.frames = [];

		foobar.frames[0] = [];
		foobar.frames[0].width = 512;
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
			sensor.height         = 256;
			sensor.sensor_type    = ["char", "beatnik", "ringbounce"];
			sensor.type           = 'ground';
			sensor.type_other     = ["ground"];
			sensor.colliding_with = new Set();
			sensor.collide        = function(obj, b) {
				// that.collide(b, obj);
			};

			sensor.update = function(x, y, width, height) {
				sensor.x = x + i;
				sensor.y = y + that.heightMaps['floor'][i];// + 12; // + 12 if in grass or something
				sensor.width = 1; 
				sensor.height = 256;
			};

			sensor.update( that.x, that.y, that.sm.currentState.frames[floor(that.frames)].width, that.sm.currentState.frames[floor(that.frame)].height );
			that.sensors.push(sensor);
		}
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

	that.heightMaps = Array();
	that.angleMaps = Array();
	
	that.heightMaps['floor'] = [ 
		11, 11, 12, 12, 12, 13, 13, 14, 14, 15, 
		15, 16, 17, 17, 18, 18, 18, 18, 19, 19, 
		20, 21, 21, 22, 22, 23, 23, 24, 24, 24, 
		25, 25, 26, 26, 27, 28, 28, 29, 29, 30, 
		30, 30, 31, 31, 32, 32, 33, 33, 34, 35, 
		35, 36, 36, 37, 37, 37, 38, 38, 39, 39, 
		40, 40, 41, 41, 42, 43, 43, 43, 43, 44, 
		44, 45, 46, 46, 47, 47, 48, 48, 49, 49, 
		49, 50, 50, 51, 51, 52, 53, 53, 54, 54, 
		55, 55, 55, 56, 56, 57, 57, 58, 58, 59, 
		59, 60, 61, 61, 61, 61, 62, 62, 63, 64, 
		64, 65, 65, 66, 66, 67, 67, 67, 68, 68, 
		69, 69, 70, 71, 71, 72, 72, 73, 73, 73, 
		74, 74, 75, 75, 76, 76, 77, 77, 78, 79, 
		79, 80, 80, 80, 81, 81, 82, 82, 83, 83, 
		84, 84, 85, 86, 86, 86, 86, 87, 87, 88, 
		89, 89, 90, 90, 91, 91, 92, 92, 92, 93, 
		93, 94, 94, 95, 95, 96, 97, 97, 98, 98, 
		98, 99, 99, 100, 100, 101, 101, 102, 102, 103, 
		104, 104, 104, 104, 105, 105, 106, 107, 107, 108, 
		108, 109, 109, 110, 110, 110, 111, 111, 112, 112, 
		113, 113, 114, 115, 115, 116, 116, 116, 117, 117, 
		118, 118, 119, 119, 120, 120, 121, 122, 122, 123, 
		123, 123, 124, 124, 125, 125, 126, 126, 127, 127, 
		128, 128, 129, 129, 129, 130, 130, 131, 131, 132, 
		133, 133, 134, 134, 135, 135, 135, 136, 136, 137, 
		137, 138, 138, 139, 140, 140, 141, 141, 141, 141, 
		142, 142, 143, 144, 144, 145, 145, 146, 146, 147, 
		147, 147, 148, 148, 149, 149, 150, 151, 151, 152, 
		152, 153, 153, 153, 154, 154, 155, 155, 156, 156, 
		157, 158, 158, 159, 159, 159, 159, 160, 160, 161, 
		162, 162, 163, 163, 164, 164, 165, 166, 166, 166, 
		166, 167, 167, 168, 169, 169, 170, 170, 171, 171, 
		172, 172, 172, 173, 173, 174, 174, 175, 176, 176, 
		177, 177, 178, 178, 178, 179, 179, 180, 180, 181, 
		181, 182, 182, 183, 184, 184, 184, 184, 185, 185, 
		186, 187, 187, 188, 188, 189, 189, 190, 190, 190, 
		191, 191, 192, 192, 193, 194, 194, 195, 195, 196, 
		196, 196, 197, 197, 198, 198, 199, 199, 200, 200, 
		201, 202, 202, 202, 202, 203, 203, 204, 205, 205, 
		206, 206, 207, 207, 208, 209, 209, 209, 209, 210, 
		210, 211, 212, 212, 213, 213, 214, 214, 215, 215, 
		215, 216, 216, 217, 217, 218, 218, 219, 220, 220, 
		221, 221, 221, 222, 222, 223, 223, 224, 224, 225, 
		225, 226, 227, 227, 227, 227, 228, 228, 229, 230, 
		230, 231, 231, 232, 232, 233, 233, 233, 234, 234, 
		235, 235, 236, 236, 237, 238, 238, 239, 239, 239, 
		240, 240, 241, 241, 242, 242, 243, 243, 244, 245, 
		245, 245, 245, 246, 246, 247, 248, 248, 249, 249, 
		250, 250, 251, 251, 251, 252, 252, 253, 253, 254, 
		255, 255, 256, 256, 257, 257, 257, 258, 258, 259, 
		259, 260, ];


	var i = 0;
	for(i=0; i <  that.heightMaps['floor'].length; i++) {
		that.heightMaps['floor'][i] -= 8;
	};

		// 4, 4, 6, 6, 2, 2, 0, 0, 6, 6, 
		// 8, 8, 2, 2, 6, 6, 12, 12, 14, 14, 
		// 10, 10, 8, 8, 14, 14, 16, 16, 10, 10, 
		// 12, 12, 20, 20, 22, 22, 18, 18, 16, 16, 
		// 22, 22, 24, 24, 18, 18, 16, 16, 26, 26, 
		// 30, 30, 24, 24, 26, 26, 30, 30, 32, 32, 
		// 26, 26, 30, 30, 36, 36, 38, 38, 34, 34, 
		// 32, 32, 38, 38, 40, 40, 34, 34, 32, 32, 
		// 40, 40, 42, 42, 38, 38, 36, 36, 42, 42, 
		// 44, 44, 38, 38, 36, 36, 44, 44, 46, 46, 
		// 42, 42, 40, 40, 46, 46, 48, 48, 42, 42, 
		// 44, 44, 52, 52, 54, 54, 50, 50, 48, 48, 
		// 54, 54, 56, 56, 50, 50, 48, 48, 58, 58, 
		// 62, 62, 56, 56, 58, 58, 62, 62, 64, 64, 
		// 58, 58, 62, 62, 68, 68, 70, 70, 66, 66, 
		// 64, 64, 70, 70, 72, 72, 66, 66, 70, 70, 
		// 76, 76, 78, 78, 74, 74, 72, 72, 78, 78, 
		// 80, 80, 74, 74, 76, 76, 84, 84, 86, 86, 
		// 82, 82, 80, 80, 86, 86, 88, 88, 82, 82, 
		// 80, 80, 90, 90, 94, 94, 88, 88, 90, 90, 
		// 94, 94, 96, 96, 90, 90, 94, 94, 100, 100, 
		// 102, 102, 98, 98, 96, 96, 102, 102, 104, 104, 
		// 98, 98, 102, 102, 108, 108, 110, 110, 106, 106, 
		// 104, 104, 110, 110, 112, 112, 106, 106, 108, 108, 
		// 116, 116, 118, 118, 114, 114, 112, 112, 118, 118, 
		// 120, 120, 114, 114, 112, 112, 126, 126, 128, 128, 
		// 124, 124, 122, 122, 128, 128, 130, 130, 124, 124, 
		// 128, 128, 134, 134, 136, 136, 132, 132, 130, 130, 
		// 136, 136, 138, 138, 132, 132, 134, 134, 142, 142, 
		// 144, 144, 140, 140, 138, 138, 144, 144, 146, 146, 
		// 140, 140, 138, 138, 148, 148, 152, 152, 146, 146, 
		// 148, 148, 152, 152, 154, 154, 148, 148, 152, 152, 
		// 158, 158, 160, 160, 156, 156, 154, 154, 160, 160, 
		// 162, 162, 156, 156, 154, 154, 162, 162, 164, 164, 
		// 160, 160, 158, 158, 164, 164, 166, 166, 160, 160, 
		// 158, 158, 166, 166, 168, 168, 164, 164, 162, 162, 
		// 168, 168, 170, 170, 164, 164, 166, 166, 174, 174, 
		// 176, 176, 172, 172, 170, 170, 176, 176, 178, 178, 
		// 172, 172, 170, 170, 180, 180, 184, 184, 178, 178, 
		// 180, 180, 184, 184, 186, 186, 180, 180, 184, 184, 
		// 190, 190, 192, 192, 188, 188, 186, 186, 192, 192, 
		// 194, 194, 188, 188, 192, 192, 198, 198, 200, 200, 
		// 196, 196, 194, 194, 200, 200, 202, 202, 196, 196, 
		// 198, 198, 206, 206, 208, 208, 204, 204, 202, 202, 
		// 208, 208, 210, 210, 204, 204, 202, 202, 212, 212, 
		// 216, 216, 210, 210, 212, 212, 216, 216, 218, 218, 
		// 212, 212, 216, 216, 222, 222, 224, 224, 220, 220, 
		// 218, 218, 224, 224, 226, 226, 220, 220, 224, 224, 
		// 230, 230, 232, 232, 228, 228, 226, 226, 232, 232, 
		// 234, 234, 228, 228, 230, 230, 238, 238, 240, 240, 
		// 236, 236, 234, 234, 240, 240, 242, 242, 236, 236, 
		// 234, 234, ];

	that.angleMaps['floor'] = [ 
	25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 ,25 , 	
	]

	return that;

};
