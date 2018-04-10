var Collision = function() {};
Collision.prototype.collidable_objects = []; //new Array(); // map; key=id
Collision.prototype.colliding_objects  = []; // new Array(); // map; key=id
Collision.prototype.queue_objects      = []; // new Array(); // queue; key=id
	
Collision.prototype.add = function(obj) {
	this.collidable_objects[obj.id] = obj;
};
Collision.prototype.rm = function(handle) {
	delete this.collidable_objects[handle.id];
};
var a, z, y;
Collision.prototype.check = function(id) {


	for (a in this.collidable_objects) {
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
				if (this.collision_check_single_strict_with_sensor(sensors_a[z], sensors_b[y])) {

					// only collide if sensors are of same-type
					// console.log("compare sensor_type " + sensors_a[z].sensor_type + " with sensor_type " + sensors_b[y].sensor_type);
					// debugger;

					if(in_array(this.collidable_objects[id].name, sensors_b[y].sensor_type)){
						sensors_a[z].collide( this.collidable_objects[id], this.collidable_objects[a] );

					}

					if(in_array(this.collidable_objects[a].name, sensors_a[z].sensor_type)) {
						sensors_b[y].collide( this.collidable_objects[a], this.collidable_objects[id] );

					}
					sensors_a[z].colliding = true;
					sensors_b[y].colliding = true;


					// if(sensors_a[z].sensor_type !== sensors_b[y].sensor_type)
					// 	return false;

					// sensors_a[z].collide( this.collidable_objects[id], this.collidable_objects[a] );
					// sensors_b[y].collide( this.collidable_objects[a], this.collidable_objects[id] );

					// TODO: delete
					// this.collidable_objects[a].collide( this.collidable_objects[id] );
					// this.collidable_objects[id].collide( this.collidable_objects[a] );

					// sensors_a[z].colliding = true;
					// sensors_b[y].colliding = true;
				}

			}
		}
	}
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
