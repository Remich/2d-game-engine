/* (c)opyright 2018 René Michalke */

var ObjectBackgroundMeadow2 = function() {

	var that = new ObjectBackground();

	that.Chill = function(obj) {

		var foobar = {};

		foobar.id = 0;
		foobar.name = 'Chill';
		foobar.image = new Image();
		foobar.image.src = 'images/BackgroundMeadow2.png';
		foobar.breakable = function(foo) { return false; };
		foobar.loop = false;
		foobar.length = 1;

		foobar.frames = []; //new Array();

		foobar.frames[0] = []; //new Array();
		foobar.frames[0].width = 256;
		foobar.frames[0].height = 32;
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

	return that;

};