"use strict";
/**
 * Genera el rayo a partir de los parámetros
 * 
 * @param {*} event - Información del vector dirección
 * @param {*} mode - Modalidad del sistema para crear el vector dirección
 * @param {*} near - A partir de qué distancia origen se tiene en cuenta
 * @param {*} far - Hasta que distancia final tiene efecto
 * @returns - RayCast
 */
function getRayCaster (event, mode, near, far) {

	var farRay = far || 1300000;
	var nearRay = near || 0;
	var start;
	var directionVector = new THREE.Vector3();

	if (!mode) {
		var getRayCam = getRayCaster_EventCam(event, farRay);
		start = getRayCam[0];
		directionVector = getRayCam[1];
	} else if (mode == 'point-point') {
		start = event[0];
		var end = new THREE.Vector3().copy(event[1]);

		directionVector.subVectors(end, start);
	} else if (mode == 'point-camera') {
		start = event[0];
		//directionVector = new THREE.Vector3();

		TR3.camera.getWorldDirection(directionVector);
	} else if (mode == 'point-vector') {
		start = event[0];
		directionVector.copy(event[1]);
	}

	var raycasterRtrn = new THREE.Raycaster(start, directionVector.normalize(), nearRay, farRay);
	return raycasterRtrn;

	function getRayCaster_EventCam(event) {

		var contDiv = TR3sto.container;
		var contTop = contDiv.offsetTop;
		var contLeft = contDiv.offsetLeft;
		while (contDiv.parentElement) {
			contDiv = contDiv.parentElement;
			contTop += contDiv.offsetTop;
			contLeft += contDiv.offsetLeft;
		}

		//TR3.scene.add( TR3.cursor.helper );
		var evtX;
		var evtY;
		if (event && event.touches && event.touches.length > 0) {
			evtX = event.touches[0].clientX;
			evtY = event.touches[0].clientY;
		} else if (event && event.clientX) {
			evtX = event.clientX;
			evtY = event.clientY;
		} else {
			evtX = contDiv.clientWidth * 0.5
			evtY = contDiv.clientHeight * 0.5
			contLeft = 0;
			contTop = 0;
		}

		var mouseX = ((evtX - contLeft) / renderer.domElement.clientWidth) * 2 - 1;
		var mouseY = -((evtY - contTop) / renderer.domElement.clientHeight) * 2 + 1;

		var vector = new THREE.Vector3(mouseX, mouseY, camera.near);
		vector.unproject(camera);

		var cPos = camera.position;

		//var raycaster = new THREE.Raycaster(cPos, vector.sub(cPos).normalize(),0,farRay);
		//raycaster.firstHitOnly = true;

		return [cPos, vector.sub(cPos)];
	};

};

/**
 * Distintas herramientas y cálculos para realizar operaciones
 * @class tools
 */

/**
 * Sistema para generar un panorama en formato atlas
 * @param {string} atlasImgUrl - ruta a las imágenes para generar el panorama
 * @param {number} tilesNum - numero de imágenes del panorama
 * @returns {object} - Objeto de Textura THREE para aplicar
 */
function getTexturesFromAtlasFile(atlasImgUrl, tilesNum) {

	const textures = [];

	for (let i = 0; i < tilesNum; i++) {

		textures[i] = new THREE.Texture();

	}

	new THREE.ImageLoader()
		.load(atlasImgUrl, (image) => {

			let canvas, context;
			const tileWidth = image.height;

			for (let i = 0; i < textures.length; i++) {

				canvas = document.createElement('canvas');
				context = canvas.getContext('2d');
				canvas.height = tileWidth;
				canvas.width = tileWidth;
				context.drawImage(image, tileWidth * i, 0, tileWidth, tileWidth, 0, 0, tileWidth, tileWidth);
				textures[i].colorSpace = THREE.SRGBColorSpace;
				textures[i].image = canvas;
				textures[i].needsUpdate = true;

			}

		});

	return textures;

};

/**
 * Actualizar la textura de un objeto 3d utilizando una imagen
 * @param {object} objectName - objeto 3d sobre el que se aplicará la imagen
 * @param {string} type - Material que se genera para aplicar al objeto 3d
 * @param {HTMLImageElement} imgConteint - imagen a aplicar como textura al objeto 3d
 * @param {object} extraParams - parámetros extra para las propiedades del material
 * @param {string} idObjet - id del objeto sobre el que se quiere aplicar, si no se aplica a todo
 */
function updateTexture(objectName, type, imgConteint, extraParams, idObjet) {
	var setExtraParams = extraParams || {};

	const texture = new THREE.TextureLoader().load(imgConteint);
	texture.colorSpace = THREE.SRGBColorSpace;
	texture.needsUpdate = true;
	texture.minFilter = THREE.LinearFilter;

	var params = { map: texture };
	jQuery.extend(params, setExtraParams);

	updateMaterial(objectName, type, params, idObjet)
};

/**
 * Actualizar material de un objeto 3d
 * @param {object} objectName - objeto 3d sobre el que se aplicará la textura
 * @param {string} type - Material que se genera para aplicar al objeto 3d
 * @param {object} params - parámetros para las propiedades del material
 * @param {string} idObjet - id del objeto sobre el que se quiere aplicar, si no se aplica a todo
 */
function updateMaterial(objectName, type, params, idObjet) {

	if (params === undefined) params = {};

	const material = new THREE[type](params);

	var object = scene.getObjectByName(objectName);

	if (idObjet) { 
		object.traverse((child) => {
			if (child.material && child.name == idObjet) {
				child.material = material;
			}
		});
	} else {
		object.traverse((child) => {
			if (child.material) {
				child.material = material;
			}
		});
	}

};

/**
 * Aplica el sistema de trandformControls al objeto 3d
 * @param {object} model - objeto 3d sobre el que se aplicará la imagen
 */
function transCtrls(model) {
	control.detach();
	scene.remove(control.getHelper());

	if (typeof (model) == "object") {
		control.attach(model);
		scene.add(control.getHelper());
	}
};
//fin tools.js