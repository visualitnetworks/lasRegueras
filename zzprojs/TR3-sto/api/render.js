"use strict";
/**
 * Maneja lo relacionado con la renderización de la escena.
 * @class render
 */

/**
 * lugar donde se aplica la lógica al renderizar las escenas FPS.
 */

// a variable to store the values from the last polling of the gamepads
const prevGamePads = new Map();

function render() {

	var delta = clock.getDelta();
	TR3sto.delta = delta;
	var elapsedTime = clock.getElapsedTime();

	for (var i = 0; i < TR3sto.oscillate.length; i++) {
		var osciI = TR3sto.oscillate[i];
		var pos = osciI[0].position;

		var z = osciI[3] || 0;
		z += Math.sin(elapsedTime * osciI[1]) * osciI[2];
		pos.y = z;
	}

	for (var i = 0; i < TR3sto.rotate.length; i++) {
		var rotateI = TR3sto.rotate[i];
		rotateI[0].rotation.y += rotateI[1] || 0.02;
	}

	for (var i = 0; i < TR3sto.lookAtCamera.length; i++) {
		var lookAtCameraI = TR3sto.lookAtCamera[i];
		lookAtCameraI.lookAt(camera.position);
	}

	for (var i = 0; i < TR3sto.lookAtXY.length; i++) {
		var lookAtCameraI = TR3sto.lookAtXY[i];
		var posCam = camera.position;
		var lookXY = new THREE.Vector3(posCam.x, lookAtCameraI.position.y, posCam.z);
		lookAtCameraI.lookAt(lookXY);
	}

	for (var i = 0; i < TR3sto.lookAtZ.length; i++) {
		var lookAtCameraI = TR3sto.lookAtZ[i];
		var posCam = camera.position;
		var lookZ = new THREE.Vector3(lookAtCameraI.position.x, posCam.y, lookAtCameraI.position.z);
		lookAtCameraI.lookAt(lookZ);
	}

	for (var i = 0; i < TR3sto.scalate.length; i++) {
		var scalateI = TR3sto.scalate[i];
		var scale = scalateI[0].scale;
		var y = scalateI[3] || 0;
		y += Math.sin(elapsedTime * scalateI[1]) * scalateI[2];
		scale.x = y;
		scale.y = y;
		scale.z = y;
	}

	if (TR3sto.effectAnaglyph) {
		effect_Agph.render(scene, camera);
		rendererCSS.render(sceneCSS, camera);
	}
	else if (TR3sto.effectStereo) {
		effect_Sro.render(scene, camera);
		effectCSS_Sro.render(sceneCSS, camera);
	} else {
		renderer.render(scene, camera);
		rendererCSS.render(sceneCSS, camera);
	}

	if (TR3sto.mixer) {
		for (var i = 0; i < TR3sto.mixer.length; i++) {
			TR3sto.mixer[i].update(delta);
		}
	}

	var main3d = TR3sto.main3d;
	if (main3d && main3d.visible == true && main3d.mixer) {
		main3d.mixer.update(delta);
	}

	/*if (main3d && main3d.visible == true && main3d.TR3) {
		TR3sto.camTrain.rotation.y = elapsedTime / 5;
		TR3sto.camTrain.position.y = (main3d.TR3.hitbox.y / 2 * Math.sin(elapsedTime / 5) - main3d.TR3.hitbox.y) / 2;
	}*/
	//TR3sto.camTrain.scale.set(delta*1.5,delta*1.5,delta*1.5);
	TR3sto.renderExtendFn(elapsedTime, delta);

	if ((controller1 && controller1.userData.isSelecting === true) || (controller2 && controller2.userData.isSelecting === true)) {
		TR3sto.moveDolly();
	} else if ((controller1 && controller1.userData) || (controller2 && controller2.userData)) {
		infoTR3sro.style.display = 'block';
		dollyMove();
	}


};

function dollyMove() {
	if (!renderer) { return false; }
	var handedness = "unknown";

	//determine if we are in an xr session
	const session = renderer.xr.getSession();
	let i = 0;

	if (session) {
		//a check to prevent console errors if only one input source
		if (isIterable(session.inputSources)) {
			for (const source of session.inputSources) {
				if (source && source.handedness) {
					handedness = source.handedness; //left or right controllers
				}
				if (!source.gamepad) continue;
				//const controller = renderer.xr.getController(i++);
				const old = prevGamePads.get(source);
				const data = {
					handedness: handedness,
					buttons: source.gamepad.buttons.map((b) => b.value),
					axes: source.gamepad.axes.slice(0)
				};
				//infoTR3sro.innerHTML = ' data' + JSON.stringify(data);
				//return false;
				if (old) {
					data.buttons.forEach((value, i) => {
						//handlers for buttons
						if (value !== old.buttons[i] || Math.abs(value) > 0.8) {
							//check if it is 'all the way pushed'
							if (value === 1) {
								//console.log("Button" + i + "Down");
								if (data.handedness == "left") {
									//console.log("Left Paddle Down");
									if (i == 1) {
										TR3sto.speed = TR3sto.speed - TR3sto.speedPlus;
										if(TR3sto.speed<0){TR3sto.speed = 0;}
										infoTR3sro.innerHTML = 'Squeeze1 ' + TR3sto.speed;
									}
									if (i == 2 || i == 3 || i == 4 || i == 5) {
										TR3sto.camTrain.position.set(0, 1, 0);
										infoTR3sro.innerHTML = 'AB1';
									}
								} else {
									//console.log("Right Paddle Down");
									if (i == 1) {
										TR3sto.speed = TR3sto.speed + TR3sto.speedPlus;
										if(TR3sto.speed>1){TR3sto.speed = 1;}
										infoTR3sro.innerHTML = 'Squeeze2 ' + TR3sto.speed;
									}
									if (i == 2 || i == 3 || i == 4 || i == 5) {
										TR3sto.camTrain.position.set(0, 1, 0);
										infoTR3sro.innerHTML = 'AB2';
									}
								}
							} else {
								// console.log("Button" + i + "Up");

								if (i == 1) {
									//use the paddle buttons to rotate
									if (data.handedness == "left") {
										//console.log("Left Paddle Down");
										//TR3sto.coin.rotateY(-THREE.MathUtils.degToRad(1));
										//infoTR3sro.innerHTML = '3';
									} else {
										//console.log("Right Paddle Down");
										//TR3sto.coin.rotateY(THREE.MathUtils.degToRad(1));
										//infoTR3sro.innerHTML = '4';
									}
								}
							}
						}
					});
					data.axes.forEach((value, i) => {
						//handlers for thumbsticks
						//if thumbstick axis has moved beyond the minimum threshold from center, windows mixed reality seems to wander up to about .17 with no input
						if (Math.abs(value) > 0.8) {
							//set the speedFactor per axis, with acceleration when holding above threshold, up to a max speed
							if (i == 2) {
								//left and right axis on thumbsticks
								if (data.handedness == "left") {
									let startQuat = TR3sto.camTrain.quaternion.clone();

									TR3sto.camTrain.quaternion.copy(camera.quaternion);
									TR3sto.camTrain.translateX(-TR3sto.speed * -Math.sign(data.axes[2]));
									//TR3sto.camTrain.getWorldPosition(this.tmpPos);

									//Restore the original rotation
									TR3sto.camTrain.quaternion.copy(startQuat);
									infoTR3sro.innerHTML = 'left2 ' + Math.sign(data.axes[2]);
								} else {
									let startQuat = TR3sto.camTrain.quaternion.clone();

									TR3sto.camTrain.quaternion.copy(camera.quaternion);
									TR3sto.camTrain.translateX(-TR3sto.speed * -Math.sign(data.axes[2]));
									//TR3sto.camTrain.getWorldPosition(this.tmpPos);

									//Restore the original rotation
									TR3sto.camTrain.quaternion.copy(startQuat);
									infoTR3sro.innerHTML = 'right2 ' + Math.sign(data.axes[2]);
								}
								orbit.update();
							}

							if (i == 3) {
								//up and down axis on thumbsticks
								if (data.handedness == "left") {
									let startQuat = TR3sto.camTrain.quaternion.clone();

									TR3sto.camTrain.quaternion.copy(camera.quaternion);
									TR3sto.camTrain.translateY(TR3sto.speed * Math.sign(data.axes[3]));
									//TR3sto.camTrain.getWorldPosition(this.tmpPos);

									//Restore the original rotation
									TR3sto.camTrain.quaternion.copy(startQuat);
									infoTR3sro.innerHTML = 'left3 ' + Math.sign(data.axes[3]);
								} else {
									let startQuat = TR3sto.camTrain.quaternion.clone();

									TR3sto.camTrain.quaternion.copy(camera.quaternion);
									TR3sto.camTrain.translateY(TR3sto.speed * Math.sign(data.axes[3]));
									//TR3sto.camTrain.getWorldPosition(this.tmpPos);

									//Restore the original rotation
									TR3sto.camTrain.quaternion.copy(startQuat);
									infoTR3sro.innerHTML = 'right3 ' + Math.sign(data.axes[3]);
								}
								orbit.update();
							}
						} else {
							//axis below threshold - reset the speedFactor if it is greater than zero  or 0.025 but below our threshold
							/*if (Math.abs(value) > 0.025) {
								speedFactor[i] = 0.025;
							}*/
						}
					});
				}
				prevGamePads.set(source, data);
			}
		}
	}
}
TR3sto.dollyMove = dollyMove();
function isIterable(obj) {
	// checks for null and undefined
	if (obj == null) {
		return false;
	}
	return typeof obj[Symbol.iterator] === "function";
}
TR3sto.isIterable = isIterable();
function moveDolly() {
	let startQuat = TR3sto.camTrain.quaternion.clone();

	TR3sto.camTrain.quaternion.copy(camera.quaternion);
	TR3sto.camTrain.translateZ(TR3sto.speed * TR3sto.sign);
	infoTR3sro.innerHTML = 'Z ' + TR3sto.speed * TR3sto.sign;
	//TR3sto.camTrain.getWorldPosition(this.tmpPos);

	//Restore the original rotation
	TR3sto.camTrain.quaternion.copy(startQuat);
};
TR3sto.moveDolly = moveDolly;
/**
 * funciones de renderización de los distintos elementos 
 * a tener en cuenta al renderizar
 */
function animate() {
	//TR3sto.idAnimation = requestAnimationFrame(animate);
	render();
	TWEEN.update(/*time*/);
	orbit.update();
	TR3stoFPS();
	//stats.update();
};

/**
 * funciones que elimina cualquier elemento de la escena y reinicia el entorno para una nueva
 */
function clearScene() {

	var canvasDest = renderer.domElement;

	if (canvasDest) {

		var cleanMaterial = function (material) {
			//console.log('dispose material!');
			material.dispose();
			// dispose textures
			for (var _i = 0, _a = Object.keys(material); _i < _a.length; _i++) {
				var key = _a[_i];
				var value = material[key];
				if (value && typeof value === 'object' && 'minFilter' in value) {
					//console.log('dispose texture!');
					value.dispose();
				}
			}
		};

		renderer.dispose();
		container.innerHTML = '';
		//rendererCSS.dispose();

		scene.traverse(function (object) {
			if (!object.isMesh) return;
			//console.log('dispose geometry!');
			if (object.userData && object.userData.physicsBody) {
				TR3sto.pscs.physicsWorld.removeRigidBody(object.userData.physicsBody);
			}
			object.geometry.dispose();
			if (object.material.isMaterial) {
				cleanMaterial(object.material);
			}
			else {
				// an array of materials
				for (var _i = 0, _a = object.material; _i < _a.length; _i++) {
					var material = _a[_i];
					cleanMaterial(material);
				}
			}
		});

		scene.remove.apply(scene, scene.children);

		while (scene.children.length > 0) {
			scene.remove(scene.children[0]);
		}

		canvasDest.remove();

	} else if (canvasDest) {
		var ctx = canvasDest.getContext("2d");
		ctx.clearRect(0, 0, canvasDest.width, canvasDest.height);
		canvasDest.remove();
	}

	stopAnimation();
	TWEEN.removeAll();
};

let frames = 0, prevTime = performance.now();
TR3sto.arrayPerform = new Array();
function TR3stoFPS() {
	frames++;
	const time = performance.now();

	if (time >= prevTime + 1000) {

		TR3sto.arrayPerform.unshift(Math.round((frames * 1000) / (time - prevTime)));
		if (TR3sto.arrayPerform.length > 2)
			TR3sto.arrayPerform.length = 3;

		frames = 0;
		prevTime = time;

	}
};

/**
 * recoge los datos del rendimiento FPS 'TR3sto.arrayPerform'
 * y lo evalúa para hacer un diagnóstico
 * y emitir un veredicto 'msg' del estado del rendimiento
 * @returns {string} - mensaje de status de rendimiento
 */
function testPerform() {
	let list = TR3sto.arrayPerform;
	let msg = 'medium';
	if (list.length < 1) { return 'notReady'; }

	let average = list.reduce((prev, curr) => prev + curr) / list.length;

	if (average < 7) { msg = 'crash'; }
	if (average < 20) { msg = 'bad'; }
	if (average > 30) { msg = 'good'; }
	//TR3sto.actualPerformTest = msg;
	console.log(msg);
	return msg;
};

/**
 * recoge los datos de rendimiento respecto de FPS 
 * y aplica acciones al respecto
 * @param {number} limited - numero de muestras que recogerá y tendrá en cuenta para el test
 */
let countTests = 0;
function managePerform(limited) {
	TR3sto.intervalTest = setInterval(function () {
		const testPrf = testPerform();
		if (testPrf == 'crash') {
			scene.visible = false;
			if (renderer.getPixelRatio() !== window.devicePixelRatio / 2) {
				renderer.setPixelRatio(window.devicePixelRatio / 2)
			}
			scene.environment = null;
		} else if (testPrf == 'bad') {
			scene.visible = true;
			scene.traverse((child) => {
				if (child && child.TR3 && child.TR3.onlyInGoodRender)
					child.visible = false;
				if (child.castShadow) {
					if (!child.sahdowsINIT) {
						child.sahdowsINIT = true;
						child.castShadowINIT = child.castShadow;
						child.receiveShadowINIT = child.receiveShadow;
					}
					child.castShadow = false;
					child.receiveShadow = false;
				}
			});
			/*if (renderer.getPixelRatio() !== window.devicePixelRatio) {
				renderer.setPixelRatio(window.devicePixelRatio)
			}*/
			scene.environment = null;
		} else if (testPrf == 'good') {
			scene.visible = true;
			scene.traverse((child) => {
				if (child && child.TR3 && child.TR3.onlyInGoodRender)
					child.visible = true;
				if (child.sahdowsINIT) {
					child.castShadow = child.castShadowINIT;
					child.receiveShadow = child.receiveShadowINIT;
				}
			});
			if (renderer.getPixelRatio() !== window.devicePixelRatio) {
				renderer.setPixelRatio(window.devicePixelRatio)
			}
			scene.environment = TR3sto.reflectionCube;
		}
		countTests++
		if (limited && countTests > limited) { clearInterval(TR3sto.intervalTest); }
	}, 1000);
}

/**
 * Podría para la animación respecto de la función nativa en window,
 * pero está comentado actualmente...
 */
function stopAnimation(e) {
	//window.cancelAnimationFrame(TR3sto.idAnimation);
};
//fin render.js