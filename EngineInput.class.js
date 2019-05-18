/* (c)opyright 2019 René Michalke */

var InputHandler = function() {

	$(document).on('keydown', this.Keydown);
	$(document).on('keyup', this.Keyup);

};

// init list of objects with input
InputHandler.prototype.objects = new EngineObjectList();

// add objects to our list
InputHandler.prototype.add = function(obj) {
	this.objects.add(obj);
}

InputHandler.prototype.Keydown = function(e) {

	var keyCode = e.keyCode;

	window.myEngine.InputHandler.objects.each(function(handle) {

		// ignore objects with no input, TODO throw an error, instead of failing silent
		if(handle.assigned_keys === undefined || handle.assigned_keys.length < 0)
			return false;

		// ignore keys which are not assigned
		if(in_array(keyCode, handle.assigned_keys) === false)
			return false;

		// debounce key-press
		if(handle.pressed_keys[handle.pressed_keys.length-1] === keyCode)
			return false;

		// ignore keys which are already pressed
		if(in_array(keyCode, handle.pressed_keys) === true)
			return false;

		// add key to array of pressed keys
		handle.pressed_keys[handle.pressed_keys.length] = keyCode;
	});

};

InputHandler.prototype.Keyup = function(e) {

	var keyCode = e.keyCode;

	window.myEngine.InputHandler.objects.each(function(handle) {
		
		// ignore objects with no input, TODO throw an error, instead of failing silent
		if(handle.assigned_keys === undefined || handle.assigned_keys.length < 0)
			return false;
		
		// ignore keys which are not assigned	
		if(in_array(keyCode, handle.assigned_keys) === false)
			return false;
		
		// ignore keys which are not currently pressed
		if(in_array(keyCode, handle.pressed_keys) === false)
			return false;

		// remove key
		handle.pressed_keys.splice(get_array_key(keyCode, handle.pressed_keys), 1);
		
		// onkey up shenaningans, TODO move to main loop and use released_keys
		if (handle.sm.currentState.onKeyUp !== undefined)
			handle.sm.currentState.onKeyUp(handle);
		
		// debounce key-release
		if(handle.released_keys[handle.released_keys.length-1] === keyCode)
			return false;
		
		// ignore keys which are already in release
		if(in_array(keyCode, handle.released_keys) === true)
			return false;
		
		// add key to released_keys
		handle.released_keys[handle.released_keys.length] = keyCode;
		
	});

};
