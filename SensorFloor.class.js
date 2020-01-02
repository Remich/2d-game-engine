/* (c)opyright 2018 René Michalke */

import { EngineSensor } from './EngineSensor.class.js';
import { Point } from './Point.class.js';

var SensorFloor = function(i) {

	var that = EngineSensor(i);

	that.name						= 'SensorFloor';
	that.type           = 'ground';
	that.match_objects  = ["ground", "slope"];
	that.match_sensors  = ["ground"];

	that.getNewPositionAfterCollision = function() {

		/*
			* This Sensor has no Collisions
			*/
		if(this.colliding_with.size === 0) {

			// return current values
			return new Point(this.x, this.y);
		}

		/*
			* Calculate the new Y-Position
			*/
		let ar = Array.from(this.colliding_with);
		let heightMapIndex = this.x - ar[0].x;
		let newYPosition = ar[0].y + ar[0].heightMaps['floor'][heightMapIndex];

		return new Point( this.x, newYPosition );

	};

	return that;

};

export { SensorFloor }
