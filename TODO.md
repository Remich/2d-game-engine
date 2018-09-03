# TODO

## Currently – Branch: change-angle-calculation

* [ ] - remove paramater "b" from all collide() functions
* [x] - FIX: ObjectChar.collide() is being called 6 times per gameframe!!!!
* [ ] - calculate angle from HeightMap of both GroundSensors
	-> no need for AngleMaps anymore :)
* [ ] - angle of "flat" ground-objects should always be 0
* [ ] - fix ObjectSlope.class.js
* [ ] - delete all collide() functions of all sensors
* [ ] - change sensor names to something unique or make them instantiate as different objects
		-> use ENUM
* [ ] - add sensor.type to all sensors, see ObjectBlock.class.js and ObjectChar.class.js for example

* __DONE:__ merge ObjectSlope.collide(obj, b) into ObjectHillDown.collide(obj, b);
* __DONE:__ collision with sensor_type not quite working

## Code

* add attributes to objects ( y_offset, x_offset ), for using multiple objects next to each other
* update frame_duration according to speed of object
* __NOT NECESSARY ANYMORE:__ add collided_with - Array to each collidable object, and unique hash to each object, then check if we already collided with that object
* implement flip of sensors in ObjectChar.class.js and possibly in most other classes as well, see flip() in ObjectSlope.class.js

## Bugs

* __FIXED__:when adding object Beatnik, Collision doesn't work anymore
* when on slope: looking up and immediately looking down leads to falling through the floor of the slope
* when moving from one slope to another slope of different height: the other slope's heightMap is being used, even though were mostly standing on the old slope

* implement horizontal flipping of sensors, when object is flipped
* __DONE__implement Angles
* implement Walls and Ceilings and their respective Sensors
* implement Loopings
* implement Sound
* __DONE__implement Sprite Rotation
* implement Image Loading
* implement updating of local cache
* implement Scene State Machine
* implement z-index of objects
* implement better datastructure in EngineObjectList.class.js
* fix double collisions (e.g. collecting a bouncing ring increases the ring counter by two)
