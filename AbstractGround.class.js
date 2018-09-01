/* (c)opyright 2018 René Michalke */

var AbstractGround = function() {

	var that = new Object();

	that.collide = function( obj ) { 
		
		var heightMapX = obj.getHeightMapX();

		console.log("");
		console.log("");
		console.log("heightMapX: " + heightMapX);
		console.log("that.x: " + that.x);
		console.log("that.x+that.getWidth(): " + (that.x + that.getWidth()));
		console.log("obj.angle: " + obj.angle);

		// obj should not collide with this object,
		// because the x position of the calculated index for the heightMap
		// is out of bounds
		if(heightMapX < that.x
			|| heightMapX > that.x + that.getWidth()
		) {
			return;
		}

		var indexHeightMap = heightMapX % that.x;
		console.log("indexHeightMap: " + indexHeightMap);

		if(obj.speed_y < 0 && obj.y > (that.y + that.heightMaps['floor'][indexHeightMap]) ) {
			console.log("falsing in " + that.name);
			return false;
		}
		if(obj.y < that.y + that.heightMaps['floor'][indexHeightMap] - obj.getHeight()) {
			console.log("falsing-2 in " + that.name);
			return false;
		}
		
		var angle = obj.angle % 360;
		obj.in_air = false;
		obj.isOnSlope = true;
		
		console.log(obj.name);

		// set y-position according to heightMap 
		obj.y = that.y + that.heightMaps['floor'][indexHeightMap] - obj.sm.currentState.frames[floor(obj.frame)].height;

		// set angle according to angleMap
		obj.angle = that.angleMaps['floor'][floor(indexHeightMap/32)];

		// change y-offset according to current angle
		obj.y += (obj.getHeight() / 2) * Math.sin(obj.angle / 180) * Math.PI;

		// update sensor positions
		obj.updateSensors();
	};

	that.physics = function() {
	};

	return that;
	
};
