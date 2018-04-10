var ObjectExplosion = function() { 

	var that = new ObjectStatic();

	that.name = 'explosion';
	that.collide = function( b, sensor ) { };
	that.get_state = function() { 
		//that.sm.changeState( new that.Explode(), that );
	};
	that.Explode = function(obj) {

		var foobar = {};

		foobar.id = 0;
		foobar.name = 'Explode';
		foobar.image = new Image();
		foobar.image.src = 'images/explode.png';
		foobar.breakable = function(foo) { return true; };
		foobar.loop = false;
		foobar.top = 6;
		
		foobar.length = 4;
		foobar.frames = new Array();
		foobar.frames[0] = new Array();
		foobar.frames[0].width = 76;
		foobar.frames[0].height = 76;
		foobar.frames[0].margin = 0;
		foobar.frames[1] = new Array();
		foobar.frames[1].width = 76;
		foobar.frames[1].height = 76;
		foobar.frames[1].margin = 0;
		foobar.frames[2] = new Array();
		foobar.frames[2].width = 76;
		foobar.frames[2].height = 76;
		foobar.frames[2].margin = 0;
		foobar.frames[3] = new Array();
		foobar.frames[3].width = 76;
		foobar.frames[3].height = 76;
		foobar.frames[3].margin = 0;

		foobar.enter = function(sm, obj) {obj.frame = 0; };
		foobar.update = function(sm, obj) {
			if (obj.history.length === 0)
				return false;
			if (floor(obj.history[obj.history.length-1].frame) === 3) {
				obj.destroy = true;
			}
		};
		foobar.exit = function(sm) {
		};

		return foobar;
	};

	return that;

};