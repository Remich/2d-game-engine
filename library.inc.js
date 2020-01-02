/* (c)opyright 2018 René Michalke */

export function is_touch_device() {  
 
	  try {  
			document.createEvent("TouchEvent");  
			return true;  
	  } catch (e) {  
			return false;  
	  } 
	  
};


export function width(array, prev_frames) {
		var erg = 0;
		
		for(var i = 0; i <= prev_frames; i++) {
		
			erg += array[i].margin;
			
			if(i < prev_frames)
				erg += array[i].width;
				
		}
		
		return erg; 
};


export let in_array = function(needle, haystack)  {

	for(var a = 0; a < haystack.length; a++) 
		if(haystack[a] === needle) 
			return true;
	return false
			
};


export let get_array_key = function (needle, haystack) {

	for(var a = 0; a < haystack.length; a++) 
		if(haystack[a] == needle) 
			return a;
			
};


export let change_size = function (selector, width, height) {

	$(selector).css('width' , width+'px');
	$(selector).css('height' , height+'px');
	
};


export let round = function (somenum) {

	return (0.5 + somenum) << 0;

};

export let floor = function (somenum) {

	return ~~somenum;

};

// TODO Not used, eventually remove

export let filter_fps_lag = function() {

	return (window.cfg.elapsed_time / window.cfg.fps_sim) * 1.2; 
	
};

// function flipHorizontal(array:Array):Array
// {
// 	var transformedArray:Array = new Array();
	
// 	for ( var i:int = 0; i < array.length; i++ )
// 	{
// 		transformedArray[i] = new Array();
		
// 		var index:int = 0;
// 		for ( var j:int = array[0].length - 1; j > -1; j-- )
// 		{
// 			transformedArray[i][index] = array[i][j];
// 			index++;
// 		}
// 	}
	
// 	return transformedArray;
// }

export let flipArrayHorizontal = function(ar) {
	var transformedArray = [];
	// for(var i = 0; i < ar.length; i++) {
		var index = 0;
		for(var j= ar.length-1; j > -1; j--) {
			transformedArray[index] = ar[j];
			index++;
		}

	// }

	return transformedArray;
};
