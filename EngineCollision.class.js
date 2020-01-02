/* (c)opyright 2018 René Michalke */

import * as Helpers from './library.inc.js'
var in_array = Helpers.in_array
var Collision = function() {};

/*
 * Collision List
 * List of Objects which will be checked against each other for Collisions
 */
Collision.prototype.Objects    = [];
Collision.prototype.collisions = new Set();
	
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
 * Clear and rebuild QuadTree
 */
Collision.prototype.rebuildQuadTree = function() {
	window.myEngine.quadtree.clear();
	for(var a in this.Objects) {
		window.myEngine.quadtree.insert(this.Objects[a]);
	}
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
		// TODO: find better way
		handle.in_air = true;


		// don't check undefined handle
		if(handle === undefined) {
			continue;
		}

		// don't check if handle has no sensors
		// this might happen in the first cycles of the game looop
		if(handle.sensors === undefined) {
			continue;
		}
			
		// get the possible collisions, QuadTree decides
		var possible_collisions = window.myEngine.quadtree.retrieve(handle);
		
		for(var i=0; i<possible_collisions.length; i++) {

			match = possible_collisions[i];

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
			// this might, but should NOT happen in the first cycles of the game looop
			if(match.sensors === undefined) {
				continue;	
			}

			for(c in handle.sensors) {

				handle_s = handle.sensors[c];
			
				for(d in match.sensors) {

					match_s = match.sensors[d];

					// don't collide objects with sensors which are not supposed to collide
					if(in_array(handle.name, match_s.match_objects) === false) {
						continue;
					}

					// don't collide sensors of different type
					if(handle_s.type !== undefined
							&& match_s.match_sensors !== undefined) {
					
						if(in_array(handle_s.type, match_s.match_sensors) === false) {
							continue;
						}
					}
				
					// check for intersection of sensors
					if(Collision.collision_check_single_strict_with_sensor(handle_s, match_s) === true) {

						// each sensor has to know with which object it is colliding
						handle_s.colliding_with.add( match );
						match_s.colliding_with.add( handle );

						// add flag for faster decisions
						handle_s.colliding = true;
						match_s.colliding  = true;
						
						// each object has to know which of its sensors are colliding
						handle.colliding_sensors.add(handle_s.name);
						match.colliding_sensors.add(match_s.name);

						// this.collisions.push( [handle, match] );
						this.collisions.add( handle );
						this.collisions.add( match );
					
					}
				
				} // end "for(d in match.sensors)"
				
			} // end "for(c in handle.sensors)"
			
		}	// end "for(b in this.Objects)"

	} // end "for(a in this.Objects)"

};

/*
 * Method to act out Collisions
 */
Collision.prototype.act = function() {
	this.collisions.forEach(function(item) {
		item.collide();	
	});

	this.collisions.clear();
};

/*
 * Method to correct Angles of collided Objects
 */
Collision.prototype.correctAngles = function() {
};

/*
 * Method to check if any two sensors are overlapping/colliding
 */
Collision.collision_check_single_strict_with_sensor = function(a, b) {

	if (a.x >= (b.x + b.width))
		return false;
	if (( a.x + a.width) <= b.x)
		return false;
	if (a.y >= (b.y + b.height))
		return false;
	if ((a.y + a.height) <= b.y)
		return false;
	
	return true;

}; 

export { Collision }
