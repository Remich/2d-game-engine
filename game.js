
import * as Helpers from './library.inc.js'
import * as QuadTree from './lib/QuadTree.js'
import { Point } from './Point.class.js';
import { EngineStateMachine } from './EngineStateMachine.class.js';
import { EngineObjectList } from './EngineObjectList.class.js'
import { Camera } from './EngineCamera.class.js';
import { EngineSensor } from './EngineSensor.class.js';
import { SensorGround } from './SensorGround.class.js'
import { SensorFloor } from './SensorFloor.class.js'
import { SensorObject } from './SensorObject.class.js'
import { GameObject } from './Object.class.js'
import { ObjectStatic } from './ObjectStatic.class.js'
import { ObjectWithInput } from './ObjectWithInput.class.js'
import { ObjectChar } from './ObjectChar.class.js'
import { ObjectBackgroundHorizon } from './ObjectBackgroundHorizon.class.js'
import { ObjectBackgroundSea } from './ObjectBackgroundSea.class.js'
import { ObjectBackgroundAngelIsland } from './ObjectBackgroundAngelIsland.class.js'
import { ObjectBackgroundMeadowMountains } from './ObjectBackgroundMeadowMountains.class.js'
import { ObjectBackgroundMeadow2 } from './ObjectBackgroundMeadow2.class.js'
import { ObjectBackgroundBlankGreen } from './ObjectBackgroundBlankGreen.class.js'
import { ObjectBackgroundForrest } from './ObjectBackgroundForrest.class.js'
import { ObjectBackgroundMeadow } from './ObjectBackgroundMeadow.class.js'
import { ObjectBackgroundGrass4 } from './ObjectBackgroundGrass4.class.js'
import { ObjectBackgroundTree } from './ObjectBackgroundTree.class.js'
import { ObjectBackgroundWall } from './ObjectBackgroundWall.class.js'
import { ObjectBlock } from './ObjectBlock.class.js'
import { ObjectGround } from './ObjectGround.class.js'
import { ObjectBeatnik } from './ObjectBeatnik.class.js'
import { ObjectRing } from './ObjectRing.class.js'
import { ObjectExplosion } from './ObjectExplosion.class.js'


import { Engine } from './Engine.class.js'

window.cfg = new Object();

window.cfg.screen_width;
window.cfg.screen_height;

window.cfg.last_time = new Date().getTime();
window.cfg.elapsed_time;

window.myEngine = new Engine();
window.myEngine.objects = new EngineObjectList();

/*
 * Objekte aus JSON file laden
 */

var list = window.myEngine.objects
var objects = list

$.getJSON('./sonic-angelisland.json', function(obj) {

	for (var a in obj) {

		// instantiate new object
		var handle = obj[a]
		var tmp = eval(handle.bootstrap)

		// assign additional attributes to the dynamic game object
		for(var p in handle) {
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

