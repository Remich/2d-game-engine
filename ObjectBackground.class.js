var ObjectBackground = function() {

	var that = new ObjectStatic();

	that.name = 'background';
	that.collide = function( b ) { 
		return false;
	};
	that.in_air = false;
	that.rolling = false;

	that.repeat = 'repeat-x'; // or 'repeat', 'repeat-y'
	that.fixed = false;
	that.scroll = 0; // amount of parallax scrolling

	that.get_state = function() {
		that.sm.changeState( new that.Chill(), that );
	};

	return that;

};