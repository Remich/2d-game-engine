<?php

	/*
	* usage: generate-object.php?image=GroundSlopeUp&id=0&type=Ground&interpolation=8
	*/

	// 1. Get Name
	$name = $_GET['image'];

	// 2. Resize Original Image

	// 3. Get Width and Height
	function extract_dimensions ($str) {
	
		$a=0;
		$width = "";
		$height = "";
		
		while($str[$a] != '"')$a++;$a++;
		while($str[$a] != '"')
			$width .= $str[$a++];
			
		while($str[++$a] != '"')$a++;$a++;
		while($str[$a] != '"')
			$height .= $str[$a++];
	
		return	array('width' => (int)$width, 'height' => (int)$height);
	
	}

	function atan2ToDeg($x) {
		$theta = 360 + rad2deg($x);

		return $theta;
	}

	function extractHeightMap($image, $direction, $width, $height) {

		$map = Array();
		$i=0;

		switch($direction) {

			case 'floor':
				for($a=0; $a<$width; $a++) {
					for($b=0; $b<$height; $b++) {

						$rgba = imagecolorat($image, $a, $b);
						$colors = imagecolorsforindex($image, $rgba);

						if( $colors["alpha"] !== 127 ) {
							$map[$i++] = $b;
							// echo $b . ", ";

							$b=$width-1;
							break;
						}

					}
				}

			break;

			case 'ceiling':
				for($a=0; $a<$width; $a++) {
					for($b=$height-1; $b>=0; $b--) {

						$rgba = imagecolorat($image, $a, $b);
						$colors = imagecolorsforindex($image, $rgba);

						if( $colors["alpha"] !== 127 ) {
							$map[$i++] = $b;
							$b=0;
							break;
						}

					}
				}

			break;


			case 'wall-right':

				for($a=0; $a<$height; $a++) {
					for($b=0; $b<$width; $b++) {

						$rgba = imagecolorat($image, $b, $a);
						$colors = imagecolorsforindex($image, $rgba);

						if( $colors["alpha"] !== 127 ) {
							$map[$i++] = $b;
							// echo $b . ", ";

							$b=$width-1;
							break;
						}

					}
				}

			break;

			case 'wall-left':

				for($a=0; $a<$height; $a++) {
					for($b=$width-1; $b>=0; $b--) {

						$rgba = imagecolorat($image, $b, $a);
						$colors = imagecolorsforindex($image, $rgba);

						if( $colors["alpha"] !== 127 ) {
							$map[$i++] = $b;
							// echo $b . ", ";

							$b=$width-1;
							break;
						}

					}
				}

			break;

		}

		return $map;

	}

	function slopeToAngle($y2, $y1, $x2, $x1) {
		return round( rad2deg( atan2( $y2 - $y1, $x2 - $x1) ) );
	}

	function extractAngleMap($heights, $direction) {

		$anglemap = Array();
		$i=0;

		switch($direction) {

			case 'floor':

				$angleWidth = 4;
				$prev = -1;
				for($a=0; $a<sizeof($heights); $a++) {

					// if($a>=sizeof($heights)/2)
						$compare_value_key = $a+$angleWidth;
					// else
					// 	$compare_value_key = $a+$angleWidth;

					if($compare_value_key >= sizeof($heights)) {
						$compare_value_key = sizeof($heights) - 1;
					}
					if($compare_value_key < 0) {
						$compare_value_key = 0;
					}
					echo $compare_value_key."<br>";

					if($a >= sizeof($heights) - $angleWidth)
						$anglemap[$a] = $prev;
					else
						$anglemap[$a] = 360 + slopeToAngle( $heights[$compare_value_key], $heights[$a], $compare_value_key, $a);
						// $anglemap[$a] = 360 + round ( rad2deg( atan2( $heights[$compare_value_key] - $heights[$a], $compare_value_key - $a ) ) );

					// echo "anglemap[$a]: ".$anglemap[$a]." ,";
					// if($anglemap[$a] <= 315 && $anglemap[$a] > 225) {

					// 	$anglemap[$a] = 360 + round ( rad2deg( atan2( $heights[$compare_value_key] - $heights[$a], $compare_value_key - $a ) ) );

					// }

					$prev = $anglemap[$a];

				}

			break;

			case 'right-wall':

				$angleWidth = 4;
				$prev = -1;
				for($a=0; $a<sizeof($heights); $a++) {

					// if($a>=sizeof($heights)/2)
						$compare_value_key = $a+$angleWidth;
					// else
					// 	$compare_value_key = $a+$angleWidth;

					if($compare_value_key >= sizeof($heights)) {
						$compare_value_key = sizeof($heights) - 1;
					}
					if($compare_value_key < 0) {
						$compare_value_key = 0;
					}
					echo $compare_value_key."<br>";

					if($a >= sizeof($heights) - $angleWidth)
						$anglemap[$a] = $prev;
					else
						$anglemap[$a] = 360 + slopeToAngle( $heights[$compare_value_key], $heights[$a], $compare_value_key, $a);
						// $anglemap[$a] = 360 + round ( rad2deg( atan2( $heights[$compare_value_key] - $heights[$a], $compare_value_key - $a ) ) );

					// echo "anglemap[$a]: ".$anglemap[$a]." ,";
					// if($anglemap[$a] <= 315 && $anglemap[$a] > 225) {

					// 	$anglemap[$a] = 360 + round ( rad2deg( atan2( $heights[$compare_value_key] - $heights[$a], $compare_value_key - $a ) ) );

					// }

					$prev = $anglemap[$a];

				}


			break;

			case 'ceiling':

				$angleWidth = 32;
				$prev = -1;
				for($a=sizeof($heights)-1; $a>=0; $a--) {

					// if($a>=sizeof($heights)/2)
						$compare_value_key = $a-$angleWidth;
					// else
					// 	$compare_value_key = $a+$angleWidth;

					if($compare_value_key < 0) {
						$compare_value_key = 0;
					}

					// if($a >= sizeof($heights) - $angleWidth)
					// 	$anglemap[$a] = $prev;
					// else
						$anglemap[$a] = 360 + slopeToAngle( $heights[$compare_value_key], $heights[$a], $compare_value_key, $a);
						// $anglemap[$a] = 360 + round ( rad2deg( atan2( $heights[$compare_value_key] - $heights[$a], $compare_value_key - $a ) ) );

					// echo "anglemap[$a]: ".$anglemap[$a]." ,";
					// if($anglemap[$a] <= 315 && $anglemap[$a] > 225) {

					// 	$anglemap[$a] = 360 + round ( rad2deg( atan2( $heights[$compare_value_key] - $heights[$a], $compare_value_key - $a ) ) );

					// }

					// $prev = $anglemap[$a];

				}

			break;

		}

		return $anglemap;

	}
	
	if( !isset($_GET['image']) || !isset($_GET['id']) ) die("bitte id und image angeben");
	$str = 'images/'.$name.'.png';

	// echo $str."<br>";
	if( !file_exists($str) ) die("Datei existiert nicht.");

	$im_url = 'images/'.$_GET['image'].'.png';
	$im_name = $_GET['image'].'.png';
	// $im_path_right_wall = "generatedImages/".$_GET['image']."_right_wall.png";

	$animation_id = $_GET['id'];

	$im = imagecreatefrompng($im_url);

	// $cmd = "convert -rotate 90 ".$im_url." $im_path_right_wall 2>&1";
	// exec($cmd, $output, $return);
	// $im_right_wall = imagecreatefrompng($im_path_right_wall);



	
	$size = getimagesize($im_url);
	// $im_right_wall_size = getimagesize($im_path_right_wall);

	$dim = extract_dimensions($size[3]);
	// $dim_right_wall = extract_dimensions($im_right_wall_size[3]);

	$width = $dim['width'];
	$height = $dim['height'];
	echo "<br><br>";

	// TODO Scale 2x
	// $im = imagescale($im, $width*2 , $height*2, IMG_NEAREST_NEIGHBOUR );

	// create heightMap
	$heightMaps = Array();
	$heightMaps['floor'] = extractHeightMap($im, 'floor', $dim['width'], $dim['height']);
	// $heightMaps['right-wall'] = extractHeightMap($im_right_wall, 'floor', $dim_right_wall['width'], $dim_right_wall['height']);
	// $heightMaps['ceiling'] = extractHeightMap($im, 'ceiling', $dim['width'], $dim['height']);

	// $heightMapAlt = array_reverse($heightMapAlt);

	if(@!isset($_GET['interpolation'])) {
		$interp_count = 2;
	} else {
		$interp_count = $_GET['interpolation'];
	}
	// echo '<h1>interpolated heightMap with size of '.$interp_count.'</h1>';
	// echo 'that.heightMap = [ ';
	$cur_count = 0;
	$avg = 0;
	for($a=0; $a<sizeof($heightMaps['floor']); $a++) {

		if(($cur_count%$interp_count) === 0) {
			$avg = 0;
			for($b=0; $b<$interp_count; $b++) {
				$avg += $heightMaps['floor'][$a+$b];
			}
			$avg = round($avg / $interp_count);
		}

		$heightMaps['floor'][$a] = $avg;
		// echo $heightMaps['floor'][$a];
		// echo ", ";

		$cur_count++;
	}
	// echo '];';

	$angleMaps = Array();
	$angleMaps['floor'] = extractAngleMap($heightMaps['floor'], 'floor');
	// $angleMaps['right-wall'] = extractAngleMap($heightMaps['right-wall'], 'floor');

	// for($a=0; $a<sizeof($angleMaps['right-wall']); $a++) {
	// 	$angleMaps['right-wall'][$a] -= 90;
	// }

	// $angleMaps['ceiling'] = extractAngleMap($heightMaps['ceiling'], 'ceiling');

	// Sensors
	$numsensors = $width / 12;




	$str = "";
	switch($_GET['type']) {
		case 'Background':
			$str = <<<"EOT"
var Object$name = function() {

	var that = new ObjectBackground();

	that.repeat = 'no-repeat';

	that.Chill = function(obj) {

		var foobar = {};

		foobar.id = 0;
		foobar.name = 'Chill';
		foobar.image = new Image();
		foobar.image.src = 'images/$name.png';
		foobar.breakable = function(foo) { return false; };
		foobar.loop = false;
		foobar.length = 1;

		foobar.frames = [];

		foobar.frames[0] = [];
		foobar.frames[0].width = $width;
		foobar.frames[0].height = $height;
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
EOT;

		break;

		case 'Ground':
		case 'Slope':
			$str = <<<"EOT"
var Object$name = function() {

	var that = new ObjectStatic();

	that.name = 'slope'; // or 'ground'

	that.collide = function( obj, b ) { 
		return that.parentCollide( obj, b );
	};
	that.in_air = false;
	that.rolling = false;

	that.get_state = function() {
	};

	that.Chill = function() {
		var foobar = {};

		foobar.id = 0;
		foobar.name = 'Chill';
		foobar.image = new Image();
		foobar.image.src = 'images/$name.png';
		foobar.breakable = function(foo) { return true; };
		foobar.loop = false;
		foobar.length = 1;

		foobar.frames = [];

		foobar.frames[0] = [];
		foobar.frames[0].width = $width;
		foobar.frames[0].height = $height;
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

	ObjectSensor_Ground_0 = function() {
		this.x = null;
		this.y = null;
		this.width = null;
		this.height = null;
		this.sensor_type = "ground";

		this.update = function(x, y, width, height) {
		};

		this.collide = function(obj, b) {
		};

	};

	that.initSensors = function() {

		that.sensors = [];

		for(var i=0; i<that.heightMaps['floor'].length; i++) {

			var sensor = new ObjectSensor_Ground_0();
			sensor.x = null;
			sensor.y = null;
			sensor.width = 1;
			sensor.height = 256;

			sensor.update = function(x, y, width, height) {
				sensor.x = x + i;
				sensor.y = y + that.heightMaps['floor'][i];// + 12; // + 12 if in grass or something
				sensor.width = 1; 
				sensor.height = 256;
			};

			sensor.update( that.x, that.y, that.sm.currentState.frames[floor(that.frames)].width, that.sm.currentState.frames[floor(that.frame)].height );
			that.sensors.push(sensor);
		}
	};

	that.updateSensors = function() {
		var width = that.sm.currentState.frames[floor(that.frame)].width;
		var height = that.sm.currentState.frames[floor(that.frame)].height;
		for (var a in that.sensors) {
			that.sensors[a].update(that.x, that.y, width, height);
		}
	};

	that.resetSensors = function() {
		for (var a in that.sensors) {
			that.sensors[a].colliding = false;
		}
		return true; 
	};

	that.heightMaps = Array();
	that.angleMaps = Array();

EOT;

foreach($heightMaps as $key => $item) {

$str .= <<<"EOT"
	
	that.heightMaps['$key'] = [ 
EOT;

	for($z=0;$z<sizeof($item);$z++) {
		if(($z+10)%10===0)
			$str .= "\n		";
		$str .= $item[$z].", ";
	}
	$str .= "];\n";

}


foreach($angleMaps as $key => $item) {

$str .= <<<"EOT"

	that.angleMaps['$key'] = [ 
EOT;

	for($z=0;$z<sizeof($item);$z++) {
		if(($z+10)%10===0)
			$str .= "\n		";
		$str .= $item[$z].", ";
	}
	$str .= "];\n";

}

$str .= <<<"EOT"

	return that;

};
EOT;
		break;
	}


$filepointer = fopen("generatedObjects/Object".$name.".class.js", "w+");
fwrite($filepointer, $str);
fclose($filepointer);
echo $str;

die();































	


	
	// // Count the number of frames
	// $frames = array();
	// $frames_anzahl = 0;
	// for($a=0; $a<=$dim['width']; $a++) {
		
	// 	if($a == ($dim['width'] ) ) 
	// 		$frames[$frames_anzahl++] = $a;
	// 	else {
	// 		$rgb = imagecolorat($im, $a, 0);
	// 		$colors = imagecolorsforindex($im, $rgb);
	// 		if( $colors['red'] == 255 && $colors['green'] == 0 && $colors['blue'] == 252 ) 
	// 			$frames[$frames_anzahl++] = $a;
	// 	}
	
	// } 	print_r($frames);echo"<br><br>";
	
	// // Find the most left and most high pixel which is not transparent for each frame;
	// $prev = 0;
	// $frames_new = array();
	// $frames_count = 0;
	// foreach($frames as $key => $item) {
		
	// 	for($a=$prev; $a<$item; $a++) {
	// 		for($b=0; $b<$dim['height']; $b++) {
			
	// 			$rgb = imagecolorat($im, $a, $b); 
	// 			$colors = imagecolorsforindex($im, $rgb);
	// 			//echo 'pixel '.$a." - ".$b.": "; print_r($colors); echo "<br>";
				
	// 			if($colors['alpha'] != 127 && !(isset($frames_new[$frames_count]['most_left'])) ) { 
	// 				$frames_new[$frames_count]['most_left'] = $a;
	// 			}
			
	// 		}
	// 	}
		
	// 	for($b=0; $b<$dim['height']; $b++) {
	// 		for($a=$prev; $a<$item; $a++) {
			
	// 			$rgb = imagecolorat($im, $a, $b); 
	// 			$colors = imagecolorsforindex($im, $rgb);
	// 			//echo 'pixel '.$a." - ".$b.": "; print_r($colors); echo "<br>";
				
	// 			if($colors['alpha'] != 127 && !(isset($frames_new[$frames_count]['most_high'])) ) { 
	// 				$frames_new[$frames_count]['most_high'] = $b;
	// 			}
			
	// 		}		
	// 	}
		
	// 	$prev = $item+1;
	// 	$frames_count++;
	// }
	// echo "<pre>";
	// print_r($frames_new);
	// echo "</pre>";
	
	
	// // Compute the Object Code
	// /*e.g.: this.animations[2].frames[0] = new Array();
	// this.animations[2].frames[0].width = 52;
	// this.animations[2].frames[0].height = 76;
	// this.animations[2].frames[0].margin = 10; */
	// $z = 0;
	// $str = '';
	// $prev = -1;
	
	
	
	// foreach($frames as $item) {
	// 	$str .= 'this.animations['.$animation_id.'].frames['.$z.'] = new Array();<br>';
	// 	$str .= 'this.animations['.$animation_id.'].frames['.$z.'].width = '. ($item-($prev+1)) .';<br>';
	// 	$str .= 'this.animations['.$animation_id.'].frames['.$z.'].height = '. ($dim['height'] - $frames_new[$z]['most_high']) .';<br>';
	// 	$str .= 'this.animations['.$animation_id.'].frames['.$z.'].margin = '. ($z == 0 ? 0 : 1) .';<br>';
	// 	$str .= '<br>';
	// 	$prev = $item;
	// 	$z++;
	// } 
	// echo 'this.animations['.$animation_id.'] = new Array();<br>';	
	// echo 'this.animations['.$animation_id.'].id = '.$animation_id.';<br>';
	// echo 'this.animations['.$animation_id.'].name = \''.$_GET['image'].'\';<br>';
	// echo 'this.animations['.$animation_id.'].breakable = function () { return 1; };<br>';
	// echo 'this.animations['.$animation_id.'].loop = false;<br>';
	// echo 'this.animations['.$animation_id.'].image = new Image();<br>';
	// echo 'this.animations['.$animation_id.'].image.src = \'images/'.$_GET['image'].'\';<br>';
	// echo 'this.animations['.$animation_id.'].frames = new Array();<br><br>';
	// echo 'this.animations['.$animation_id.'].frames.length = '.$z.';<br><br>'; printf( $str );
?>