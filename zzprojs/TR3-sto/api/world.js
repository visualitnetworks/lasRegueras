"use strict";
/**
 * Distintas herramientas y cálculos para realizar operaciones
 * @class world
 */

/**
 * Crea todos los elementos de la escena general respecto al tamaño dado
 * @param {number} radiusObj - Tamaño dado como referencia
 */
function createWorld(radiusObj) {
	const rad = radiusObj * 12;
	TR3sto.sizeWrld = rad;

	if (TR3sto.env) {
		const env = TR3sto.env;
		const path = env.path;
		const format = '.' + env.ext;
		const urls = [
			path + 'px' + format, path + 'nx' + format,
			path + 'py' + format, path + 'ny' + format,
			path + 'pz' + format, path + 'nz' + format
		];

		TR3sto.reflectionCube = new THREE.CubeTextureLoader().load(urls);

		scene.environment = TR3sto.reflectionCube;
	}
	
	setSky(TR3sto.pano.type);
	createFloor();
	createLights();
	
	//test de rendimiento
	managePerform(7);
	setTimeout(() => {
		TR3sto.arrayPerform = new Array();
		managePerform(3);
	}, 15000);
};

/**
 * Creación del sistema de luces general de la escena, 
 * una ambiente y otra direccional apuntando al origen con función de sombra (shadow)
 */
function createLights() {
	const rad = TR3sto.sizeWrld;
	const ambient = TR3sto.lights.ambient;
	const light = new THREE.AmbientLight(ambient.color, ambient.intensity*1.5); // soft white light
	light.name = 'AmbientLight';
	scene.add(light);

	const directional = TR3sto.lights.directional;
	const light2 = new THREE.DirectionalLight(directional.color, directional.intensity);
	light2.name = 'DirectionalLight';
	
	if(!directional.pos)
		light2.position.set(rad / 4, rad / 3, rad / 4);
	else
		light2.position.copy( directional.pos );

	light2.target.position.set(0, 0, 0);

	light2.castShadow = true;
	//Set up shadow properties for the light
	light2.shadow.mapSize.width = TR3sto.mapSize; // default
	light2.shadow.mapSize.height = TR3sto.mapSize; // default
	//light2.shadow.camera.near = 0.5; // default
	light2.shadow.camera.far = rad / 3 * 4; // default
	light2.shadow.radius = .7;
	light2.shadow.blurSamples = 6;

	light2.shadow.camera.left = -rad*1.3;
	light2.shadow.camera.right = rad*1.3;
	light2.shadow.camera.top = rad*1.3;
	light2.shadow.camera.bottom = -rad*1.3;

	light2.TR3 = { onlyInGoodRender: true };
	light2.visible = false;
	scene.add(light2);

	/*const light2help = new THREE.CameraHelper(light2.shadow.camera);
	scene.add(light2help);*/
};

/**
 * crea un suelo para el objeto, con material de sombra, otro de regilla y otro básico con color
 */
function createFloor() {
	const rad = TR3sto.sizeWrld;
	const floor = TR3sto.floor;
	const circleSize = rad / 3;

	const circleGeometry = new THREE.CircleGeometry(circleSize, 32);
	circleGeometry.rotateX(- Math.PI / 2);

	/*const planeMaterial = new THREE.ShadowMaterial({ color: 0x000000, side: THREE.DoubleSide });

	/*const planeShadow = new THREE.Mesh(circleGeometry, planeMaterial);
	planeShadow.name = 'planeShadow';
	planeShadow.visible = floor.shadow;
	planeShadow.position.y = +TR3sto.skyMesh.TR3.hitbox.y/1000;
	planeShadow.receiveShadow = true;

	scene.add(planeShadow);*/

	const planeMaterialFloor = new THREE.MeshBasicMaterial({ color: 0xcccccc, side: THREE.DoubleSide });
	planeMaterialFloor.opacity = 0.9;
	planeMaterialFloor.transparent = true;

	const planeFloor = new THREE.Mesh(circleGeometry, planeMaterialFloor);
	planeFloor.name = 'planeFloor';
	planeFloor.visible = floor.floor;
	planeFloor.position.y = -TR3sto.skyMesh.TR3.hitbox.y/1000;/*TR3sto offset*/
	scene.add(planeFloor);

	const GridHelper = new THREE.GridHelper(rad, 70);
	GridHelper.name = 'planeGrid';
	GridHelper.visible = floor.grid;
	//helper.position.y = - 199;
	GridHelper.material.side = THREE.DoubleSide;
	GridHelper.material.opacity = 0.25;
	GridHelper.material.transparent = true;
	scene.add(GridHelper);

};

/**
 * Crea el entorno exterior de la escena, pudiendo usar distintos tipos de panoramas
 * @param {string} type - tipo de panorama que se va a emplear
 */
function setSky(type) {
	const rad = TR3sto.sizeWrld;
	if (TR3sto.skyMesh)
		scene.remove(TR3sto.skyMesh);

	TR3sto.pano.type = type;

	let geometryPano = new THREE.SphereGeometry(rad, 60, 40);
	let materialPano = new THREE.MeshBasicMaterial({ color: 0xffffff, visible: false });

	if (TR3sto.pano && type == 'sphere') {
		const pan = TR3sto.pano;

		geometryPano = new THREE.SphereGeometry(rad, 60, 40);
		// invert the geometry on the x-axis so that all of the faces point inward
		geometryPano.scale(- 1, 1, 1);

		const texturePano = new THREE.TextureLoader().load(pan.src + '/' + pan.name + '.' + pan.ext);
		texturePano.colorSpace = THREE.SRGBColorSpace;
		materialPano = new THREE.MeshBasicMaterial({ map: texturePano });

	} else if (TR3sto.pano && type == 'cube') {
		const pan = TR3sto.pano;

		const path = pan.src + '/' + pan.name;
		const format = '.' + TR3sto.pano.ext;
		const urls = [
			path + 'px' + format, path + 'nx' + format,
			path + 'py' + format, path + 'ny' + format,
			path + 'pz' + format, path + 'nz' + format
		];

		const textureCube = new THREE.CubeTextureLoader().load(urls);
		textureCube.colorSpace = THREE.SRGBColorSpace;

		geometryPano = new THREE.SphereGeometry(rad, 60, 40);
		// invert the geometry on the x-axis so that all of the faces point inward
		geometryPano.scale(- 1, 1, 1);
		materialPano = new THREE.MeshBasicMaterial({ envMap: textureCube });

	} else if (TR3sto.pano && type == 'cube-stripe') {
		const pan = TR3sto.pano;

		const textures = getTexturesFromAtlasFile(pan.src + '/' + pan.name + '.' + pan.ext, 6);

		materialPano = [];
		for (let i = 0; i < 6; i++) {
			materialPano.push(new THREE.MeshBasicMaterial({ map: textures[i] }));
		}

		geometryPano = new THREE.BoxGeometry(rad / 2, rad / 2, rad / 2);
		geometryPano.scale(1, 1, - 1);

	} else if (TR3sto.pano && type == 'box') {
		const pan = TR3sto.pano;

		const path = pan.src + '/' + pan.name;
		const format = '.' + TR3sto.pano.ext;
		const urls = [
			path + 'px' + format, path + 'nx' + format,
			path + 'py' + format, path + 'ny' + format,
			path + 'pz' + format, path + 'nz' + format
		];

		let loader = new THREE.TextureLoader();
		loader.colorSpace = THREE.SRGBColorSpace;
		materialPano = [];
		for (let i = 0; i < 6; i++) {
			let textureCube = loader.load(urls[i]);
			textureCube.colorSpace = THREE.SRGBColorSpace;
			materialPano.push(new THREE.MeshBasicMaterial({ map: textureCube }));
		}
		geometryPano = new THREE.BoxGeometry(rad / 2, rad / 2 * (TR3sto.pano.ratio || 1), rad / 2);
		geometryPano.scale(1, 1, - 1);

	} else {  }

	let rot = 0;
	if (TR3sto.pano.rotate) { rot = TR3sto.pano.rotate; }

	TR3sto.skyMesh = new THREE.Mesh(geometryPano, materialPano);
	//TR3sto.skyMesh.scale.set(.5,.5,.5);
	const box = getSizeObj(TR3sto.skyMesh);
	TR3sto.skyMesh.TR3 = new Object();
	TR3sto.skyMesh.TR3.box = box[0];
	TR3sto.skyMesh.TR3.hitbox = box[1];
	TR3sto.skyMesh.TR3.radius = box[2];
	TR3sto.skyMesh.TR3.center = box[3];

	TR3sto.skyMesh.TR3.onlyInGoodRender = true;
	
	let pos = new THREE.Vector3(0, 0, 0);
	if (TR3sto.pano.topPos == 'down') { pos.y = -TR3sto.skyMesh.TR3.box.min.y;/*TR3sto offset*/ }
	else if(typeof(TR3sto.pano.topPos) == 'number'){
		pos.y = TR3sto.pano.topPos;
	}

	TR3sto.skyMesh.position.copy(pos);
	TR3sto.skyMesh.rotateY(rot);
	TR3sto.skyMesh.name = 'skyMesh';
	scene.add(TR3sto.skyMesh);
};

/**
 * Añade elementos a la escena como objetos 3d o luces,
 * que serán identificados como secundarios para cuestiones de rendimiento
 * @param {object} elem elemento de escena THREE a añadir
 */
TR3sto.addScene = function(elem){
	elem.TR3 = { onlyInGoodRender: true };
	elem.visible = false;
	scene.add(elem);
};
//fin world.js