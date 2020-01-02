/* (c)opyright 2018 René Michalke */

import { ObjectStatic } from './ObjectStatic.class.js'

var ObjectBackground = function() {

	var that = new ObjectStatic();

	that.name = 'background';
	that.collide = function( b ) { 
		return false;
	};
	that.in_air = false;
	that.rolling = false;

	that.repeat = 'repeat'; // or 'repeat-x', 'repeat-y', 'no-repeat'
	that.fixed = false;
	that.scroll = 0; // amount of parallax scrolling

	that.get_state = function() {
		that.sm.changeState( new that.Chill(), that );
	};

	// that.tmpGetWidth = that.getWidth;

	// that.getWidth = function() {
		// if(that.repeat === 'repeat') {
			// return window.cfg.level_width;
		// }	else if(that.repeat === 'repeat-x') {
			// return window.cfg.level_width;
		// } else if(that.repeat === 'repeat-y') {
			// return that.tmpGetWidth();
		// } else {
			// return that.tmpGetWidth();
		// }
	// };

	return that;

};

export { ObjectBackground }
