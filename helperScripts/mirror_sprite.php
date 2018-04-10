<?php

	define ( 'IMAGE_FLIP_HORIZONTAL', 1 );
	define ( 'IMAGE_FLIP_VERTICAL', 2 );
	define ( 'IMAGE_FLIP_BOTH', 3 );

	function ImageFlip ( $imgsrc, $mode ) {

		$width                        =    imagesx ( $imgsrc );
		$height                       =    imagesy ( $imgsrc );

		$src_x                        =    0;
		$src_y                        =    0;
		$src_width                    =    $width;
		$src_height                   =    $height;

		//switch ( (int) $mode )
		//{

			//case IMAGE_FLIP_HORIZONTAL:
				/*$src_y                =    $height;
				$src_height           =    -$height;*/
			//break;

			/*case IMAGE_FLIP_VERTICAL:*/
				$src_x                =    $width;
				$src_width            =    -$width;/*
			break;

			case IMAGE_FLIP_BOTH:
				$src_x                =    $width;
				$src_y                =    $height;
				$src_width            =    -$width;
				$src_height           =    -$height;
			break;

			default:
				return $imgsrc;*/

		//}

		$imgdest = imagecreatetruecolor ( $width, $height );
		imagealphablending( $imgdest, false );
		imagesavealpha( $imgdest, true );

		if ( imagecopyresampled ( $imgdest, $imgsrc, 0, 0, $src_x, $src_y, $width, $height, $src_width, $src_height ) )
		{
			return $imgdest;
		}

		return $imgsrc;

	}
	
	if( !isset($_GET['src']) || !isset($_GET['dst']) ) die();
	
	$im_url = "images/".$_GET['src'];
	$im_target = "images/".$_GET['dst'];
	
	$im = imagecreatefrompng($im_url);
	$dim = array( "width" => imagesx($im), "height" => imagesy($im) );
	
	// Count the number of frames
	$frames = array();
	$frames_anzahl = 0;
	for($a=0; $a<=$dim['width']; $a++) {
		
		if($a == ($dim['width'] ) ) 
			$frames[$frames_anzahl++] = $a;
		else {
			$rgb = imagecolorat($im, $a, 0);
			$colors = imagecolorsforindex($im, $rgb);
			if( $colors['red'] == 255 && $colors['green'] == 0 && $colors['blue'] == 252 ) 
				$frames[$frames_anzahl++] = $a;
		}
	
	} 	print_r($frames);echo"<br><br>";

	// Copy each frame to a single image, flip this image, and copy each frame back to a sprite
	$new = imagecreate( $dim['width'], $dim['height'] );
	$prev = -1;
	$z = 0;
	foreach($frames as $item) {
	
		// copy each frame to a single image
		$im_tmp = imagecreate( ($item-($prev+1)), $dim['height'] );
		ImageCopy( $im_tmp , $im , 0 , 0 , ($prev+1) , 0 , ($item-($prev+1)) , $dim['height'] );
		
		// flip this image
		$im_tmp = ImageFlip($im_tmp, 'IMAGE_FLIP_HORIZONTAL');
		
		// and copy each frame back to image $new
		ImageCopy( $new, $im_tmp, ($prev), 0, 0, 0, ($item-($prev+1)), $dim['height']);
		
		// and add a pink line
		if( $z < $frames_anzahl-1 ) {
			$line = imagecolorallocate($new, 255, 0, 252);
			for($a=0; $a<=$dim['height']; $a++) {
				imagesetpixel ( $new , ($prev) + ($item-($prev+1)), $a , $line);
			} 
		}
		$prev = $item;
		$z++;
	}
	
	//$new = ImageFlip($im, 'IMAGE_FLIP_HORIZONTAL');
	
	imagepng($new, $im_target);
	//print_r($new);
	

?>