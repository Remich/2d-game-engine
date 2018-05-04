/* (c)opyright 2018 René Michalke */

var ObjectStaticWithAngle = function() {

	var that = new ObjectStatic();

	that.parentCollide = function( obj, b ) { 

		// if(obj === undefined || b === undefined)
		// 	return false;

		// debugger;
		// that.parentCollide(obj, b);
		// return;	

		var indexHeightMap = floor(obj.x-b.x);
			if(indexHeightMap < 0)
				indexHeightMap = 0;

		if(obj.speed_y < 0 && obj.y > (b.y + b.heightMaps['floor'][indexHeightMap]) ) {
			console.log("falsing");
			return false;
		}


		// if(obj.flipped === true) {
		// 	if(obj.y > b.y + b.heightMaps[b.heightMaps.length - indexHeightMap - 1])
		// 	 		return false;
		// } else {
			if(obj.y > b.y + b.heightMaps['floor'][indexHeightMap]) {
				console.log("falsing2");
		 		return false;
			}
		// }



		if(obj.speed_y >= 0) { 
			obj.in_air = false;
			obj.isOnSlope = true;

			obj.angle = b.angleMaps['floor'][floor(indexHeightMap/32)];

			obj.y = b.y + b.heightMaps['floor'][indexHeightMap] - obj.sm.currentState.frames[floor(obj.frame)].height;

			var val = (obj.getHeight() / 2) * Math.sin(obj.angle / 180) * Math.PI;
			obj.y += val;
	 	}

	};
 	
	that.physics = function() {
	};

	that.frame_update = function () {
		this.frame_speed = 0.2;
		this.frame += this.frame_speed /** filter_fps_lag()*/;
	};

	return that;
	
};