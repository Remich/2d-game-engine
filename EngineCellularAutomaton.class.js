var EngineCellularAutomaton = function() {

	var that = new ObjectStatic();

	// size in px
	that.cellSize = 4;

	that.collide = function() {
		/*
		 * alert("CeullarAutomaton");
		 */
	};

	that.initAutomaton = function() {

		// create array of grid
		var grid_width = that.getWidth() / that.cellSize 
		var grid_height = that.getHeight() / that.cellSize;

		that.grid = new Array( grid_width * grid_height );
	
	};

	that.initSensors = function() {

		that.sensors = [];
		
		var new_sensor = SensorAutomaton();

		new_sensor.setHeight(that.getHeight());
		new_sensor.setWidth(that.getWidth());

		// TODO wrong place , this first update should be taken care of by the engine
		new_sensor.update(that);	// important!

		that.sensors.push(new_sensor);
	};

	that.initFlippedSensors = function() {
		that.sensors_flipped = [];
		that.sensors_flipped.push(that.sensors);
	};

	/*
	 * Create new State Machine
	 */
	that.sm = new EngineStateMachine();
	that.sm.changeState( that.Chill(), that );
	
	return that;
};
