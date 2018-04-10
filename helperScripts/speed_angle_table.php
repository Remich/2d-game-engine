<?php

	for($a=0;$a<=359;$a++) {
		for($speed=-50; $speed < 50; $speed++) {

			echo "$speed * cos($a) = ". $speed *  cos(($a/180)*pi()) . "<br>";
		}

	}

?>