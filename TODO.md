# TODO

## DOCUMENTATION

- [ ] translate all comments to english
 
## REFACTORING

- [ ] Rename Level to Map
- [ ] move draw function (Engine.class.js) to saparate file
- [ ] remove 'bootstrap' property of each object
- [ ] remove paramater "b" from all collide() functions
- [ ] change sensor names to something unique or make them instantiate as different objects
	- use ENUM
- [x] add sensor.type to all sensors, see ObjectBlock.class.js and ObjectChar.class.js for example

## IMPROVE IMPLEMENTATION

- [x] create Abstract Sensor, with comments for all properties
	- [x] use the abstract sensor in ObjectChar.class.js
- [ ] add and implement property for "ground"-objects, which specify the collision-direction: e.g. not colliding when object is colliding from below
	- maybe via z-index 
		
### BRANCH: CHANGE-ANGLE-CALCULATION

- [x] make ObjectHillDown.class.js flippable and add to current scene
- [ ] calculate angle from HeightMap of both GroundSensors (no need for AngleMaps anymore)
	- [ ] fix angle below 5 degree 
	- [ ] fix angle-push of objects, currently only working on left side down
	- [ ] remove all AngleMaps
	- [ ] remove AngleMaps from generate-object.php
- [x] - FIX: ObjectChar.collide() is being called 6 times per gameframe!!!!

## ISSUES

- [ ] Sometimes the Engine never realizes that a pressed button has already been released. (Happens when leaving the boundary of the map).
- [ ] Objects which are out of screen, and therefore have `spawned=false` never get destroyed. (See "EngineObjectList" and "RingBouncing").
- [x] when on slope: looking up and immediately looking down leads to falling through the floor of the slope
- [ ] when moving from one slope to another slope of different height: the other slope's heightMap is being used, even though were mostly standing on the old slope
		- [x] fix for walking to the right
		- [x] fix for walking to the left downwards
			- maybe fixing next bug, is the solution
- [ ] implement horizontal flipping of sensors, when object is flipped
	- [x] type background, with heightMaps
	- [ ] type ObjectChar, ObjectBeatnik, ...
- [x] implement Sprite Rotation
- [ ] implement y-position adjustment, when switching between animation frames
		- see Engine.class.js:320-348
- [x] fix double collisions (e.g. collecting a bouncing ring increases the ring counter by two)

## FEATURES

- [ ] create Factories for Objects (e.g. 3 rings in a row, etc.), for easier use in game.php
- [ ] update frame_duration according to speed of object
- [x] add collided_with - Array to each collidable object, and unique hash to each object, then check if we already collided with that object
	- solved by using a set instead of an array, to get only unique collisions
- [ ] implement Image Loading
- [ ] implement updating of local cache
- [ ] implement Scene State Machine
- [ ] implement z-index of objects
- [ ] implement better datastructure in EngineObjectList.class.js
- [ ] implement Walls and Ceilings and their respective Sensors
- [ ] implement Loopings
- [ ] implement Sound
