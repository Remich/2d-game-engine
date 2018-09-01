/* (c)opyright 2018 René Michalke */

var Collision = function() {};
Collision.prototype.collidable_objects = []; //new Array(); // map; key=id
Collision.prototype.collisions  = []; // new Array(); // map; key=id
Collision.prototype.queue_objects      = []; // new Array(); // queue; key=id
	
Collision.prototype.add = function(obj) {
	this.collidable_objects[obj.id] = obj;
};
Collision.prototype.rm = function(handle) {
	delete this.collidable_objects[handle.id];
};
Collision.prototype.check = function(id) {

	/**
	 * Check which Collisions take place
	 */  
	var z, y;
	for (var a in this.collidable_objects) {
		if (this.collidable_objects[a] === undefined ||
			this.collidable_objects[id] === undefined) {
			continue;	
		}
		if (id === this.collidable_objects[a].id) // kein object mit sich selbst vergleichen
			continue;
		
		if (this.collidable_objects[id].sensors === undefined &&
			this.collidable_objects[a].sensors === undefined) {
			continue;
		}

		var sensors_a = this.collidable_objects[id].sensors;
		var sensors_b = this.collidable_objects[a].sensors;

		for (z in sensors_a) {
			for (y in sensors_b) {

				// don't collide objects with sensors which are not supposed to collide
				if (in_array(this.collidable_objects[id].name, sensors_b[y].sensor_type) === false) {
					continue;
				}

				// don't collide sensors of different type
				if (sensors_a[z].type !== undefined && sensors_b[y].type_other !== undefined) {
					if(in_array(sensors_a[z].type ,sensors_b[y].type_other) === false)
						continue;
				}

				// check for collision
				if (this.collision_check_single_strict_with_sensor(sensors_a[z], sensors_b[y]) === true) {
					// TODO: don't collide here, remember collisions (which objects, which sensors) and apply them after both of these loops in each of THE object.collide() functions, decide there which sensor to actually collide

					this.collidable_objects[a].colliding_sensors.push(sensors_b[y].name);
					this.collidable_objects[id].colliding_sensors.push(sensors_a[z].name);
					this.collisions.push( [ this.collidable_objects[id], this.collidable_objects[a] ] );

					// sensors_b[y].collide( this.collidable_objects[a], this.collidable_objects[id] );
					// sensors_a[z].collide( this.collidable_objects[id], this.collidable_objects[a] );
					sensors_a[z].colliding = true;
					sensors_b[y].colliding = true;
				}

			}
		}
	}


	/**
	  * Act out Collisions
	  */ 
	for (var i in this.collisions) {
		this.collisions[i][0].collide(this.collisions[i][1]);
		this.collisions[i][1].collide(this.collisions[i][0]);
	}


	/**
	 * Clear Collisions
	 */  
	for (var i in this.collisions) {
		this.collisions[i][0].colliding_sensors = [];
		this.collisions[i][1].colliding_sensors = [];
	}

	this.collisions = [];

};

Collision.prototype.act = function(id) {

};

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
