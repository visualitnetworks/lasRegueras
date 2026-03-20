	import * as THREE from 'three';
	import { OrbitControls } from '../../TR3-pack64/THREE/controls/OrbitControls.js';
	import { TransformControls } from '../../TR3-pack64/THREE/controls/TransformControls.js';
	import { clone } from '../../TR3-pack64/THREE/utils/SkeletonUtils.js';
	import { GLTFExporter } from '../../TR3-pack64/THREE/exporters/GLTFExporter.js';
	import { GLTFLoader } from '../../TR3-pack64/THREE/loaders/GLTFLoader.js';
	//import { IFCLoader } from '../../TR3-pack64/THREE/loaders/IFCLoader.js';
	import { FontLoader } from '../../TR3-pack64/THREE/loaders/FontLoader.js';
	import { TextGeometry } from '../../TR3-pack64/THREE/geometries/TextGeometry.js';
	import { CSS3DRenderer, CSS3DObject, CSS3DSprite } from '../../TR3-pack64/THREE/renderers/CSS3DRenderer.js';

	import { Sky } from '../../TR3-pack64/THREE/objects/Sky.js';
	import { Lensflare, LensflareElement } from '../../TR3-pack64/THREE/objects/Lensflare.js';

	import { Line2 } from '../../TR3-pack64/THREE/lines/Line2.js';
	import { LineMaterial } from '../../TR3-pack64/THREE/lines/LineMaterial.js';
	import { LineGeometry } from '../../TR3-pack64/THREE/lines/LineGeometry.js';

	//import { FatLinesBatch } from "../../TR3-pack64/THREE/__outliner/FatLinesBatch.js";

	var threeTR3 = new Array();

	threeTR3.THREE = THREE;
	threeTR3.OrbitControls = OrbitControls;
	threeTR3.TransformControls = TransformControls;
	threeTR3.SkeletonUtilsClone = clone;
	//threeTR3.AnaglyphEffect = AnaglyphEffect;
	threeTR3.GLTFExporter = GLTFExporter;
	threeTR3.GLTFLoader = GLTFLoader;
	//threeTR3.IFCLoader = IFCLoader;
	
	threeTR3.FontLoader = FontLoader;
	threeTR3.TextGeometry = TextGeometry;
	threeTR3.CSS3DRenderer = CSS3DRenderer;
	threeTR3.CSS3DObject = CSS3DObject;
	threeTR3.CSS3DSprite = CSS3DSprite;
	threeTR3.Sky = Sky;
	
	threeTR3.Lensflare = Lensflare;
	threeTR3.LensflareElement = LensflareElement;

	threeTR3.Line2 = Line2;
	threeTR3.LineGeometry = LineGeometry;
	threeTR3.LineMaterial = LineMaterial;

	//threeTR3.FatLinesBatch = FatLinesBatch;
	//window.

	//TR3cfg.link;
	TR3cfg.locat;
	//var lookAtINIT = true;
	TR3cfg.fromShare = false;
	TR3cfg.mobile = false;
	TR3cfg.first = true;
	TR3cfg.pause3d = false;
	TR3cfg.posB4 = [0, 0];
	TR3cfg.GeolocTR3 = false;
	TR3cfg.refresWFSbuild = false;
	TR3cfg.vectorLayer;
	TR3cfg.mapSize = 300;
	TR3cfg.extentFix = 100;
	TR3cfg.giraffe = false;
	TR3cfg.lightAndRing = false;
	TR3cfg.IFCmodel = false;

	TR3cfg.preselectMat = new Object()
	TR3cfg.preselectModel = { id: - 1 };
	
	var idi = TR3cfg.languaje;
	TR3cfg.idiomax.make(idi.set, idi.insert, idi.includes);

	//trackChart.create();

	setInterval(function () {
		var li = TR3cfg.lightAndRing;
		if (li) {
			var lii2 = li.children[1];
			lii2.visible = !lii2.visible;
		}

	}, 500);

	setInterval(function () {
		var starField = TR3.scene.getObjectByName("starField");
		if (starField) {
			starField.material.color = new THREE.Color(TR3.getRandomColor(200, 250).hex);
			//starField.visible = !starField.visible;
			starField.rotateX(Math.PI / 8);
		}
	}, 3000);

	TR3.setLoader(formURL.pack, threeTR3);
	$('#tools').html(TR3.setPanel());
	TR3.setOpts({ imgControl: false, autoRotate: true, terrain: true });

	var img = new Image();
	img.crossOrigin = 'Anonymous';
	img.onload = function () {
		var canvas = document.createElement('CANVAS'),
			ctx = canvas.getContext('2d'), dataURL;
		canvas.id = 'imageMap3d';
		canvas.height = img.height;
		canvas.width = img.width;
		ctx.drawImage(img, 0, 0);

		TR3cfg.canvas = canvas;

		const myIntervalstart = setInterval(function () {
			if (TR3.config.src) {
				myStopStart();
				TR3cfg.setTR32();
			}
		}, 100);

		function myStopStart() {
			clearInterval(myIntervalstart);
		}
		//dataURL = canvas.toDataURL(outputFormat);
		//callback(dataURL);
		//canvas = null; 
	};
	img.src = TR3cfg.pathProjDir + 'data/imageMap.jpeg';