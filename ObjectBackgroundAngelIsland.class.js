import { ObjectBackground } from './ObjectBackground.class.js'
import { EngineStateMachine } from './EngineStateMachine.class.js';

var ObjectBackgroundAngelIsland = function() {

	var that = new ObjectBackground();

	that.bootstrap = "new ObjectBackgroundAngelIsland()";
	that.repeat = 'repeat-x';

	that.Chill = function(obj) {

		var foobar = {};

		foobar.id = 0;
		foobar.name = 'Chill';
		foobar.image = new Image();
		foobar.image.src = 'images/BackgroundAngelIsland.png';
		foobar.breakable = function(foo) { return false; };
		foobar.loop = false;
		foobar.length = 1;

		foobar.frames = [];

		foobar.frames[0] = [];
		foobar.frames[0].width = 416;
		foobar.frames[0].height = 218;
		foobar.frames[0].margin = 0;


		foobar.enter = function(sm, obj) {
			obj.frame = 0;
			obj.foo = 0;	
		};
		foobar.update = function(sm, obj) {
			obj.y += Math.sin(obj.foo) * 0.05;
			obj.foo += 0.02;
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

export { ObjectBackgroundAngelIsland }
