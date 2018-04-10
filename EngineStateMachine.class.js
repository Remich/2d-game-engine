/* (c)opyright 2018 René Michalke */

function EngineStateMachine() {
	this.currentState = false;
}
EngineStateMachine.prototype.changeState = function(newState, obj) {
	if(newState === undefined) {
		console.log("error: newState of " + obj.name + " undefined");
		return false;
	} 
	if(obj === undefined) {
		console.log("error: obj undefined");
		return false;
	} 
	if(this.currentState.id == newState.id) {
		// console.log("not changing State to " + newState.name);
		return false;
	}
	if (obj.BlockedAnimations.isBlocked(newState.name, newState.interlock)) {
		return false;
	}

	// console.log("changing state: " + newState.name);
	if(this.currentState)
		this.currentState.exit(this, obj);

	if(!this.currentState || this.currentState.breakable(obj.speed_y)) {
		this.currentState = newState;
		$('#'+obj.id+' img').attr('src', newState.image.src);
	}

	if(this.currentState)
		this.currentState.enter(this, obj);
};

EngineStateMachine.prototype.getCurrentState = function() {
	return this.currentState;
};

EngineStateMachine.prototype.update = function(obj) {
	if(this.currentState !== undefined)
		this.currentState.update(this, obj);
};
