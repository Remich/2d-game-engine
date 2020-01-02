/* (c)opyright 2018 René Michalke */

import { ObjectGround } from './ObjectGround.class.js'
import { EngineStateMachine } from './EngineStateMachine.class.js';

var ObjectBlock = function() {

	var that = new ObjectGround();

	that.bootstrap = "new ObjectBlock()";
	that.default_sensor_height = 42;

	that.name = 'ground';
	that.in_air = false;
	that.rolling = false;

	that.get_state = function() {
	};

	that.Chill = function() {
		var foobar = {};

		foobar.id = 0;
		foobar.name = 'Chill';
		foobar.image = new Image();
		foobar.image.src = 'images/Block.png';
		foobar.breakable = function(foo) { return true; };
		foobar.loop = false;
		foobar.length = 1;

		foobar.frames = [];

		foobar.frames[0] = [];
		foobar.frames[0].width = 256;
		foobar.frames[0].height = 256;
		foobar.frames[0].margin = 0;

		foobar.enter = function(sm, obj) {
			obj.frame = 0;
		};
		foobar.update = function(sm, obj) {
		};
		foobar.exit = function(sm) {
		};

		return foobar;

	};

	that.heightMaps['floor'] = [ 
		19, 19, 19, 19, 19, 19, 19, 19, 8, 8, 
		8, 8, 8, 8, 8, 8, 4, 4, 4, 4, 
		4, 4, 4, 4, 3, 3, 3, 3, 3, 3, 
		3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 
		3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 
		3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 
		3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 
		3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 
		3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 
		3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 
		3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 
		3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 
		3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 
		3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 
		3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 
		3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 
		3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 
		3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 
		3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 
		3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 
		3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 
		3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 
		3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 
		3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 
		4, 4, 4, 4, 4, 4, 4, 4, 9, 9, 
		9, 9, 9, 9, 9, 9, ];

	/*
	 * Create new State Machine
	 */
	that.sm = new EngineStateMachine();
	that.sm.changeState( that.Chill(), that );

	return that;

};

export { ObjectBlock }
