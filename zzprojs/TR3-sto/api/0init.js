"use strict";
/**
 * API que resuelve la creación de escenas TerreStudio, 
 * principalmente mediante la librería THREE-js https://threejs.org/
 * @version 1.2.3
 * @author Agustín Costa &lt;acostacima@gmail.com>
 */

/** @global */
const TR3sto = {
	src: '../TR3-sto/',
	renderExtendFn: function () { },

	container: false,
	obj3d: [],
	sprite: [],
	main3d: {},
	tweenTime: 2000,
	effectStereo: false,
	effectAnaglyph: false,

	intervalTransform: 0,
	overInfoTR3sto: false,
	autoStart: true,
	loadMain3dthen: function () { },

	fullscreenContainer: false,
	widthContainer: 600,
	heightContainer: 600,
	leftContainer: null,
	positionContainer: null,

	/*Animations*/
	oscillate: [],
	rotate: [],
	scalate: [],
	rotatePart: [],
	lookAtCamera: [],
	lookAtXY: [],
	lookAtXYfocus: [],
	lookAtZ: [],

	selectables: [],

	mapSize: 1024,
	css3Dover: false,
	autoResize: true,
	mixer: new Array(),
	sizeWrld: 0,
	boxMainObj: new Object,
	camaraInit: false,
	orbitInit: false,
	panel: new Object,
	lights: { ambient: { intensity: 2, color: 0xffffff }, directional: { intensity: 2, color: 0xffffff } },
	floor: { shadow: true, grid: true, floor: true },
	pano: { type: false, src: false, ext: false, ratio: 1 }
};

let THREE = {};

let effect_Agph, effectCSS_Agph, effect_Sro, effectCSS_Sro;

let OrbitControls, TransformControls, AnaglyphEffect, StereoEffect,
	GLTFLoader, DRACOLoader, GLTFExporter, CSS3DRenderer, CSS3DObject, CSS3DSprite, VRButton, XRControllerModelFactory, GUI;

let controller1, controller2;
let controllerGrip1, controllerGrip2;

let camera, orbit, clock, control, scene, renderer, sceneCSS, rendererCSS;

/**
 * Función principal que crea los aspectos generales de la escena
 * @public
 * @param {object} TR3three - Objeto que contiene la librería THREEjs, con sus funciones y métodos necesarios.
 * @param {object} params - Configuración de los aspectos básicos de la escena.
 * @param {string} src - Ruta donde encontrará recursos externos para completar las utilidades ej: '/TR3-sto/'
 * @example
 * TR3sto.init(false, {
			//pano: {type: 'cube', src: './obj3d/panos/cube', name: 'dark-s_', ext: 'jpg'}, 
			GUI: true,
			pano: { type: 'box', src: './obj3d/panos/cube', name: 'brick_', ext: 'jpg', topPos: 'down', ratio: 1 / 2 },
			lights: { ambient: { intensity: 2, color: 0xffffff }, directional: { intensity: 2, color: 0xffffff } },
			floor: { shadow: true, grid: true, floor: true },
			//camaraInit: { "x": 1140.0326200160655, "y": 663.0105837002303, "z": -762.0125519892266 }
		});
 */
TR3sto.init = function (TR3three, params, src) {
	TR3sto.src = src || '../TR3-sto/';
	if (TR3three) {
		THREE = TR3three.THREE;
		OrbitControls = TR3three.OrbitControls;
		AnaglyphEffect = TR3three.AnaglyphEffect;
		StereoEffect = TR3three.StereoEffect;
		TransformControls = TR3three.TransformControls;
		GLTFLoader = TR3three.GLTFLoader;
		DRACOLoader = TR3three.DRACOLoader;
		GLTFExporter = TR3three.GLTFExporter;
		CSS3DRenderer = TR3three.CSS3DRenderer;
		CSS3DObject = TR3three.CSS3DObject;
		CSS3DSprite = TR3three.CSS3DSprite;
		VRButton = TR3three.VRButton;
		XRControllerModelFactory = TR3three.XRControllerModelFactory;
		GUI = TR3three.GUI;
	}
	if (Object.keys(THREE).length === 0) { alert('THREE not detected!'); }

	TR3sto.env = params.hasOwnProperty("env") ?
		params["env"] : false;

	TR3sto.pano = params.hasOwnProperty("pano") ?
		params["pano"] : { type: false, src: false, ext: false };

	TR3sto.lights = params.hasOwnProperty("lights") ?
		params["lights"] : { ambient: { intensity: 2, color: 0xffffff }, directional: { intensity: 2, color: 0xffffff } };

	TR3sto.floor = params.hasOwnProperty("floor") ?
		params["floor"] : { shadow: true, grid: true, floor: true };

	TR3sto.camaraInit = params.hasOwnProperty("camaraInit") ?
		params["camaraInit"] : false;

	const GUIparam = params.hasOwnProperty("GUI") ?
		params["GUI"] : false;

	const maxPolarAngle = params.hasOwnProperty("maxPolarAngle") ?
		params["maxPolarAngle"] : Math.PI / 2;

	const loadingImage = params.hasOwnProperty("loadingImage") ?
		params["loadingImage"] : false;

	const container = document.getElementById('container');
	container.classList.add("TR3sto");

	//container.innerHTML = '';

	const heightContainer = parseInt(container.style.height);
	const widthContainer = parseInt(container.style.width);
	TR3sto.widthContainer = widthContainer;
	TR3sto.heightContainer = heightContainer;

	camera = new THREE.PerspectiveCamera(60, widthContainer / heightContainer, 0.1, 2000);

	scene = new THREE.Scene();
	scene.background = new THREE.Color(0x000000);

	//this.tmpPos = new THREE.Vector3();
	//this.tmpDir = new THREE.Vector3();

	const camTrain = new THREE.Group();
	const coin = new THREE.Object3D();
	coin.name = 'camTrain';
	//coin.visible = false;
	camTrain.add(coin);

	TR3sto.camTrain = camTrain;
	TR3sto.coin = coin;
	//VR mode
	//scene.add( TR3sto.camTrain );
	//TR3sto.coin.add( camera );

	clock = new THREE.Clock();

	rendererCSS = new CSS3DRenderer();
	rendererCSS.domElement.id = 'rendererCSS';
	rendererCSS.setSize(widthContainer, heightContainer);
	container.appendChild(rendererCSS.domElement);

	sceneCSS = new THREE.Scene();
	scene.background = new THREE.Color(0xeeeeee);
	effectCSS_Sro = new StereoEffect(rendererCSS);
	effectCSS_Sro.setSize(widthContainer, heightContainer);

	effectCSS_Agph = new AnaglyphEffect(rendererCSS);
	//effectCSS_Agph.setSize(widthContainer, heightContainer);

	renderer = new THREE.WebGLRenderer({
		antialias: true
		//powerPreference: "low-performance",
		//alpha: false,
		//antialias: false,
		//stencil: false,
		//depth: false
	});
	renderer.shadowMap.enabled = true;
	//renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

	renderer.setPixelRatio(window.devicePixelRatio);

	//renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(widthContainer, heightContainer);
	renderer.setAnimationLoop(animate);
	//When user turn on the VR mode.
	renderer.xr.addEventListener('sessionstart', function () {
		scene.add(TR3sto.camTrain);
		TR3sto.coin.add(camera);

		addControllers2scene();
	});
	//When user turn off the VR mode.
	renderer.xr.addEventListener('sessionend', function () {
		scene.remove(TR3sto.camTrain);
		TR3sto.coin.remove(camera);
	});
	container.appendChild(renderer.domElement);

	const vrBtn = VRButton.createButton(renderer)
	vrBtn.id = 'VRButton'; // firefox safari
	container.appendChild(vrBtn);
	vrBtn.addEventListener('click', (ev) => {
		if (ev.target.innerText.toUpperCase().indexOf('NOT') > -1) {
			renderer.xr.enabled = false;
		} else {
			camera.near = 0.01;
			renderer.xr.enabled = true;
			renderer.xr.setReferenceSpaceType('local');
		}
	});

	var htmlAlert = '\
		<div class="alert-box">\
        	<span id="alertMessage">\
			</span>\
        	<button id="yesButton">Yes</button>\
       	 	<button id="noButton">No</button>\
    	</div>';
	var divAlert = document.createElement("div");
	divAlert.id = "customAlert";
	divAlert.className = "alert-container";
	divAlert.innerHTML = htmlAlert;
	container.appendChild(divAlert);

	effect_Sro = new StereoEffect(renderer);
	effect_Sro.setSize(widthContainer, heightContainer);

	effect_Agph = new AnaglyphEffect(renderer);
	effect_Agph.setSize(widthContainer, heightContainer);

	const initImgTR3sro = document.createElement('img');
	initImgTR3sro.id = 'initImgTR3sro';
	initImgTR3sro.style.display = 'none';
	if (loadingImage) {
		initImgTR3sro.src = loadingImage;
		initImgTR3sro.style.width = widthContainer / 1.1 + 'px';
		initImgTR3sro.style.top = (widthContainer - widthContainer / 1.1) / 2 - 3/*css border*/ + 'px';
		initImgTR3sro.style.left = (widthContainer - widthContainer / 1.1) / 2 - 3/*css border*/ + 'px';
		initImgTR3sro.style.display = 'block';
		initImgTR3sro.style.zIndex = '999';
	}
	container.appendChild(initImgTR3sro);

	const progressBar = document.createElement('progress');
	progressBar.id = 'progress-bar';
	progressBar.setAttribute('value', 0);
	progressBar.setAttribute('max', 100);
	progressBar.setAttribute('data-label', "0% Complete");

	const spanBar = document.createElement('span');
	spanBar.setAttribute('class', "value");
	progressBar.appendChild(spanBar);
	container.appendChild(progressBar);

	const infoTR3sro = document.createElement('code');
	infoTR3sro.id = 'infoTR3sro';
	container.appendChild(infoTR3sro);

	infoTR3sro.addEventListener('mouseover', (ev) => {
		TR3sto.overInfoTR3sto = true;
	});
	infoTR3sro.addEventListener('mouseout', (ev) => {
		TR3sto.overInfoTR3sto = false;
	});

	const autoStartBtn = document.createElement('button');
	autoStartBtn.id = 'autoStartBtn';
	autoStartBtn.innerHTML = 'Set 3dStudio'
	autoStartBtn.setAttribute('style', "\
    		position: absolute;\
    		bottom: 25px;\
    		left: 50%;\
    		transform: translate(-50%, 0%);\
    		padding: 6px 6px;\
    		background: rgba(0, 0, 0, 0.1);\
    		color: gray;\
    		border: solid 2px gray;\
   			border-radius: 5px; z-index: 999");
	container.appendChild(autoStartBtn);

	orbit = new OrbitControls(camera, rendererCSS.domElement);
	orbit.enableDamping = true;
	orbit.dampingFactor = 0.1;
	orbit.autoRotateSpeed = 1;
	orbit.maxPolarAngle = maxPolarAngle;
	orbit.addEventListener('start', function (event) { orbit.autoRotate = false; });

	control = new TransformControls(camera, rendererCSS.domElement);
	control.addEventListener('dragging-changed', function (event) {
		orbit.enabled = !event.value;
	});

	const panel = new GUI({ autoPlace: false, width: 200 });
	panel.domElement.id = 'gui';
	panel.domElement.style.maxHeight = window.screen.availHeight * 0.8 + 'px';
	container.appendChild(panel.domElement);
	TR3sto.setGUI(panel);
	if (!GUIparam) { panel.domElement.style.display = 'none'; }

	container.addEventListener('click', click_Obj3d, false);

	container.addEventListener("dblclick", (e) => {

		var raycaster = getRayCaster(e);
		const intersects = raycaster.intersectObject(TR3sto.main3d, true);
		var tgt = new THREE.Vector3(0, 0, 0);
		// Toggle rotation bool for meshes that we clicked
		if (intersects.length > 0) {
			tgt.copy(intersects[0].point);
		}

		new TWEEN.Tween(orbit.target) // Create a new tween that modifies 'coords'.
			.to({ x: tgt.x, y: tgt.y, z: tgt.z }, TR3sto.tweenTime / 2)
			.easing(TWEEN.Easing.Quadratic.InOut) // Use an easing function to make the animation smooth.
			/*.onUpdate(() => {
				orbit.target.set(0, 0, 0);
				orbit.update();
			})*/
			.onComplete(() => {
				orbit.update();
				//orbit.autoRotate = true;
			})
			.start() // Start the tween immediately.

	});

	var textarea = document.createElement("textarea");
	textarea.id = "registMoveCineCam";
	textarea.rows = "5";

	TR3sto.panel.addGuiCinematics.domElement.childNodes[1].replaceWith(textarea);

	function intersectEvClick(intsct) {
		// Create the event
		var event = new CustomEvent("TR3-onIntersectEvClick", { detail: intsct });
		// Dispatch/Trigger/Fire the event
		container.dispatchEvent(event);
	};
	TR3sto.intersectEvClick = intersectEvClick;
	TR3sto.container = container;
};

/**
 * Sistema de mensajes al usuario para
 * ser informado y tomar algunas decisiones mediante diálogo
 * 
* @param {string} message - mensaje a enviar al usuario
* @param {callback} callback - manejo de la acción del usuario respecto del diálogo
 */
function showCustomAlert(message, callback) {
	const alertContainer = document.getElementById('customAlert');
	const alertMessage = document.getElementById('alertMessage');
	const yesButton = document.getElementById('yesButton');
	const noButton = document.getElementById('noButton');

	alertMessage.innerHTML = message;
	alertContainer.style.display = 'flex';

	yesButton.onclick = function () {
		alertContainer.style.display = 'none';
		callback(true);
	};

	noButton.onclick = function () {
		alertContainer.style.display = 'none';
		callback(false);
	};
};

function addControllers2scene() {
	// add controllers to the scene
	controller1 = renderer.xr.getController(0);
	controller1.addEventListener('selectstart', onSelectStart1);
	controller1.addEventListener('selectend', onSelectEnd1);
	controller1.addEventListener('connected', function (event) {
		this.add(buildController(event.data));
	});

	controller1.addEventListener('disconnected', function () {
		this.remove(this.children[0]);
	});
	TR3sto.coin.add(controller1);

	controller2 = renderer.xr.getController(1);
	controller2.addEventListener('selectstart', onSelectStart2);
	controller2.addEventListener('selectend', onSelectEnd2);
	controller2.addEventListener('connected', function (event) {
		this.add(buildController(event.data));
	});

	controller2.addEventListener('disconnected', function () {
		this.remove(this.children[0]);
	});
	TR3sto.coin.add(controller2);

	const controllerModelFactory = new XRControllerModelFactory();

	controllerGrip1 = renderer.xr.getControllerGrip(0);
	controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1));
	controllerGrip1.addEventListener("connected", (e) => {
		infoTR3sro.style.display = 'block';
		infoTR3sro.innerHTML = e.data.gamepad;
	})
	TR3sto.coin.add(controllerGrip1);

	controllerGrip2 = renderer.xr.getControllerGrip(1);
	controllerGrip2.add(controllerModelFactory.createControllerModel(controllerGrip2));
	TR3sto.coin.add(controllerGrip2);
};

function buildController(data) {

	let geometry, material;

	/*marker = new THREE.Mesh(
		new THREE.CircleGeometry(0.25, 32).rotateX(- Math.PI / 2),
		new THREE.MeshBasicMaterial({ color: 0xbcbcbc })
	);
	scene.add(marker);*/

	geometry = new THREE.BufferGeometry();
	geometry.setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, - 5)]);
	material = new THREE.LineBasicMaterial({ color: 0xffffff });

	return new THREE.Line(geometry, material);
}

TR3sto.speed = .01*1;
TR3sto.speedPlus = TR3sto.speed/50;
TR3sto.sign = 1;
function onSelectStart1(event) {
	TR3sto.sign = 1;
	this.userData.isSelecting = true;
	this.children[0].material.color.set(0x0000ff);
}

function onSelectEnd1(event) {
	this.userData.isSelecting = false;
	this.children[0].material.color.set(0xffffff);
}

function onSelectStart2(event) {
	TR3sto.sign = -1;
	this.userData.isSelecting = true;
	this.children[0].material.color.set(0xffff00);
}

function onSelectEnd2(event) {
	this.userData.isSelecting = false;
	this.children[0].material.color.set(0xffffff);
}

var camTrain = false;
function slctControllerStart() {
}

function slctControllerEnd() {
}
//fin 0init.js