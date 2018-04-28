# TODO

## Code
* add attributes to objects ( y_offset, x_offset ), for using multiple objects next to each other
* update frame_duration according to speed of object

## Bugs

* when on slope: looking up and immediately looking down leads to falling through the floor of the slope
* when moving from one slope to another slope of different height: the other slope's heightMap is being used, even though were mostly standing on the old slope

* implement horizontal flipping of sensors, when object is flipped
* implement Angles
* implement Walls and Ceilings and their respective Sensors
* implement Loopings
* implement Sound
* implement Sprite Rotation
* implement Image Loading
* implement updating of local cache
* implement Scene State Machine
* implement z-index of objects
* implement better datastructure in EngineObjectList.class.js
* fix double collisions (e.g. collecting a bouncing ring increases the ring counter by two)