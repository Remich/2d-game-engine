<!-- (c)opyright 2018 René Michalke -->

<!DOCTYPE html>
<html manifest="manifest.php">

	<head>
		<meta http-equiv="Content-Security-Policy" content="default-src *; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost">

		<meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1.0, maximum-scale=1.0" />
		
		<link rel="stylesheet" href="style.css" type="text/css" media="screen, mobile" title="main" charset="utf-8" />
		
		<script type="text/javascript" src="jquery-2.1.1.min.js" /></script>
		<script type="text/javascript" src="game.js"></script>

			<?php include('library.inc.js'); ?>
			<?php include('lib/QuadTree.js'); ?>
			<?php include('Point.class.js'); ?>
			<?php include('EngineStateMachine.class.js'); ?>
			<?php include('EngineObjectList.class.js'); ?>
			<?php include('EngineCollision.class.js'); ?>
			<?php include('EngineInput.class.js'); ?>
			<?php include('EngineCamera.class.js'); ?>
			<?php include('EngineSensor.class.js'); ?>
			<?php include('EngineCellularAutomaton.class.js'); ?>
			<?php include('SensorGround.class.js'); ?>
			<?php include('SensorFloor.class.js'); ?>
			<?php include('SensorObject.class.js'); ?>
			<?php include('SensorAutomaton.class.js'); ?>
			<?php include('Object.class.js'); ?>
			<?php include('ObjectStatic.class.js'); ?>
			<?php include('ObjectWithInput.class.js'); ?>
			<?php include('ObjectChar.class.js'); ?>
			<?php include('ObjectExplosion.class.js'); ?>
			<?php include('ObjectBeatnik.class.js'); ?>
			<?php include('ObjectRing.class.js'); ?>
			<?php include('ObjectRingBouncing.class.js'); ?>
			<?php include('ObjectGround.class.js'); ?>
			<?php include('ObjectGroundLooping3.class.js'); ?>
			<?php include('ObjectBackground.class.js'); ?>
			<?php include('ObjectBackgroundSea.class.js'); ?>
			<?php include('ObjectBackgroundHorizon.class.js'); ?>
			<?php include('ObjectBackgroundMeadow.class.js'); ?>
			<?php include('ObjectBackgroundMeadow2.class.js'); ?>
			<?php include('ObjectBackgroundMeadowMountains.class.js'); ?>
			<?php include('ObjectBackgroundGrass4.class.js'); ?>
			<?php include('ObjectBackgroundBlankGreen.class.js'); ?>
			<?php include('ObjectBackgroundAngelIsland.class.js'); ?>
			<?php include('ObjectBackgroundTree.class.js'); ?>
			<?php include('ObjectBackgroundForrest.class.js'); ?>
			<?php include('ObjectBlock.class.js'); ?>
			<?php include('ObjectHillDown.class.js'); ?>
			<?php include('ObjectSlope.class.js'); ?>

			<!-------------------- | start document.ready() | -------------------->

			$(document).ready(function() {


				<?php include('Engine.class.js'); ?>

				window.myEngine = new Engine();
				window.myEngine.objects = new EngineObjectList();
				window.onresize = function() {
					
					window.myEngine.initScreen();

					/*
					 * Re-Position Camera
					 */
					if(window.myEngine.objects !== undefined) {

							var handle = window.myEngine.objects.getByName('char');
							/* debugger; */
							window.myEngine.Camera = new Camera(handle.x-window.cfg.screen_width/2*(1/window.myEngine.canvas_zoom_width), handle.y, window.cfg.screen_width*(1/window.myEngine.canvas_zoom_width), window.cfg.screen_height*(1/window.myEngine.canvas_zoom_height), window.cfg.level_width, window.cfg.level_height);
					}
							
				}

				/*
				* Objekte aus JSON file laden
				*/
					
				var list = window.myEngine.objects
				var objects = list

				//
				// recreation for json export
				// 
				/* var height_modifier = 1792; //4666 + 1600; */


				/* TODO call handle_as_json_string = handle.persist() instead of the following */
				/* var str = "" */
				/* var ar = [] */
				/* objects.each(function(handle) { */
				/* 	var foo = { */
				/* 		name : handle.name, */
				/* 		bootstrap : handle.bootstrap, */
				/* 		x : handle.x, */
				/* 		y : handle.y, */
				/* 		solid : handle.solid, */
				/* 	} */
				/* 	ar.push(JSON.stringify(foo)) */
				/* }) */	
				/* str = ar.join(`, */

/* `) */				
				/* console.log(str) */

				/* var url = 'data:text/json;charset=utf8,' + str */
				/* window.open(url, '_blank'); */
				/* window.focus(); */
				
				//
				// end-recreation for json export
				// 
				
				$.getJSON('./sonic-angelisland.json', function(obj) {
					
					for (var a in obj) {
						
						// instantiate new object
						var handle = obj[a]
						var tmp = eval(handle.bootstrap)

						// assign additional attributes to the dynamic game object
						for(var p in handle) {
							console.log(p)
							tmp[p] = handle[p]
						}

						// initSensors
						if(tmp.solid === true && tmp.initSensors !== undefined) {
							tmp.initSensors()
						}

						// hook the object into areas of this Engine
						if(handle.player_1 === true) {
							window.myEngine.InputHandler.add(tmp)
						}

						// add object to global list
						list.add(tmp)
					}



				// Wait until the level file as been loaded. ( Clunky )
				setTimeout(function() {

					window.myEngine.Camera = new Camera(0,140 - (window.cfg.screen_width*(1/window.myEngine.canvas_zoom_width))/2, window.cfg.screen_width*(1/window.myEngine.canvas_zoom_width), window.cfg.screen_height*(1/window.myEngine.canvas_zoom_height), window.cfg.level_width, window.cfg.level_height);	

					setInterval('window.myEngine.loop()', window.myEngine.get_interval());
						
				}, 1000)
						
			});

		});
				
		</script>
		
		<title>2D Game Engine – Demo</title>
	</head>

	<body>
		<div id="fps"></div>
		<div id="debug"></div>
		<canvas id="canvas_1"></canvas>
		<canvas id="canvas_2"></canvas>
	</body>
	
</html>
