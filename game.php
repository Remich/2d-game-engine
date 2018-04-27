<!-- (c)opyright 2018 René Michalke -->

<!DOCTYPE html>
<html manifest="manifest.php">

	<head>
	
		<meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1.0, maximum-scale=1.0" />
		
		<link rel="stylesheet" href="style.css" type="text/css" media="screen, mobile" title="main" charset="utf-8" />
		
		<script type="text/javascript" src="jquery-2.1.1.min.js" /></script>
		<script language="JavaScript">
		
			window.cfg = new Object();
				
			window.cfg.screen_width;
			window.cfg.screen_height;

			window.cfg.last_time = new Date().getTime();
			window.cfg.elapsed_time;

			<?php include('library.inc.js'); ?>
			<?php include('EngineStateMachine.class.js'); ?>
			<?php include('EngineObjectList.class.js'); ?>
			<?php include('EngineCollision.class.js'); ?>
			<?php include('EngineCamera.class.js'); ?>
			<?php include('Object.class.js'); ?>
			<?php include('ObjectStatic.class.js'); ?>
			<?php include('ObjectWithInput.class.js'); ?>
			<?php include('ObjectChar.class.js'); ?>
			<?php include('ObjectExplosion.class.js'); ?>
			<?php include('ObjectBeatnik.class.js'); ?>
			<?php include('ObjectRing.class.js'); ?>
			<?php include('ObjectRingBouncing.class.js'); ?>
			<?php include('ObjectGround.class.js'); ?>
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

				// window.onresize = change_viewport;	

				<?php include('Engine.class.js'); ?>
				window.myEngine = new Engine();

				// implements scrolling by right-mouse button ( button 2)
				// implements debug of position of left-mouse click ( button 0 )
				if(window.myEngine.editor === true) {
					var dist_x = 0;
					var dist_y = 0;
					var x1 = 0;
					var y1 = 0;
					window.addEventListener("mousedown", function(e) {

						if(e.button === 0) { // left-mouse button

							console.log("Position:\n.x = " + (window.myEngine.Camera.x + e.x) + ";\n.y = " + e.y + ";");
						}

						if(e.button !== 2) 
							return;

						x1 = e.x;
						y1 = e.y;

						var mousemove = function(e) {
							dist_x = x1 - e.x;
							dist_y = y1 - e.y;

							var handle = objects.getByName("char");
							handle.x -= dist_x;
							handle.y -= dist_y;

							x1 = e.x;
							y1 = e.y;
						};

						window.addEventListener("mousemove", mousemove);

						window.addEventListener("mouseup", function(e) {

							if(e.button !== 2)
								return;

							window.removeEventListener("mousemove", mousemove);

						});
					});
				}


				//***  Objekte ***//
				var objects = new EngineObjectList();

				var height_modifier = 1100; //4666 + 1600;

				var bg = new ObjectBackgroundHorizon();
				bg.x = 0;
				bg.y = window.cfg.level_height - (256-12) - 64 - 12 - 238 - 228 - 256 - height_modifier;
				bg.width = window.cfg.screen_width;
				bg.scroll = 0.95;
				objects.add(bg);

				var bg = new ObjectBackgroundAngelIsland();
				bg.x = 520;
				bg.y = window.cfg.level_height - (256-12) - 64 - 12 - 238 - 98 - 128 - height_modifier;
				bg.width = window.cfg.screen_width;
				bg.scroll = 0.9;
				objects.add(bg);
				
				var bg = new ObjectBackgroundSea();
				bg.x = 0;
				bg.y = window.cfg.level_height - (256-12) - 64 - 12 - 238 - height_modifier;
				bg.width = window.cfg.screen_width;
				bg.scroll = 0.9;
				objects.add(bg);

				var mountains = new ObjectBackgroundMeadowMountains();
				mountains.x = 0;
				mountains.y = window.cfg.level_height - (256-12) - 64 - 12 - height_modifier;
				mountains.width = window.cfg.screen_width;
				mountains.scroll = 0.5;
				objects.add(mountains);

				var meado2 = new ObjectBackgroundMeadow2();
				meado2.x = 0;
				meado2.y = window.cfg.level_height - (256-12) - 30 - height_modifier;
				meado2.width = window.cfg.screen_width;
				meado2.scroll = 0.4;
				objects.add(meado2);

				var meadow = new ObjectBackgroundBlankGreen();
				meadow.x = 0;
				meadow.y = window.cfg.level_height - 96 + 510 - height_modifier;
				meadow.width = window.cfg.screen_width;
				meadow.scroll = 0.2;
				objects.add(meadow);

				var meadow = new ObjectBackgroundBlankGreen();
				meadow.x = 0;
				meadow.y = window.cfg.level_height - 96 + 1020 - height_modifier;
				meadow.width = window.cfg.screen_width;
				meadow.scroll = 0.2;
				objects.add(meadow);
				
				var meadow = new ObjectBackgroundBlankGreen();
				meadow.x = 0;
				meadow.y = window.cfg.level_height - 96 + 1520 - height_modifier;
				meadow.width = window.cfg.screen_width;
				meadow.scroll = 0.2;
				objects.add(meadow);

				var forrest = new ObjectBackgroundForrest();
				forrest.x = 0;
				forrest.y = window.cfg.level_height - 96 - height_modifier;	
				forrest.width = window.cfg.screen_width;
				forrest.scroll = 0.2;
				objects.add(forrest);

				var meadow = new ObjectBackgroundMeadow();
				meadow.x = 0;
				meadow.y = window.cfg.level_height - (256- 12) - height_modifier;
				meadow.width = window.cfg.screen_width;
				meadow.scroll = 0.3;
				objects.add(meadow);

				var meadow = new ObjectBackgroundGrass4();
				meadow.x = 0;
				meadow.y = window.cfg.level_height - 190 - 12 - 22 - height_modifier;
				meadow.width = window.cfg.screen_width;
				meadow.scroll = 0.2;
				objects.add(meadow);

				var tree1 = new ObjectBackgroundTree();
				tree1.x = 10 + 3 * 624;
				tree1.y = window.cfg.level_height - 190 - 320 - height_modifier;
				tree1.y -= 256 - 12;
				tree1.z_index = 0;
				objects.add(tree1);

				for(var x=0; x < 3; x++) {
					var block1 = new ObjectBlock();
					block1.solid = true;
					block1.sm.changeState( block1.Chill(), block1 );
					block1.x = 900 + x*900;
					block1.y = window.cfg.level_height - 190 - 256 + 12 - height_modifier;
					block1.initSensors();
					objects.add(block1);
				}

			

				for(var x=0; x < 5; x++) {
					var tree1 = new ObjectBackgroundTree();
					tree1.x = 50 + x * 624;
					tree1.y = window.cfg.level_height - 190 - 320 - height_modifier;
					if(x !== 3) {
						objects.add(tree1);
					}
				}



				




				var sonic = new ObjectChar();
				sonic.player_1 = true;
				sonic.assigned_keys = new Array(37, 39, 40, 32, 38); // links, rechts, unten, space, oben
				sonic.solid = true;
				sonic.x = round(window.cfg.level_width / 2 - 800);
				sonic.x = 347;
				sonic.y = window.cfg.level_height - 256 - height_modifier;

				// set Camera to center Sonic
				window.myEngine.Camera.xScroll = 0;
				window.myEngine.Camera.yScroll = sonic.y;

				sonic.sm.changeState( new sonic.Stand(), sonic);
				sonic.initSensors();
				objects.add(sonic);

				// var beatnik = new ObjectBeatnik();
				// beatnik.solid = true;
				// beatnik.sm.changeState( beatnik.Beat(), beatnik);
				// beatnik.x = 600;
				// beatnik.y = window.cfg.level_height - 256;
				// beatnik.initSensors();
				// objects.add(beatnik);

				// var beatnik = new ObjectBeatnik();
				// beatnik.solid = true;
				// beatnik.sm.changeState( beatnik.Beat(), beatnik);
				// beatnik.x = 1200;
				// beatnik.y = window.cfg.level_height - 256;
				// beatnik.initSensors();
				// objects.add(beatnik);

				// var beatnik = new ObjectBeatnik();
				// beatnik.solid = true;
				// beatnik.sm.changeState( beatnik.Beat(), beatnik);
				// beatnik.x = 1800;
				// beatnik.y = window.cfg.level_height - 256;
				// beatnik.initSensors();
				// objects.add(beatnik);

				// var beatnik = new ObjectBeatnik();
				// beatnik.solid = true;
				// beatnik.sm.changeState( beatnik.Beat(), beatnik);
				// beatnik.x = 2400;
				// beatnik.y = window.cfg.level_height - 256;
				// beatnik.initSensors();
				// objects.add(beatnik);

				// var beatnik = new ObjectBeatnik();
				// beatnik.solid = true;
				// beatnik.sm.changeState( beatnik.Beat(), beatnik);
				// beatnik.x = 3000;
				// beatnik.y = window.cfg.level_height - 256;
				// beatnik.initSensors();
				// objects.add(beatnik);
				 

				var foo;
				var foo2;
				for(var i=0; i<12; i++) {

					var ground = new ObjectGround();
					ground.solid = true;
					ground.sm.changeState( ground.Chill(), ground );
					// TODO: use ground.x_offset insteaad of const 256
					ground.x = 256 * i;	
					// TODO: use ground.y_offset instead of const 190
					ground.y = window.cfg.level_height - height_modifier - 190;
					ground.initSensors();
					objects.add(ground);
				}

				var z=0;
				for(z; z < 3; z++) {
					var block1 = new ObjectHillDown();
					block1.solid = true;
					block1.sm.changeState( block1.Chill(), block1 );
					block1.x = 256*i + z*512;
					foo = block1.x;
					// TODO 251 in ObjectHillDown.y_offset = 251;
					block1.y = window.cfg.level_height - 190 + z*251 - height_modifier; 
					foo2 = block1.y;
					block1.initSensors();
					objects.add(block1);

				}


				for(var z=0; z < 3; z++) {
					var block1 = new ObjectSlope();
					block1.solid = true;
					block1.sm.changeState( block1.Chill(), block1 );
					// block1.x = 256 * i + z*512 + 256 + z*896;
					block1.x = foo + 512 + z*896;
					block1.y = foo2 + 256 + z*512; 
					// block1.x = foo + 256 + 5*512;
					// block1.y = window.cfg.level_height - 190 + 5*244;
					block1.initSensors();
					objects.add(block1);
				}


				for(var x=0; x < 5; x++) {

					for(var y=0; y < 3; y++) {
						var ring = new ObjectRing();
						ring.solid = true;
						ring.sm.changeState( ring.Chill(), ring );
						ring.x = 450 + x*900 + 64 + y*48;
						ring.y = window.cfg.level_height - 256 - height_modifier; 
						ring.initSensors();
						objects.add(ring);
					}

					for(var y=0; y < 3; y++) {
						var ring = new ObjectRing();
						ring.solid = true;
						ring.sm.changeState( ring.Chill(), ring );
						ring.x = 900 + x*900 + 64 + y*48;
						ring.y = window.cfg.level_height - 190 - 256 - 128 - height_modifier; 
						ring.initSensors();
						objects.add(ring);
					}

				}

				objects.each(function(handle) {
					handle.y -= 692;
					if(handle.solid === true)
						handle.initSensors();
				});

				setInterval('window.myEngine.loop()', window.myEngine.get_interval());
				
			});
				
		</script>
		
		<title>2D Game Engine – Demo</title>
	</head>

	<body oncontextmenu="return false;">
		<div id="fps"></div>
		<div id="debug"></div>
		<canvas id="canvas_1"></canvas>
		<canvas id="canvas_2"></canvas>
	</body>
	
</html>
