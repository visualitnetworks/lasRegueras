"use strict";
/**
 * Zona que maneja distintos eventos para aplicar funcionalidad a la escena 3D
 * y mayor interactividad.
 * @class events
 */

/**
 * Manejo del evento de pulsación de teclas y la afectación a la escena.
 * @param {event} keydown - manejo del evento al pulsar teclas
 * @param {function} - implicito
 */
window.addEventListener('keydown', function (event) {

	switch (event.key) {

		case 'q':
			control.setSpace(control.space === 'local' ? 'world' : 'local');
			break;

		case 'p':
			const pointer = new THREE.Vector2(0, 0);
			pointer.x = (event.clientX || 0 / renderer.domElement.clientWidth) * 2 - 1;
			pointer.y = - (event.clientY || 0 / renderer.domElement.clientHeight) * 2 + 1;

			const raycaster = new THREE.Raycaster();
			raycaster.setFromCamera(pointer, camera);
			// See if the ray from the camera into the world hits one of our meshes

			const intersects = raycaster.intersectObject(scene.getObjectByName('skyMesh'), true);
			// Toggle rotation bool for meshes that we clicked
			if (intersects.length > 0) {
				orbit.target.copy(intersects[0].point);
			}else{
				orbit.target.set(0,0,0);
			}
			console.log(intersects);
			break;

		case 'º':
			TR3sto.downloadCanvasAsImage();
			break;

		case 'Shift':
			control.setTranslationSnap(1);
			control.setRotationSnap(THREE.MathUtils.degToRad(15));
			control.setScaleSnap(0.25);
			break;

		case 'w':
			control.setMode('translate');
			break;

		case 'e':
			control.setMode('rotate');
			break;

		case 'r':
			control.setMode('scale');
			break;

		case 'c':
			/*const position = currentCamera.position.clone();

			currentCamera = currentCamera.isPerspectiveCamera ? cameraOrtho : cameraPersp;
			currentCamera.position.copy(position);

			orbit.object = currentCamera;
			control.camera = currentCamera;

			currentCamera.lookAt(orbit.target.x, orbit.target.y, orbit.target.z);
			onWindowResize();*/
			break;

		case 'v':
			/*const randomFoV = Math.random() + 0.1;
			const randomZoom = Math.random() + 0.1;

			cameraPersp.fov = randomFoV * 160;
			cameraOrtho.bottom = - randomFoV * 500;
			cameraOrtho.top = randomFoV * 500;

			cameraPersp.zoom = randomZoom * 5;
			cameraOrtho.zoom = randomZoom * 5;
			onWindowResize();*/
			break;

		case '+':

		case '=':
			control.setSize(control.size + 0.1);
			break;

		case '-':
			const cont = {
				w: parseInt(container.style.width) / 2,
				h: parseInt(container.style.height) / 2
			};
			renderer.setSize(cont.w, cont.h);
			rendererCSS.setSize(cont.w, cont.h);

		case '_':
			control.setSize(Math.max(control.size - 0.1, 0.1));
			break;

		case 'x':
			control.showX = !control.showX;
			break;

		case 'y':
			control.showY = !control.showY;
			break;

		case 'z':
			control.showZ = !control.showZ;
			break;

		case ' ':
			control.enabled = !control.enabled;
			break;

		case 'Escape':
			control.reset();
			break;

		case '0':
			TR3sto.panel.addGuiCinematicsTools.controllers[0].object.ClearGUI();
			break;

		case '0':
			TR3sto.panel.addGuiCinematicsTools.controllers[5].object.PlayCinema();
			break;

	}

});

/**
 * Manejo del evento de dejar de pulsar coordinado con el de haber pulsado la tecla.
 * @param {event} keyup - manejo del evento al pulsar teclas
 * @param {function} - implicito
 */
window.addEventListener('keyup', function (event) {

	switch (event.key) {

		case 'Shift':
			control.setTranslationSnap(null);
			control.setRotationSnap(null);
			control.setScaleSnap(null);
			break;

	}

});

/**
 * Manejo del evento de soltar algo sobre la ventana web, manejado por 3 eventos.
 * @param {event} - dragover drop dragleave
 * @param {function} - implicito
 */
container.addEventListener('dragover', (e) => {
	e.preventDefault()
	console.log('dragover');
});

container.addEventListener('drop', (e) => {
	e.preventDefault()
	const file = e.dataTransfer.files[0];
	if (file) {
		clearScene();
		TR3sto.sourceFile = { blob: (window.URL || window.webkitURL).createObjectURL(file), src: file.name }

		TR3sto.init(false, {
			//pano: {type: 'cube', src: './obj3d/panos/cube', name: 'dark-s_', ext: 'jpg'}, 
			GUI: true,
			pano: { type: 'box', src: './obj3d/panos/cube', name: 'brick_', ext: 'jpg', topPos: 'down', ratio: 1 / 2 },
			lights: { ambient: { intensity: 2, color: 0xffffff }, directional: { intensity: 2, color: 0xffffff } },
			floor: { shadow: true, grid: true, floor: true },
			//camaraInit: { "x": 1140.0326200160655, "y": 663.0105837002303, "z": -762.0125519892266 }
		});

		TR3sto.loadMain3d(TR3sto.sourceFile.blob, { pos: 'center', castShadow: true/*, scale: new THREE.Vector3(100,100,100)*/ }).then(function (mainMesh) {
			//TR3sto.pano = { type: 'box', src: './obj3d/panos/cube', name: 'brick_', ext: 'jpg', topPos: 'down' };
			//updateTexture('planeFloor', 'MeshPhongMaterial', './obj3d/panos/cube/brick_py.jpg');
		});
	}

});

/*container.addEventListener('mousemove', (e) => {
	TR3sto.cursorEvent = e;
});*/

container.addEventListener('dragleave', (e) => {
	console.log('dragleave');
});
/**
 * 
 * Al manejar el tamaño de la ventana del navegador se adapta
 * y completa el espacio previsto para la escena 3d.
 * @param {event} resize - redimensionamiento del navegador
 * @param {function} - implicito
 */
window.addEventListener('resize', () => {
	setFullScreen();
});

function setFullScreen() {
	if (TR3sto.fullscreenContainer == true) {
		if (!TR3sto.topContainer) {
			TR3sto.topContainer = container.style.top;
			TR3sto.leftContainer = container.style.left;
			TR3sto.positionContainer = container.style.position;
			TR3sto.zIndexContainer = container.style.zIndex;
			TR3sto.transformContainer = container.style.transform;
		}

		container.style.top = '7px';
		container.style.left = '7px';
		//container.style.position = 'fixed';
		container.style.height = window.innerHeight - 14 + 'px';
		container.style.width = window.innerWidth - 14 + 'px';
		//container.style.zIndex = '9999';
		container.style.transform = null;

		const cont = { w: parseInt(container.style.width), h: parseInt(container.style.height) };

		camera.aspect = cont.w / cont.h;
		camera.updateProjectionMatrix();

		renderer.setSize(cont.w, cont.h);
		rendererCSS.setSize(cont.w, cont.h);
	}
};

function isFullScreen() {
	/*let full = false;
	if (document.fullscreenElement != null || document.webkitFullscreenElement != null || window.innerHeight == screen.height || 1 >= window.outerHeight - window.innerHeight) {
		full = true;
	}*/
	return TR3sto.fullscreenContainer;
};
//fin events.js