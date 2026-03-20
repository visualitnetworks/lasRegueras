"use strict";
/**
 * Permite tener un lugar donde poder manejar parámetros de la escena y los objetos
 * teniendo distintos manejadores como sliders, checks, colorpickers...
 * @class gui
 */

/**
 * Crea el lugar del GUI y sus opciones previstas,
 * también se puede añadir elementos dinámicamente con TR3sto.panel.addGuiTools.add...
 * @public
 * @param {object} panel - objeto de creación new GUI
 * https://github.com/dataarts/dat.gui/blob/master/API.md
 */
TR3sto.setGUI = function (panel) {
	//const folderEffects = panel.addFolder('Effects');
	//folderEffects.domElement.id = 'gui-effects';
	const folderViews = panel.addFolder('Views');
	const folderLights = panel.addFolder('Lights');
	const folderEnv = panel.addFolder('Enviroment');
	const mainObj = panel.addFolder('MainObj3D');
	const addCinematicsTools = panel.addFolder('Cinematics-Tools');
	const addCinematics = panel.addFolder('Cinematics');
	const addTools = panel.addFolder('Adding-Tools');
	TR3sto.panel = {
		addViews: folderViews,
		addLights: folderLights,
		addEnviroment: folderEnv,
		addMainObj: mainObj,
		addGuiCinematicsTools: addCinematicsTools,
		addGuiCinematics: addCinematics,
		addGuiTools: addTools
	};

	//TR3sto.panel.addGuiCinematicsTools.controllers[0].object.ClearGUI();
	addCinematicsTools.add({
		ClearUI: function () {
			var bodyHTML = container.childNodes;
			for (let index = 0; index < bodyHTML.length; index++) {
				const element = bodyHTML[index];
				if (element.style && element.id != 'VRButton') {
					if (element.style.visibility != 'hidden') {
						element.style.visibility = 'hidden';
					} else {
						element.style.visibility = 'visible';
					}
					if (element.nodeName == 'CANVAS' || element.id == 'rendererCSS')
						element.style.visibility = 'visible';
				}
			}
		}
	}, 'ClearUI');

	addCinematicsTools.add({
		SetCamera: function (int) {
			var cam = JSON.stringify(camera.position);
			var tgt = JSON.stringify(orbit.target);
			var moveCineCam = TR3sto.panel.addGuiCinematicsTools.controllers[3].getValue();
			var timeCineCam = TR3sto.panel.addGuiCinematicsTools.controllers[2].getValue();
			var easingCinemaCam = TR3sto.panel.addGuiCinematicsTools.controllers[4].getValue();

			var registMoveCineCam = document.getElementById('registMoveCineCam')
			registMoveCineCam.value += timeCineCam + "$" + moveCineCam + "$" + easingCinemaCam +
				"$" + cam + "$" + tgt + ' \r\n';
		}
	}, 'SetCamera');

	addCinematicsTools.add({ Time: 3 }, 'Time', 0, 100);

	addCinematicsTools.add({ Type: 'putCam' }, 'Type', ["putCam", "goto", "rotation", "wait"])

	addCinematicsTools.add({ Tweens: 'Linear.None' }, 'Tweens', ["Linear.None", "Quadratic.In", "Quadratic.Out", "Quadratic.InOut", "Cubic.In", "Cubic.Out", "Cubic.InOut", "Quartic.In", "Quartic.Out", "Quartic.InOut", "Quintic.In", "Quintic.Out", "Quintic.InOut", "Sinusoidal.In", "Sinusoidal.Out", "Sinusoidal.InOut<", "Exponential.In", "Exponential.Out", "Exponential.InOut", "Circular.In", "Circular.Out", "Circular.InOut", "Elastic.In", "Elastic.Out", "Elastic.InOut", "Back.In", "Back.Out", "Back.InOut", "Bounce.In", "Bounce.Out", "Bounce.InOut"]);

	addCinematicsTools.add({
		PlayCinema: function () {
			orbit.autoRotate = false;

			var registMoveCineCam = document.getElementById('registMoveCineCam').value.split(' ');
			var moves = new Array();
			for (let i = 0; i < registMoveCineCam.length; i++) {
				const regI = registMoveCineCam[i];
				if (regI != "" && regI.indexOf('$') > -1) {
					var moveItms = regI.split('$');
					//textTag.value = timeCineCam + "$" + moveCineCam + "$" + easingCinemaCam + "$" +cam + "$" + tgt;
					moves.push({
						time: moveItms[0] * 1, type: moveItms[1], easing: moveItms[2].split('.'),
						cam: JSON.parse(moveItms[3]), tgt: JSON.parse(moveItms[4])
					});
				}
			}

			executeCinemaCam(moves, 0);

			function executeCinemaCam(moves, countCinemaCam) {
				var movesI = moves[countCinemaCam];
				if (!movesI) { countCinemaCam = 0; return false; }
				countCinemaCam++;
				var easing = TWEEN.Easing[movesI.easing[0]][movesI.easing[1]];
				var cam = {"x": movesI.cam.x*1-.5, "y": movesI.cam.y*1-.5, "z": movesI.cam.z*1-.5};
				var tar = {"x": movesI.tgt.x*1-.5, "y": movesI.tgt.y*1-.5, "z": movesI.tgt.z*1-.5};
				var time = movesI.time * 1000;

				if (movesI.type == 'rotation') {
					orbit.autoRotate = true;
					setTimeout(() => {
						orbit.autoRotate = false;
						executeCinemaCam(moves, countCinemaCam);
					}, time);
					return false;
				}

				if (movesI.type == 'wait') {
					setTimeout(() => {
						executeCinemaCam(moves, countCinemaCam);
					}, time);
					return false;
				}

				if (movesI.type == 'putCam') {
					camera.position.set(cam.x,cam.y,cam.z);
					orbit.target.set(tar.x,tar.y,tar.z);
					setTimeout(() => {
						executeCinemaCam(moves, countCinemaCam);
					}, time);
					return false;
				}

				new TWEEN.Tween(camera.position) //https://github.com/tweenjs/es6-tween
					.to(cam, time)
					.easing(easing)
					.onComplete(() => {
						executeCinemaCam(moves, countCinemaCam);
					})
					.start();

				new TWEEN.Tween(orbit.target) //https://github.com/tweenjs/es6-tween
					.to(tar, time * 0.5)
					.easing(TWEEN.Easing.Linear.None)
					.start();

			};
		}
	}, 'PlayCinema');


	folderLights.add({ AmbientIntens: TR3sto.lights.ambient.intensity }, 'AmbientIntens', 0, 10).onChange(function (int) {
		scene.getObjectByName('AmbientLight').intensity = int;
		TR3sto.lights.ambient.intensity = int;
	});

	folderLights.add({ DirectIntens: TR3sto.lights.directional.intensity }, 'DirectIntens', 0, 10).onChange(function (int) {
		scene.getObjectByName('DirectionalLight').intensity = int;
	});

	folderLights.addColor({ AmbientColor: TR3sto.lights.ambient.color }, 'AmbientColor').onChange((color) => {
		scene.getObjectByName('AmbientLight').color.setHex(color, THREE.SRGBColorSpace);
	});

	folderLights.addColor({ DirectColor: TR3sto.lights.directional.color }, 'DirectColor').onChange((color) => {
		scene.getObjectByName('DirectionalLight').color.setHex(color, THREE.SRGBColorSpace);
	});

	panel.add({ Effects: 'none' }, 'Effects', ['Stereo', 'Anaglyph', 'none']).onChange(function (type) {
		const cont = {
			w: parseInt(container.style.width),
			h: parseInt(container.style.height)
		};

		if (type == 'Stereo') {
			TR3sto.effectStereo = true;
			TR3sto.effectAnaglyph = false;

			renderer.setSize(cont.w, cont.h);
			rendererCSS.setSize(cont.w, cont.h);
			sceneCSS.visible = false;
		} else if (type == 'Anaglyph') {
			TR3sto.effectAnaglyph = true;
			TR3sto.effectStereo = false;

			renderer.setSize(cont.w, cont.h);
			rendererCSS.setSize(cont.w, cont.h);
			sceneCSS.visible = true;
		} else if (type == 'none') {
			TR3sto.effectAnaglyph = false;
			TR3sto.effectStereo = false;

			renderer.setSize(cont.w, cont.h);
			rendererCSS.setSize(cont.w, cont.h);
			sceneCSS.visible = true;
		}

	});

	panel.add({
		ClearScene: function () {
			clearScene();
		}
	}, 'ClearScene');

	panel.add({
		GetImage: function () {
			/*var link = document.createElement('a');
			link.download = 'init.jpeg';
			link.href = renderer.domElement.toDataURL("image/jpeg")
			link.click();*/
			downloadCanvasAsImage();
		}
	}, 'GetImage');

	function downloadCanvasAsImage() {
		render(); //preserveDrawingBuffer=true, image black!
		let canvasImage = renderer.domElement.toDataURL('image/jpeg');

		// this can be used to download any image from webpage to local disk
		let xhr = new XMLHttpRequest();
		xhr.responseType = 'blob';
		xhr.onload = function () {
			let a = document.createElement('a');
			a.setAttribute('crossOrigin', 'anonymous');
			a.href = window.URL.createObjectURL(xhr.response);
			a.download = 'init.jpeg';
			a.style.display = 'none';
			document.body.appendChild(a);
			a.click();
			a.remove();
		};
		xhr.open('GET', canvasImage); // This is to download the canvas Image
		xhr.send();
	};
	TR3sto.downloadCanvasAsImage = downloadCanvasAsImage;

	panel.add({ CSSrender3D: true }, 'CSSrender3D').onChange(function (css) {
		sceneCSS.visible = css;
	});

	let countAttemptsFullsScreen = 0;
	folderViews.add({
		FullScreen_OnOff: TR3sto.fullScreen = function (force, noAlertDiv) {
			const fullscreenElement = isFullScreen();
			force = true;
			if (!force) {
				const testPrf = testPerform();
				if (testPrf == 'notReady') {
					setTimeout(function () {
						TR3sto.fullScreen(false, noAlertDiv)
					}, 1000);
					return false;
				}

				if (testPrf == 'bad'/*FPs*/ && !noAlertDiv) {

					showCustomAlert('- Su dispositivo parece sobrecargado y aplicar esta opción podría afectar su rendimiento.<br><br>\
					¿Desea continuar?<br>', function (response) {
						if (response) {
							TR3sto.fullScreen(true);
							console.log("User clicked Yes");
						} else {
							console.log("User clicked No");
						}
					});

				}

				if (testPrf == 'bad'/*FPs*/ && countAttemptsFullsScreen < 5) {
					setTimeout(function () {
						TR3sto.fullScreen(false, true)
						countAttemptsFullsScreen++
					}, 1000);
					return false;
				}
			}

			if (!fullscreenElement) {

				TR3sto.fullscreenContainer = true;
				document.getElementById('customAlert').style.display = 'none';
				setFullScreen();
			}
			else {

				TR3sto.fullscreenContainer = false;
				container.style.top = TR3sto.topContainer;
				container.style.left = TR3sto.leftContainer;
				container.style.zIndex = TR3sto.zIndexContainer;
				container.style.transform = TR3sto.transformContainer;
				//container.style.position = TR3sto.positionContainer;
				container.style.height = TR3sto.heightContainer + 'px';
				container.style.width = TR3sto.widthContainer + 'px';
			}

			const cont = { w: parseInt(container.style.width), h: parseInt(container.style.height) };

			camera.aspect = cont.w / cont.h;
			camera.updateProjectionMatrix();

			renderer.setSize(cont.w, cont.h);
			rendererCSS.setSize(cont.w, cont.h);
		}
	}, 'FullScreen_OnOff');

	folderViews.add({
		RestoreView: function () {
			/*if (Get_Out && Get_Out.style)
				Get_Out.style.display = 'none';*/
			new TWEEN.Tween(camera.position) // Create a new tween that modifies 'coords'.
				.to({ x: TR3sto.camaraInit.x, y: TR3sto.camaraInit.y, z: TR3sto.camaraInit.z }, TR3sto.tweenTime)
				.easing(TWEEN.Easing.Quadratic.InOut) // Use an easing function to make the animation smooth.
				.onUpdate(() => {
					orbit.target.set(0, 0, 0);
					orbit.update();
				})
				.onComplete(() => {
					orbit.autoRotate = true;
				})
				.start() // Start the tween immediately.
		}
	}, 'RestoreView');

	folderViews.add({
		TargetOrigin: function () {
			new TWEEN.Tween(orbit.target) // Create a new tween that modifies 'coords'.
				.to({ x: 0, y: TR3sto.main3d.TR3.hitbox.y / 2, z: 0 }, TR3sto.tweenTime)
				.easing(TWEEN.Easing.Quadratic.InOut) // Use an easing function to make the animation smooth.
				/*.onUpdate(() => {
					orbit.target.set(0, 0, 0);
					orbit.update();
				})*/
				.onComplete(() => {
					orbit.update();
					orbit.autoRotate = true;
				})
				.start() // Start the tween immediately.
		}
	}, 'TargetOrigin');

	folderEnv.add({ Skys: 'sphere' }, 'Skys', ['sphere', 'cube', 'cube-stripe', 'box', 'none']).onChange(function (type) {

		updateMaterial('planeFloor', 'MeshBasicMaterial', { color: 0xcccccc, opacity: 0.9, transparent: true });

		if (type == 'sphere') {
			TR3sto.pano = { type: type, src: './obj3d/panos/sphere', name: 'panoSW', ext: 'jpg', topPos: false, rotate: 1 };
			setSky(TR3sto.pano.type);
		} else if (type == 'cube') {
			TR3sto.pano = { type: type, src: './obj3d/panos/cube', name: 'dark-s_', ext: 'jpg' };
			setSky(TR3sto.pano.type);
		} else if (type == 'cube-stripe') {
			TR3sto.pano = { type: type, src: './obj3d/panos/cube-stripe', name: 'temple', ext: 'jpg', topPos: 'down' };
			setSky(TR3sto.pano.type);
		} else if (type == 'box') {
			TR3sto.pano = { type: type, src: './obj3d/panos/cube', name: 'brick_', ext: 'jpg', topPos: 'down', ratio: 1 / 2 };
			updateTexture('planeFloor', 'MeshPhongMaterial', './obj3d/panos/cube/brick_ny.jpg');
			setSky(TR3sto.pano.type);
		} else {
			setSky();
		}

	});

	folderEnv.add({ SkyRotation: 0 }, 'SkyRotation', 0, 2 * Math.PI).onChange(function (rot) {
		TR3sto.skyMesh.rotation.y = rot;
	});

	folderEnv.add({ EnvScene: false }, 'EnvScene').onChange(function (EnvScene) {
		if (EnvScene)
			scene.background = TR3sto.reflectionCube;
		else
			scene.background = false;
	});

	folderEnv.add({ Shadow: TR3sto.floor.shadow }, 'Shadow').onChange(function (Shadow) {
		TR3sto.floor.shadow = Shadow;
		scene.getObjectByName('planeShadow').visible = Shadow;

	});

	folderEnv.add({ Grid: TR3sto.floor.grid }, 'Grid').onChange(function (Grid) {
		TR3sto.floor.grid = Grid;
		scene.getObjectByName('planeGrid').visible = Grid;

	});

	folderEnv.add({ Floor: TR3sto.floor.floor }, 'Floor').onChange(function (Floor) {
		TR3sto.floor.floor = Floor;
		scene.getObjectByName('planeFloor').visible = Floor;
	});

	folderEnv.add({ AutoRotate: true/*orbit.autoRotate*/ }, 'AutoRotate').onChange(function (rot) {
		orbit.autoRotate = rot;
	});

	folderEnv.add({ MinDist: true }, 'MinDist').onChange(function (mdist) {
		if (mdist) {
			orbit.minDistance = TR3sto.sizeWrld / (100);
		} else {
			orbit.minDistance = 0;
		}
	});

	TR3sto.arrTransf = ['none', 'camera', 'orbit', 'DirectionalLight', 'MainObj'];
	folderEnv.add({ Transform: 'none' }, 'Transform', TR3sto.arrTransf).onChange(function (type) {
		let infoTR3sro = document.getElementById('infoTR3sro');


		let obj3d;
		if (type == 'camera') {
			obj3d = camera;
			obj3d.noTransforms = true;
		} else if (type == 'orbit') {
			obj3d = JSON.parse(JSON.stringify(orbit));
			obj3d.position = orbit.target;
			obj3d.noTransforms = true;
		} else if (type == 'MainObj') {
			obj3d = TR3sto.main3d;
		} else if (type == 'none') {
			obj3d = false;
		} else if (type.indexOf('CSS') > -1) {
			obj3d = sceneCSS.getObjectByName(type);
		} else {
			obj3d = scene.getObjectByName(type);
		}

		if (obj3d) {
			if (!obj3d.noTransforms)
				transCtrls(obj3d);
			clearInterval(TR3sto.intervalTransform);
			TR3sto.intervalTransform = setInterval(function () {
				if (!TR3sto.overInfoTR3sto) {
					infoTR3sro.style.display = 'block';
					infoTR3sro.innerHTML = '';

					let lblSize = '', size = '', lblBox = '', box = '';
					if (obj3d.TR3 && obj3d.TR3.box) {
						lblSize = '-SIZE-<br>';
						size = JSON.stringify(obj3d.TR3.hitbox) + '<br>';
						lblBox = '-BOX-<br>';
						box = JSON.stringify(obj3d.TR3.box).replace('{"isBox3":true,"', '').replaceAll('":{"', ":<br>{").replaceAll('},"', '},<br>"');
					}

					const lblPos = '-POSITION-';
					const pos = JSON.stringify(obj3d.position);
					const lblSle = '-SCALE-';
					const sle = JSON.stringify(obj3d.scale);
					const lblQuat = '-QUATERNION-';
					const quat = JSON.stringify(obj3d.quaternion);

					const joinTexts = lblPos + '<br>' + pos + '<br>' + lblSle + '<br>' + sle + '<br>' + lblQuat + '<br>' + quat + '<br>' +
						lblSize + size + lblBox + box;

					const text = joinTexts.replaceAll('"', '');

					infoTR3sro.innerHTML = text;
				}
			}, 1000);

		} else {
			infoTR3sro.style.display = 'none';
			clearInterval(TR3sto.intervalTransform);
		}

	});

	mainObj.add({
		ToonMaterial: function () {
			const fiveTone = new THREE.TextureLoader().load(TR3sto.src + 'THREE/textures/fiveTone.jpg');
			fiveTone.minFilter = THREE.NearestFilter;
			fiveTone.magFilter = THREE.NearestFilter;
			TR3sto.main3d.traverse(
				function (child) {
					if (child.material && child.material.color) {
						const colorMat = child.material.color.getHex();
						const opacityMat = child.material.opacity;
						const transparentMat = child.material.transparent;

						child.material = new THREE.MeshToonMaterial({ gradientMap: fiveTone, color: colorMat, transparent: transparentMat, opacity: opacityMat });
					}
				}
			);
		}
	}, 'ToonMaterial');

	mainObj.add({
		CenterObj3DByGeom: function () {
			let obj3d = TR3sto.main3d;
			obj3d.position.set(0, 0, 0);
			obj3d.traverse((child) => {
				const bbox = new THREE.Box3().setFromObject(child);
				const vec = new THREE.Vector3();
				bbox.getCenter(vec);
				child.position.set(vec.x, vec.y, vec.z);
				if (child.isMesh) {
					child.geometry.translate(-vec.x, -vec.y, -vec.z);
				} else {
					child.traverse((child) => {
						if (child.geometry) {
							child.geometry.translate(-vec.x, -vec.y, -vec.z);
						}
					});
					//child.position.set(0, 0, 0);
				}
			});
			obj3d.position.set(0, 0, 0);
		}
	}, 'CenterObj3DByGeom');

	mainObj.add({
		CenterObj3DByPivot: function () {
			TR3sto.main3d.position.x = -(TR3sto.main3d.TR3.box.max.x + TR3sto.main3d.TR3.box.min.x) / 2;
			TR3sto.main3d.position.y = -(TR3sto.main3d.TR3.box.max.y + TR3sto.main3d.TR3.box.min.y) / 2;
			TR3sto.main3d.position.z = -(TR3sto.main3d.TR3.box.max.z + TR3sto.main3d.TR3.box.min.z) / 2;

			var group = new THREE.Group();
			group.name = "groupMain";
			group.attach(TR3sto.main3d);

			scene.add(group);

			transCtrls(group);
		}
	}, 'CenterObj3DByPivot');

	mainObj.add({
		ExportGLB: function () {
			//let exporter = TR3sto.main3d.clone();
			var gltfExporter = new GLTFExporter();

			var options = {
				//trs: false,
				onlyVisible: true,
				binary: true,
				maxTextureSize: 1024,
				animations: TR3sto.exportAnim || false
			};

			//if(exporter.length > 0 || exporter.type == "Mesh")
			const expo = control.object || TR3sto.main3d;
			gltfExporter.parse(expo,
				function (result) {

					if (result instanceof ArrayBuffer) {

						saveArrayBuffer(result, 'TR3sto_scene.glb');

					} else {

						var output = JSON.stringify(result, null, 2);
						//console.log( output );
						saveString(output, 'TR3sto_scene.gltf');

					}

				}, function (error) {

					console.log('An error happened during parsing', error);

				}, options);

			var link = document.createElement('a');
			link.style.display = 'none';
			document.body.appendChild(link); // Firefox workaround, see #6594

			function save(blob, filename) {

				link.href = URL.createObjectURL(blob);
				link.download = filename;
				link.click();

				// URL.revokeObjectURL( url ); breaks Firefox...

			}

			function saveString(text, filename) {

				save(new Blob([text], { type: 'text/plain' }), filename);

			}


			function saveArrayBuffer(buffer, filename) {

				save(new Blob([buffer], { type: 'application/octet-stream' }), filename);

			}

			/*function exportObjItem(obj3d2Exp) {
				var Obj3d;
				if (obj3d2Exp.type == 'Scene' || obj3d2Exp.type == 'Group') {
					Obj3d = obj3d2Exp;
				} else if (obj3d2Exp.scene) {
					Obj3d = obj3d2Exp.scene;
				} else {
					Obj3d = obj3d2Exp;
				}
				var Obj3dChild = TR3.SkeletonUtilsClone(Obj3d);//https://github.com/mrdoob/three.js/issues/11574

				return Obj3dChild;
			}*/
		}
	}, 'ExportGLB');

	mainObj.add({ ExportAnim: false }, 'ExportAnim').onChange(function (bool) {
		TR3sto.exportAnim = bool
	});

	TR3sto.intervalBox = 0;
	mainObj.add({ BoxMainObj: false }, 'BoxMainObj').onChange(function (box) {
		TR3sto.boxMainObj.update();
		TR3sto.boxMainObj.visible = box

		if (box) {
			TR3sto.intervalBox = setInterval(function () {
				TR3sto.boxMainObj.update();
			}, 1000);

		} else {
			clearInterval(TR3sto.intervalBox);
		}
	});

	mainObj.add({ WirefMainObj: false }, 'WirefMainObj').onChange(function (wiref) {
		let obj3d = TR3sto.main3d;
		obj3d.traverse(function (child) {
			if (child.isMesh) {
				child.material.wireframe = wiref;
			}
		});
	});

	mainObj.add({ EdgesMainObj: false }, 'EdgesMainObj').onChange(function (edges) {
		let obj3d = TR3sto.main3d
		obj3d.edgesTC = !obj3d.edgesTC;
		if (obj3d.edgesTC) {
			obj3d.traverse(function (child) {
				if (child.isMesh) {
					var geometry = child.geometry;

					var edgesGeometry = new THREE.EdgesGeometry(geometry);
					var edgesMaterial = new THREE.LineBasicMaterial({ color: 0xcccccc });
					var edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);

					edges.name = 'TR3-edges';
					child.add(edges);
				}
			});
		} else {
			obj3d.traverse(function (child) {
				if (child.name == 'TR3-edges') {
					//var material = child.material.color = new THREE.Color(0xcccccc);
					child.parent.remove(child);
				}
			});
		}
	});

	panel.close();
};
//fin gui.js