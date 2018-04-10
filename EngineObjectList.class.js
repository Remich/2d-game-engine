var EngineObjectList = function() {};
EngineObjectList.prototype.myList = []; //new Array();
EngineObjectList.prototype.actualSize = 0;
EngineObjectList.prototype.add = function( obj ) {
	if(obj === undefined)
		return false;
	obj.id = this.myList.length;
	this.myList[this.myList.length] = obj; 
	this.actualSize++;
	return true;
};
EngineObjectList.prototype.remove = function( id ) {
	if(this.myList[id] !== undefined) {
		if(this.myList[id].solid) {
			window.myEngine.Collision.rm(this.myList[id]);
		}
		if (this.myList[id].replace !== undefined) {
			this.myList[id] = this.myList[id].replace;
		} else {
			// delete this.myList[id];
			// splice is awfully slow, so we just set the key to undefined
			this.myList[id] = undefined;
			this.actualSize--;
			// this.myList.splice(id, 1);
		}
		return true;
	}	
	return false;
};
EngineObjectList.prototype.get = function( id ) {
	if(this.myList[id] !== undefined)
		return this.myList[id];
	return false;
};
EngineObjectList.prototype.getByName = function( needle ) {
	for (var a in this.myList) {
		if(this.myList[a].name === needle) {
			return this.myList[a];
		}
	}
	return false;
};
EngineObjectList.prototype.each = function( func ) {
	for (var a in this.myList) {
		if (this.myList[a] !== undefined)
			func( this.myList[a] );
	}
	return true;
};
