/* (c)opyright 2018 René Michalke */

var Collision = function() {};

/*
 * Collision List
 * List of Objects which will be checked against each other for Collisions
 */
Collision.prototype.Objects = [];
Collision.prototype.collisions  = []; // new Array(); // map; key=id
	
/*
 * Method to add Objects to the Collision List
 */
Collision.prototype.add = function(obj) {
	this.Objects[obj.id] = obj;
};

/*
 * Method to remove Objects from the Collision List
 */
Collision.prototype.rm = function(obj) {
	delete this.Objects[obj.id];
};

/*
 * Method to check for Collisions
 */
Collision.prototype.check = function() {

	var a, b, c, d;
	var handle, match;
	var handle_s, match_s;

	for(a in this.Objects) {

		handle = this.Objects[a];

		// TODO too slow if this is removed
		if(handle.name !== 'char'
				&& handle.name !== 'beatnik'
				&& handle.name !== 'ringbounce') {
			continue;
		}
		// handle.in_air = true;


		// don't check undefined handle
		if(handle === undefined) {
			continue;
		}

		// don't check if handle has no sensors
		// this might happen in the first cycles of the game looop
		if(handle.sensors === undefined) {
			continue;
		}

		for(b in this.Objects) {

			match = this.Objects[b];

			// don't check undefined match
			if(match === undefined) {
				continue;
			}

			// don't check if object is colliding with itself
			if(handle === match) {
				continue;
			}

			// TODO
			// don't check two objects twice
			// if(in_array(match.checkedCollisionWith, handle.id)) {
				// continue;
			// }

			// don't check if handle has no sensors
			// this might happen in the first cycles of the game looop
			if(match.sensors === undefined) {
				continue;	
			}

			for(c in handle.sensors) {

				handle_s = handle.sensors[c];
			
				for(d in match.sensors) {

					match_s = match.sensors[d];

					// don't collide objects with sensors which are not supposed to collide
					if(in_array(handle.name, match_s.sensor_type) === false) {
						continue;
					}

					// don't collide sensors of different type
					if(handle_s.type !== undefined
							&& match_s.type_other !== undefined) {
					
						if(in_array(handle_s.type, match_s.type_other) === false) {
							continue;
						}
					}
				
					// check for intersection of sensors
					if(this.collision_check_single_strict_with_sensor(handle_s, match_s) === true) {
						handle.colliding_sensors.push(handle_s.name);
						match.colliding_sensors.push(match_s.name);

						this.collisions.push( [handle, match] );

						handle_s.colliding = true;
						match_s.colliding  = true;
					
					}
				
				}
			
			}
		
		
		}
		
	}

};

/*
 * Method to act out Collisions
 */
Collision.prototype.act = function() {
	for (var i in this.collisions) {
		this.collisions[i][0].collide(this.collisions[i][1]);
		this.collisions[i][1].collide(this.collisions[i][0]);
	}

	// clear collisions
	for (var i in this.collisions) {
		this.collisions[i][0].colliding_sensors = [];
		this.collisions[i][1].colliding_sensors = [];
	}

	this.collisions = [];
};

/*
 * Method to correct Angles of collided Objects
 */
Collision.prototype.correctAngles = function() {
};

/*
 * Method to check if any two sensors are overlapping/colliding
 */
Collision.prototype.collision_check_single_strict_with_sensor = function(a, b) {

	if (a.x > (b.x + b.width))
		return false;
	if (( a.x + a.width) < b.x)
		return false;
	if (a.y >  (b.y + b.height))
		return false;
	if ((a.y + a.height) <  b.y)
		return false;
	
	return true;

}; 
