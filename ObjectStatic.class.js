/* (c)opyright 2018 René Michalke */

var ObjectStatic = function() {

	var that = new Object();

	that.parentCollide = function( obj, b ) { 
		// console.log("obj.name: " + obj.name);
		// console.log("b.name: " + b.name);

		// if(obj === undefined || b === undefined)
		// 	return false;
		var indexHeightMap = floor(obj.x-b.x);
		if(indexHeightMap < 0)
				indexHeightMap = 0;

		if(indexHeightMap >= b.getWidth()) {
			indexHeightMap = b.getWidth();	
		}

		if(obj.speed_y < 0 && obj.y > (b.y + b.heightMaps['floor'][indexHeightMap]) ) {
			console.log("falsing");
			return false;
		}

		if(obj.y < b.y + b.heightMaps['floor'][indexHeightMap] - obj.getHeight()) {
			console.log("falsing2");
			return false;
		}

		// if(obj.speed_y >= 0) { 
		// 	var angle = obj.angle % 360;

		// 	obj.in_air = false;
		// 	obj.isOnSlope = true;

		// 	obj.angle = b.angleMaps['floor'][floor(indexHeightMap/32)];

		// 	obj.y = b.y + b.heightMaps['floor'][indexHeightMap] - obj.sm.currentState.frames[floor(obj.frame)].height;

		// 	var val = (obj.getHeight() / 4) * Math.sin(obj.angle / 180) * Math.PI;
		// 	obj.y += val;
	 // 	}

		// if(obj.speed_y >= 0) { 
			var angle = obj.angle % 360;

			obj.in_air = false;
			obj.isOnSlope = true;

			// obj.angle = b.angleMaps['floor'][floor(indexHeightMap/32)];

			obj.y = b.y + b.heightMaps['floor'][indexHeightMap] - obj.sm.currentState.frames[floor(obj.frame)].height;

			var val = (obj.getHeight() / 2) * Math.sin(obj.angle / 180) * Math.PI;
			obj.y += val;


			/**
			 * only act out collision of this sensor when the angle 
			 * of ObjectChar matches with range of angles of the floor
			 */  
			// if( (angle >= 315 && angle <= 360) 
			// || (angle >= 0 && angle < 45) ) {

				if((Math.abs(angle) <= 4)) {
					// *
					//  * don't change angle of object if angle is less than 4 degree,
					//  * this means ObjectChar is standing on mostly "even" ground
					 
				} else {
					obj.angle = b.angleMaps['floor'][floor(indexHeightMap/32)];
				}

				// /**
				//  * change height of ObjectChar according to heightMap of colliding object
				//  */
				// if( ( obj.in_air === true && obj.y > b.y + b.heightMaps['floor'][indexHeightMap] - obj.getHeight() )
				// 	|| 
				// 	( obj.isOnSlope === true )
				// ) {
				// 	console.log("jojoo");
				// 	obj.y = b.y + b.heightMaps['floor'][indexHeightMap] - obj.getHeight() ;
				// 	var val = (obj.getHeight() / 2) * Math.sin(obj.angle / 180) * Math.PI;
				// 	obj.y += val;
				// }

				// obj.mode = "floor";
				// obj.in_air = false;
				// obj.isOnSlope = true;
			// }

		// }

		obj.updateSensors();

		// if(obj.speed_y < 0 && obj.y > (b.y + b.heightMaps['floor'][indexHeightMap]) ) {
		// 	console.log("falsing");
		// 	return false;
		// }

		// var indexHeightMap = floor(obj.x-b.x);
		// 	if(indexHeightMap < 0)
		// 		indexHeightMap = 0;


		// // if(obj.flipped === true) {
		// // 	if(obj.y > b.y + b.heightMap[b.heightMap.length - indexHeightMap - 1])
		// // 	 		return false;
		// // } else {
		// 	if(obj.y > b.y + b.heightMaps['floor'][indexHeightMap]) {
		// 		console.log("falsing2");
		//  		return false;
		// 	}
		// // }



		// if(obj.speed_y >= 0) { 
		// 	obj.in_air = false;
		// 	obj.isOnSlope = true;

		// 	obj.angle = b.angleMaps['floor'][floor(indexHeightMap/32)];

		// 	obj.y = b.y + b.heightMaps['floor'][indexHeightMap] - obj.sm.currentState.frames[floor(obj.frame)].height;

		// 	var val = (obj.getHeight() / 2) * Math.sin(obj.angle / 180) * Math.PI;
		// 	obj.y += val;
	 // 	}
	};

	that.physics = function() {
	};

	that.frame_update = function () {
		this.frame_speed = 0.2;
		this.frame += this.frame_speed /** filter_fps_lag()*/;
	};

	return that;
	
};