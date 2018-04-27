<?php
	


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
	
	if( !isset($_GET['image']) || !isset($_GET['id']) ) die("bitte id und image angeben");
	if( !file_exists('../images/'.$_GET['image']) ) die("Datei existiert nicht.");

	$im_url = '../images/'.$_GET['image'].'';
	$animation_id = $_GET['id'];

	$im = imagecreatefrompng($im_url);
	
	$size = getimagesize($im_url);
	$dim = extract_dimensions($size[3]);
	print_r($dim);
	echo "<br><br>";

	// create heightMap
	$heightMap = Array();
	$i = 0;
	echo 'that.heightMap = [ ';
	for($a=0; $a<$dim['width']; $a++) {
		for($b=0; $b<$dim['height']; $b++) {

			$rgba = imagecolorat($im, $a, $b);
			$colors = imagecolorsforindex($im, $rgba);

			if( $colors["alpha"] !== 127 ) {
				$heightMap[$i++] = $b;
				echo $b . ", ";

				$b=0;
				break;
			}
		}
	}
	echo '];';

	$interp_count = 256;
	echo '<h1>interpolated heightMap with size of '.$interp_count.'</h1>';
	echo 'that.heightMap = [ ';
	$cur_count = 0;
	$avg = 0;
	for($a=0; $a<sizeof($heightMap); $a++) {

		if(($cur_count%$interp_count) === 0) {
			$avg = 0;
			for($b=0; $b<$interp_count; $b++) {
				$avg += $heightMap[$a+$b];
			}
			$avg = round($avg / $interp_count);
		}

		$heightMap[$a] = $avg;
		echo $heightMap[$a];
		echo ", ";

		$cur_count++;
	}
	echo '];';
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
