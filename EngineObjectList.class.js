/* (c)opyright 2018 René Michalke */

var EngineObjectList = function() {

	this.myList = [];
	this.actualSize = 0;
	
	this.each = function( func ) {
		for (var a in this.myList) {
			if (this.myList[a] !== undefined) {
				if(this.myList[a].spawned === true)
					func( this.myList[a] );
			}
		}
		return true;
	};
	
	this.getByName = function( needle ) {
		for (var a in this.myList) {
			if (this.myList[a] === undefined) 
				continue;
			if(this.myList[a].name === needle) {
				return this.myList[a];
			}
		}
		return false;
	};
	
	this.add = function( obj ) {
		if(obj === undefined)
			return false;
		obj.id = this.myList.length;
		this.myList[this.myList.length] = obj; 
		this.actualSize++;
		return true;
	};
	this.remove = function( id ) {
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
	this.get = function( id ) {
		if(this.myList[id] !== undefined)
			return this.myList[id];
		return false;
	};
	this.getList = function( func ) {
		return this.myList;	
	};
};

export { EngineObjectList }
