import { ObjectBackground } from './ObjectBackground.class.js'
import { EngineStateMachine } from './EngineStateMachine.class.js';

var ObjectBackgroundGrass4 = function() {

	var that = new ObjectBackground();
	
	that.bootstrap = "new ObjectBackgroundGrass4()";

	that.Chill = function(obj) {

		var foobar = {};

		foobar.id = 0;
		foobar.name = 'Chill';
		foobar.image = new Image();
		foobar.image.src = 'images/BackgroundGrass4.png';
		foobar.breakable = function(foo) { return false; };
		foobar.loop = false;
		foobar.length = 1;

		foobar.frames = [];

		foobar.frames[0] = [];
		foobar.frames[0].width = window.cfg.level_width;
		foobar.frames[0].height = 190;
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

	/*
	 * Create new State Machine
	 */
	that.sm = new EngineStateMachine();
	that.sm.changeState( that.Chill(), that );

	return that;

};

export { ObjectBackgroundGrass4 }
