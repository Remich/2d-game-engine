/* (c)opyright 2018 René Michalke */

// Camera constructor
var Camera = function(xView, yView, canvasWidth, canvasHeight, levelWidth, levelHeight) {

	// The camera is set to the middle of the game window
	this.x = canvasWidth * 0.5;
	this.y = canvasHeight * 0.5;

	this.width = canvasWidth;
	this.height = canvasHeight;

	this.levelWidth = levelWidth;
	this.levelHeight = levelHeight;

	this.xScroll = xView;
	this.yScroll = yView;

	this.position = [this.xScroll, this.yScroll];
	this.prevPosition = [this.xScroll, this.yScroll];
	this.curPosition = [this.xScroll, this.yScroll];

	this.following = null;

	this.lerpAmount = 1.0; 
};

// Linear Interpolation
Camera.prototype.Lerp = function(A, B){
	return (A * this.lerpAmount) + ((1.0 - this.lerpAmount) * B);
};

Camera.prototype.follow = function(gameObject) {		
	this.following = gameObject;	
};

Camera.prototype.update = function() {

	// if(window.myEngine.editor === true) {


	// } else {

		// Get the distance from the player to the middle of the screen (our focal point)  
		if (this.following === null) {
			return false;
		}
		this.dx = (this.following.x + 32 - this.x + this.following.camera_offset_x);
		this.dy = (this.following.y + 32 - this.y + this.following.camera_offset_y);
	
	// }


	// The camera is moving 
	this.position = [this.xScroll, this.yScroll];
	if(this.position != this.curPosition){
		this.lerpAmount = 0.0;
		this.curPosition = this.position;
	}
	// increase the speed of the camera if we are not at full camera speed
	if(this.lerpAmount < 1.0){
		this.lerpAmount += 0.15; // old: 0.23
	} else {
		this.prevPosition = this.curPosition;
	}
	// Interpolate the  current position on the x-axis
	this.xScroll = this.Lerp(this.dx, this.curPosition[0]); 
	// Interpolate the current position on the y-axis
	this.yScroll = this.Lerp(this.dy, this.curPosition[1]); 


	// don't let camera leave the level's boundary
	if (this.yScroll < 0) 
		this.yScroll = 0;
	if (this.yScroll + this.height > this.levelHeight)
		this.yScroll = this.levelHeight - this.height;
	if (this.xScroll < 0)
		this.xScroll = 0;
	if (this.xScroll + this.width > this.levelWidth)
		this.xScroll = this.levelWidth - this.width;

};
