"use strict";
var TR3cfg =
{
	id: "lasRegueras",
	magnification: 1.5,
	tweenDist: 50,
	tweenTime: 2000,
	tweenSpeed: 15,
	distTiles: 1000,

	languaje: {
		set: 'ES',
		insert: false,
		includes: ['ES', 'EN', 'FR', 'PT'],
	},

	Text2map3d: [],
	objText2map: [],
	editionMode: false,

	sprite: {
		offsetZsprite: 10,
		fontSize: 5,
	},

	tileSet: {
		row: 2,
		col: 2
	},

	arrTilesPreload: ['1-1'],

	visibleGridTiles: false,//peta con los POIs

	loc: {
		//lookAt: [40, 20],
		lookCustom: {
			pos: {
				"x": -92.64790426898175,
				"y": 95.19032766893618,
				"z": 31.383654340179643
			},
			tgt: {
				"x": -19.460621793298554,
				"y": -17.195259828315347,
				"z": 4.949486690908167
			}
		},
		pos: { h: geoDataTR3.center[0], v: geoDataTR3.center[1], z: 14 }
	},

	lineLerpOffsetY: 2,
	//mineColor: 'rgb(104, 229, 27)',
	pathProjDir: formURL.zzProj,
	pathProjImgs: formURL.zzProj + 'skin/imgs/',
	mode: 'tiles/',
	imgType: '.jpeg'
};
TR3cfg.imgType = formURL.imgType;
if (formURL.mode) { TR3cfg.mode = 'tiles' + formURL.mode + '/'; }
TR3cfg.mineColor = '#466F29';
document.documentElement.style.setProperty('--mineColor', TR3cfg.mineColor);
var titleTrail = 'Las Regueras - Villa Romana';

document.title = titleTrail;
//document.title.setAttribute("idiomax", 'globals_title');
document.querySelector('meta[name="description"]').setAttribute("content", titleTrail);

document.querySelector('meta[property="twitter:description"]').setAttribute("content", titleTrail);
document.querySelector('meta[property="og:description"]').setAttribute("content", titleTrail);
document.querySelector('meta[property="og:site_name"]').setAttribute("content", titleTrail);
document.querySelector('meta[property="og:title"]').setAttribute("content", titleTrail);

document.getElementById('contIntro').setAttribute("style", "background: linear-gradient(180deg, rgba(0, 0, 0, 0) 73.58%, rgba(0, 0, 0, 0.74) 100%), \
        url(" + TR3cfg.pathProjDir + "skin/intro.jpg) no-repeat center/cover rgb(0 0 0) !important");
document.getElementById('logoIntro').src = TR3cfg.pathProjDir + "skin/logo.png";
document.getElementById('logoIntro').style.content = "url('')";

document.getElementById('textContIntro').setAttribute("idiomax", 'globals_text');

//document.getElementById('imagePatreon').src = TR3cfg.pathProjDir + "skin/" + data[0][0].patreons;

TR3cfg.followRabbitCam = { type: 'adaptative', x: 0, y: TR3cfg.tweenDist, z: 0, framesDist: 600 };
//TR3cfg.followRabbitCam = {type: 'lateral', x: -TR3cfg.tweenDist, y: TR3cfg.tweenDist, z: TR3cfg.tweenDist, framesDist: 400 /* *0 GTA Mode */};

var tracksTrail = new Array(2);

if (formURL.editor) { document.getElementById('adminLogin').style.display = "block"; }

if (isMobile()) {
	TR3cfg.mobile = true;
	document.getElementById('contIntro').setAttribute("style", "background: linear-gradient(180deg, rgba(0, 0, 0, 0) 73.58%, rgba(0, 0, 0, 0.74) 100%), url(" + TR3cfg.pathProjDir + "skin/intro-mvl.jpg) no-repeat center/cover rgb(0 0 0) !important");
}
if (isiOS()) {
	TR3cfg.isiOS = true;
}

function preload_image(im_url) {
	let img = new Image();
	img.src = im_url;
}
//preload_image("source/obj3d/intro.jpg");

TR3cfg.mainTexturesLoaded = false;
TR3cfg.attTextTiles = [];
var contPretiles = 0;
function preload_imageTiles(im_url) {
	var img = new Image();
	img.crossOrigin = 'Anonymous';
	img.onload = function () {
		let pathParts = img.src.split("/");
		let file = pathParts[pathParts.length - 1];
		let name = file.split('.')[0];

		TR3cfg.attTextTiles.push({ img: img, name: name });
		if (TR3cfg.attTextTiles.length == contPretiles) { TR3cfg.mainTexturesLoaded = true }
	}
	img.src = im_url;
};

function preload_tiles() {
	var arrTiles = TR3cfg.arrTilesPreload;
	for (var i = 0; i < arrTiles.length; i++) {
		preload_imageTiles(TR3cfg.pathProjDir + TR3cfg.mode + arrTiles[i] + TR3cfg.imgType);
		contPretiles++;
	}
};
preload_tiles();

TR3cfg.myturn = false;
TR3cfg.progressTimer = setInterval(function () {
	if (TR3cfg.myturn) {
		TR3cfg.myturn.children[1].value++;
		var currentProgess = TR3cfg.myturn.children[1].value;
		handleMyturnBar(currentProgess);
		if (currentProgess > 69) {
			clearInterval(TR3cfg.progressTimer);
		}
	}
}, 100);

TR3cfg.progressTimerSub = setInterval(function () {
	if (TR3cfg.myturn) {
		TR3cfg.myturn.children[1].value += 0.1;
		var currentProgess = TR3cfg.myturn.children[1].value;
		handleMyturnBar(currentProgess);
		if (currentProgess > 97) {
			clearInterval(TR3cfg.progressTimerSub);
		}
	}
}, 2000);

if (isMobile()) {
	TR3cfg.mobile = true;
}

function setItems3D() {
	TR3cfg.trails = new Array();
	/*TRAILS-->
	TR3cfg.trails = new Array();
	for (let i = 0; i < tracksTrail.length; i++) {
		TR3cfg.trail({
			src: TR3cfg.pathProjDir + "data/" + tracksTrail[i].gpx + ".glb",
			pos: [
				TR3.centerZone[0],
				TR3.centerZone[1],
				TR3.zMed
			],
			extraData: tracksTrail[i].gpx,
			//aRotate: -1.5,
			slctItem: false
		}, tracksTrail[i].arrWayPois, TR3cfg.mineColor).then(function (line) {
			TR3cfg.trails.push(line);
			line.lerp.visible = false;
			line.lerp.position.y = 10000;
			if (line.path.name == tracksTrail[0].gpx) {
				TR3cfg.LineRabbit = line.path;
				line.lerp.visible = true;
				line.lerp.position.y = TR3cfg.lineLerpOffsetY || 3;
				TR3cfg.rabbitLight.posStart = line.lerp.startRabit;
				TR3cfg.rabbitLight.position.copy(line.lerp.startRabit);
				TR3.oscillate.push([TR3cfg.rabbitLight, 5, 25, TR3cfg.rabbitLight.position.y]);

				var dist = TR3.dataLineAtIndex(TR3cfg.LineRabbit, TR3cfg.LineRabbit.geometry.getAttribute('position').count - 1);
				trackChart.setChart(dist);
			}
		});
	}
	<--TRAILS*/

	/*var flag = {
		src: "source/obj3d/flag.glb",
		scale: [4,4,4],
		pos: [-643353.719,5394454.003,false],
		aRotate: -1.5,
		slctItem: false
	};

	TR3.loadFile(flag).then(function (obj) {

		let obj3D = obj[0].scene;
		TR3.scene.add(obj3D);
		//shadow.visible = true;
	});[-662736.118,5375535.648,137.01],*/
	var pin3dAndayon = {
		src: "source/obj3d/pin3d.glb",
		scale: [.3, .3, .3],
		pos: [-662736.118, 5375535.648, 142],
		extraData: ['<img src=skin/andayon.jpg alt="Mosaico de Andayón" title="Mosaico de Andayón"></div>\
	<h2>Mosaico de Andayón</h2>\
	<center>\
	<p>\
		En 1958 durante los trabajos de ampliación de la carretera que une La Estaca con Andallón, los vecinos y operarios localizaron restos constructivos entre los que destacaba el mosaico romano que documentó José Manuel González. En 1961 la Comisión de Monumentos le pidió al arqueólogo Francisco Jordá que realizase una excavación para la extracción del pavimento y su posterior conducción al Museo Arqueológico provincial.\
	<p/>\
	</center>', {
				tgt: {
					"x": -9.222649913354449,
					"y": -16.429401174004823,
					"z": -15.248098182029675
				}, pos: {
					"x": 32.14229882899943,
					"y": 51.892270113085516,
					"z": -14.499097467821876
				}
			}],
		//aRotate: -1.5,
		slctItem: true,

	};

	TR3.loadFile(pin3dAndayon).then(function (obj) {

		let obj3D = obj[0].scene;
		//obj3D.visible = false;

		obj3D.traverse(function (child) {
			if (child.isMesh && child.material) {
				if (child.name !== 'Cylinder1') {
					child.material = new THREE.MeshBasicMaterial({ color: new THREE.Color('rgba(41, 169, 224, 1)') });
				} else {
					//child.material.map = 'source/obj3d/camera.png'
					const texture = new THREE.TextureLoader().load('source/icons/info.jpg');
					//texture.needsUpdate = true;
					//texture.minFilter = THREE.LinearFilter;
					child.material = new THREE.MeshBasicMaterial({ map: texture });
				}
			}
		});

		TR3.scene.add(obj3D);
		TR3.lookAtXY.push(obj3D);
	});

	var mosaico = {
		src: "source/obj3d/mosaico.glb",
		scale: [1, 1, 1],
		pos: [
			-662737.21,5375496.30,136.00
		],
		//aRotate: -1.5,
		slctItem: false
	};

	TR3cfg.pct2425HD = 0; TR3cfg.pctMosaicoHD = 0;

	TR3.loadFile(mosaico).then(function (obj) {

		let obj3Dmosaico = obj[0].scene;

		//obj3D.scale.set(10.0000, 10.0000, 10.0000);
		/*obj3Dmosaico.quaternion.set(
			0.015127178660672105,
			-6.122533361137797e-17,
			0.9998855776866512,
			9.26272546346112e-19
		)*/

		obj3Dmosaico.traverse(function (child) {
			if (child instanceof THREE.Mesh) {
				var prevMaterial = child.material;
				child.material = THREE.MeshBasicMaterial.prototype.copy.call(new THREE.MeshBasicMaterial({}), prevMaterial);
				child.material.side = THREE.DoubleSide;
			}
		})

		TR3.loaderGLTF.load("source/obj3d/mosaicoHD.glb", function (gltf) {

			TR3.scene.add(gltf.scene);

			gltf.scene.position.copy(obj3Dmosaico.position)

			//gltf.scene.position.set(-11.756497326151784, -17.46624889248117, 24.061138614080846);

			var box = TR3.getSizeObj(gltf.scene);
			gltf.scene.TR3 = new Object();
			gltf.scene.TR3.box = box[3];
			gltf.scene.TR3.hitbox = box[4];
			gltf.scene.TR3.radius = box[5];

			gltf.scene.traverse(function (child) {
				if (child instanceof THREE.Mesh) {
					var prevMaterial = child.material;
					child.material = THREE.MeshBasicMaterial.prototype.copy.call(new THREE.MeshBasicMaterial({}), prevMaterial);
					child.material.side = THREE.DoubleSide;
					//if(child.material.color.r != 1){child.material.color = new THREE.Color('#333')}
				}
			})
			obj3Dmosaico.visible = false;
			TR3.vGeom.obj3d.push(gltf);

		}, function (xhr) {

			TR3cfg.pctMosaicoHD = Math.round(xhr.loaded / xhr.total * 100) / 2;
			document.getElementById("myHDturn").getElementsByTagName("progress")[0].setAttribute('value', TR3cfg.pct2425HD + TR3cfg.pctMosaicoHD)
			document.getElementById("myHDturn").getElementsByTagName("p")[0].innerText = 'Loading HD ' + (TR3cfg.pct2425HD + TR3cfg.pctMosaicoHD).toFixed(0) + '%';
			if ((TR3cfg.pct2425HD + TR3cfg.pctMosaicoHD) > 96) {
				document.getElementById("myHDturn").style.visibility = 'hidden';
				ditanceTiles();
				setTimeout(() => {
					ditanceTiles();
					/*if (formURL.lookToward != false && formURL.lookToward.length > 5) {
						var lAt = formURL.lookToward
						TR3.camera.position.set(lAt[0], lAt[1], lAt[2]);
						TR3.controls.target.set(lAt[3], lAt[4], lAt[5]);
					} else {
						//var lookAt = TR3cfg.loc.lookAt;
						//TR3.setLookAtini(lookAt[0], lookAt[1]);
						var lookCtmP = TR3cfg.loc.lookCustom.pos;
						TR3.camera.position.set(lookCtmP.x, lookCtmP.y, lookCtmP.z);
						var lookCtmT = TR3cfg.loc.lookCustom.tgt;
						TR3.controls.target.set(lookCtmT.x, lookCtmT.y, lookCtmT.z);
					}
		
					setInterval(() => {
						var pos = TR3.camera.position;
						var raycaster = TR3.getRayCaster(false);
						var inter = TR3.getIntersect(raycaster, [TR3cfg.tileGroup]);
						var tgt = new THREE.Vector3();
						if(inter && inter[0] && inter[0][0] && inter[0][0].point) {
							tgt = inter[0][0].point;
						} else {
							tgt = TR3.controls.target;
						}
		
						spams.set("looktoward", [pos.x, pos.y, pos.z, tgt.x, tgt.y, tgt.z].map(function (each_element) {
							return Number(each_element.toFixed());
						}));
		
						window.history.replaceState({}, '', `${location.pathname}?${spams.toString()}`);
					}, 2000);*/
				}, 1000);
				
			}
		}, function (error) {

			size3dObj.innerHTML = 'error: ' + error.message;
			console.log(error);
			TR3.unlock3d('obj3d');
		});

		TR3.scene.add(obj3Dmosaico);
		TR3.vGeom.obj3d.push(obj3Dmosaico);

		var pin3dMosaico = {
			src: "source/obj3d/pin3d.glb",
			scale: [.3, .3, .3],
			pos: [0, 0, 0],
			extraData: ['<img src=skin/mosaico.jpg alt="Mosaico principal" title="Mosaico principal"></div>\
	<h2>Edificio principal</h2>\
	<p>\
		Las excavaciones han permitido recuperar parte de la planta del edificio principal de esta villa destacando por su excelente estado de conservación. Se estima que el edificio ocupa una superficie de más de 900 m2, de los que apenas se han excavado una pequeña parte pero con excelentes resultados.\
	</p>\
	<div class="popup-actions">\
	<button type="button" class="dlgButton dlgButton--detail" title="Ver detalle" aria-label="Ver detalle">\
		<svg class="white-icon" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">\
<path d="M16.25 13.125V15.3663L13.125 12.2413V8.125C13.1249 8.00896 13.0926 7.89523 13.0315 7.79655C12.9705 7.69786 12.8832 7.61812 12.7794 7.56625L9.375 5.86312V2.3925L10.9913 4.00875L11.875 3.125L8.75 0L5.625 3.125L6.50875 4.00875L8.125 2.3925V5.86375L4.72063 7.56562C4.61673 7.61754 4.52936 7.69738 4.46831 7.79619C4.40726 7.89499 4.37495 8.00885 4.375 8.125V12.2413L1.25 15.3663V13.125H0V17.5H4.375V16.25H2.13375L5.12312 13.2606L8.47062 14.9344C8.55737 14.9777 8.65302 15.0003 8.75 15.0003C8.84698 15.0003 8.94263 14.9777 9.02938 14.9344L12.3769 13.2606L15.3663 16.25H13.125V17.5H17.5V13.125H16.25ZM8.125 13.3638L5.625 12.1138V9.13625L8.125 10.3862V13.3638ZM8.75 9.30125L6.3975 8.125L8.75 6.94875L11.1025 8.125L8.75 9.30125ZM11.875 12.1138L9.375 13.3638V10.3862L11.875 9.13625V12.1138Z" fill="currentColor"/>\
</svg>\
		<span idiomax="detailBtn" id="activeLoc">Ver detalle</span>\
	</button>\
	</div>', {
					tgt: {
						"x": -5.751232900807722,
						"y": -16.746672525401692,
						"z": 24.094849234446794
					}, pos: {
						"x": -13.34150902477248,
						"y": -9.932840298548403,
						"z": 24.70960581361029
					}
				}],
			//aRotate: -1.5,
			slctItem: true,

		};

		TR3.loadFile(pin3dMosaico).then(function (obj) {

			let obj3D = obj[0].scene;
			//obj3D.visible = false;

			obj3D.position.x = obj3Dmosaico.position.x;
			obj3D.position.y = obj3Dmosaico.position.y + 7;
			obj3D.position.z = obj3Dmosaico.position.z;

			obj3D.traverse(function (child) {
				if (child.isMesh && child.material) {
					if (child.name !== 'Cylinder1') {
						child.material = new THREE.MeshBasicMaterial({ color: new THREE.Color('rgba(41, 169, 224, 1)') });
					} else {
						//child.material.map = 'source/obj3d/camera.png'
						const texture = new THREE.TextureLoader().load('source/icons/info.jpg');
						//texture.needsUpdate = true;
						//texture.minFilter = THREE.LinearFilter;
						child.material = new THREE.MeshBasicMaterial({ map: texture });
					}
				}
			});

			TR3.scene.add(obj3D);
			TR3.lookAtXY.push(obj3D);
		});
	});

	var obj2425 = {
		src: "source/obj3d/2425.glb",
		scale: [1, 1, 1],
		pos: [
			-662763.448114627,
			5375514.371673769,
			134.90
		],
		//aRotate: -1.5,
		slctItem: false
	};

	TR3.loadFile(obj2425).then(function (obj) {

		let obj3D_2425 = obj[0].scene;

		//obj3D_2425.scale.set(0.09, 0.05, 0.09);
		//obj3D_2425.rotation.set(-0.0248, 0.0000, 0.0000);
		//obj3D.quaternion.set(-0.0124, 0.0000, 0.0000, 0.9999);
		//obj3D.material.depthTest =  false;
		//obj3D.renderOrder = 1;

		obj3D_2425.traverse(function (child) {
			if (child instanceof THREE.Mesh) {
				var prevMaterial = child.material;
				child.material = THREE.MeshBasicMaterial.prototype.copy.call(new THREE.MeshBasicMaterial({}), prevMaterial);
				child.material.side = THREE.DoubleSide;
				//if(child.material.color.r != 1){child.material.color = new THREE.Color('#333')}
			}
		})

		TR3.loaderGLTF.load("source/obj3d/2425HD.glb", function (gltf) {

			TR3.scene.add(gltf.scene);

			gltf.scene.position.copy(obj3D_2425.position)

			//gltf.scene.position.set(-36.17277093254961, -18.790287739337806, 6.188464065082371);

			var box = TR3.getSizeObj(gltf.scene);
			gltf.scene.TR3 = new Object();
			gltf.scene.TR3.box = box[3];
			gltf.scene.TR3.hitbox = box[4];
			gltf.scene.TR3.radius = box[5];
			//gltf.scene.scale.addScalar(1.25);

			gltf.scene.traverse(function (child) {
				if (child instanceof THREE.Mesh) {
					var prevMaterial = child.material;
					child.material = THREE.MeshBasicMaterial.prototype.copy.call(new THREE.MeshBasicMaterial({}), prevMaterial);
					child.material.side = THREE.DoubleSide;
					//if(child.material.color.r != 1){child.material.color = new THREE.Color('#333')}
				}
			})
			obj3D_2425.visible = false;
			TR3.vGeom.obj3d.push(gltf);

		}, function (xhr) {

			TR3cfg.pct2425HD = Math.round(xhr.loaded / xhr.total * 100) / 2;
			document.getElementById("myHDturn").getElementsByTagName("progress")[0].setAttribute('value', TR3cfg.pct2425HD + TR3cfg.pctMosaicoHD)
			document.getElementById("myHDturn").getElementsByTagName("p")[0].innerText = 'Loading HD ' + (TR3cfg.pct2425HD + TR3cfg.pctMosaicoHD).toFixed(0) + '%';
			if ((TR3cfg.pct2425HD + TR3cfg.pctMosaicoHD) > 96) {
				document.getElementById("myHDturn").style.visibility = 'hidden';
			}
		}, function (error) {

			size3dObj.innerHTML = 'error: ' + error.message;
			console.log(error);
			TR3.unlock3d('obj3d');
		});

		TR3.scene.add(obj3D_2425);
		TR3.vGeom.obj3d.push(obj3D_2425);
		var pin3d2425 = {
			src: "source/obj3d/pin3d.glb",
			scale: [.3, .3, .3],
			pos: [-662762.809, 5375514.001, false],
			extraData: ['<img src=skin/2425.jpg alt="Imagen del recorrido" title="Imagen del recorrido"></div>\
	<h2>Edificio auxiliar</h2>\
	<p>\
		Gracias a los análisis sabemos que se llegó a forjar hierro. Además el segundo sondeo realizado, permitió descubrir dos nuevas habitaciones y el sistema de evacuación de agua de la casa principal, siendo uno de los descubrimientos de ingeniería romana más singulares de los excavados hasta ahora.\
	</p>\
	<div class="popup-actions">\
	<button type="button" class="dlgButton dlgButton--detail" title="Ver detalle" aria-label="Ver detalle">\
		<svg class="white-icon" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">\
<path d="M16.25 13.125V15.3663L13.125 12.2413V8.125C13.1249 8.00896 13.0926 7.89523 13.0315 7.79655C12.9705 7.69786 12.8832 7.61812 12.7794 7.56625L9.375 5.86312V2.3925L10.9913 4.00875L11.875 3.125L8.75 0L5.625 3.125L6.50875 4.00875L8.125 2.3925V5.86375L4.72063 7.56562C4.61673 7.61754 4.52936 7.69738 4.46831 7.79619C4.40726 7.89499 4.37495 8.00885 4.375 8.125V12.2413L1.25 15.3663V13.125H0V17.5H4.375V16.25H2.13375L5.12312 13.2606L8.47062 14.9344C8.55737 14.9777 8.65302 15.0003 8.75 15.0003C8.84698 15.0003 8.94263 14.9777 9.02938 14.9344L12.3769 13.2606L15.3663 16.25H13.125V17.5H17.5V13.125H16.25ZM8.125 13.3638L5.625 12.1138V9.13625L8.125 10.3862V13.3638ZM8.75 9.30125L6.3975 8.125L8.75 6.94875L11.1025 8.125L8.75 9.30125ZM11.875 12.1138L9.375 13.3638V10.3862L11.875 9.13625V12.1138Z" fill="currentColor"/>\
</svg>\
		<span idiomax="detailBtn" id="activeLoc">Ver detalle</span>\
	</button>\
	</div>', {
					tgt: {
						"x": -37.52986812617507,
						"y": -18.56034270208866,
						"z": 9.419070924670397
					}, pos: {
						"x": -30.435626897960013,
						"y": -8.673935901038405,
						"z": 3.511206043384804
					}
				}],
			//aRotate: -1.5,
			slctItem: true,

		};

		TR3.loadFile(pin3d2425).then(function (obj) {

			let obj3D = obj[0].scene;
			//obj3D.visible = false;

			obj3D.position.x = obj3D_2425.position.x;
			obj3D.position.y = obj3D_2425.position.y + 7;
			obj3D.position.z = obj3D_2425.position.z;

			obj3D.traverse(function (child) {
				if (child.isMesh && child.material) {
					if (child.name !== 'Cylinder1') {
						child.material = new THREE.MeshBasicMaterial({ color: new THREE.Color('rgba(41, 169, 224, 1)') });
					} else {
						//child.material.map = 'source/obj3d/camera.png'
						const texture = new THREE.TextureLoader().load('source/icons/info.jpg');
						//texture.needsUpdate = true;
						//texture.minFilter = THREE.LinearFilter;
						child.material = new THREE.MeshBasicMaterial({ map: texture });
					}
				}
			});
			TR3.scene.add(obj3D);
			TR3.lookAtXY.push(obj3D);

		});
	});

	/*var roman = {
						src: "source/obj3d/roman.glb",
					scale: [1.3, 1.3, 1.3],
					pos: [-662746.264, 5375492.758, false],
					//aRotate: -1.5,
					slctItem: false,

	};

					TR3.loadFile(roman).then(function (obj) {

						let obj3D = obj[0].scene;

		setTimeout(() => {
			var raycaster = TR3.getRayCaster([obj3D.position, new THREE.Vector3(0, -1, 0)], 'point-vector');
					var inter = raycaster.intersectObject(TR3cfg.tileGroup, true)[0];
					if (inter.point) {
						obj3D.position.y = inter.point.y - obj3D.TR3.box.min.y * obj3D.scale.y;
			}
		}, 2000);

		setTimeout(() => {
			var raycaster = TR3.getRayCaster([obj3D.position, new THREE.Vector3(0, -1, 0)], 'point-vector');
					var inter = raycaster.intersectObject(TR3cfg.tileGroup, true)[0];
					if (inter.point) {
						obj3D.position.y = inter.point.y - obj3D.TR3.box.min.y * obj3D.scale.y;
			}
		}, 7000);

					TR3.scene.add(obj3D);
					TR3.lookAtXY.push(obj3D);
					//TR3.vGeom.obj3d.push(obj3D);
					TR3.scene.getObjectByName("ambientLight").intensity = 3;
					TR3.scene.getObjectByName("hemisphericLight").intensity = 3;
	});*/

	//-->TILES
	var rowPatch = TR3cfg.tileSet.row;
	var colPatch = TR3cfg.tileSet.col;

	rowPatch++;//+1 because 0 exist!
	colPatch++;//+1 because 0 exist!
	var contTiles = -1;
	var once = true;
	TR3cfg.tileGroup = new THREE.Group();
	TR3.mesh.scale.set(1, 1, 1);
	TR3cfg.tileGroup.scale.copy(TR3.mesh.scale);
	TR3.scene.add(TR3cfg.tileGroup);
	TR3.meshAUX = TR3cfg.tileGroup;
	for (var i = 0; i < rowPatch; i++) {
		for (var j = 0; j < colPatch; j++) {
			fetch(TR3cfg.pathProjDir + TR3cfg.mode + i + "-" + j + ".json")
				.then((res) => {
					if (!res.ok) {
						console.log(`HTTP json error! Status: ${res.status}`);
						return false;
					}
					return res.json();
				})
				.then((data) => {
					var geom = new THREE.PlaneGeometry(data.size.w, data.size.h, data.size.segW - 1, data.size.segH - 1);
					var coord = TR3.coordM2T(data.center[0], data.center[1], TR3.zMed, true);
					var tile = new THREE.Mesh(geom.rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({}));
					tile.position.set(coord[0], coord[1], coord[2]);
					tile.name = 'sysTile_' + data.name;
					tile.userData = { name: data.name };
					tile.visible = false;
					TR3cfg.tileGroup.add(tile);

					if (TR3cfg.visibleGridTiles) {
						//-->watch tiles
						var TXTpms = {
							text: data.name,
							font: { fontFace: "Arial", bold: false },
							pos: { x: 300, y: 0, z: 300, inv: true },
							center: true
						};
						var textSprite = TR3.makeTextSprite(TXTpms);
						tile.add(textSprite);

						const object = new THREE.Mesh(geom, new THREE.MeshBasicMaterial(0xff0000));
						const box = new THREE.BoxHelper(object, 0xffff00);
						tile.add(box);
						//<--watch tiles*/
					}

					var vertices = tile.geometry.getAttribute("position");
					for (var k = 0; k < vertices.count; k++) {
						vertices.setY(k, data.z[k] - TR3.zMed);
					}

					contTiles++;
					if (contTiles >= Math.floor(rowPatch * colPatch / 2) && once) {
						once = false;
						loadTextMainTiles();
					}

				})
		}
	}


};

var intervalTiles;
function loadTextMainTiles() {
	var contArrMainTiles = 0;
	intervalTiles = setInterval(function () {
		if (!TR3cfg.tileGroup.getObjectByName("sysTile_0-0") || TR3cfg.mainTexturesLoaded == false) { console.log('no_tiles_yet'); return false; }
		clearInterval(intervalTiles);
		for (var i = 0; i < TR3cfg.attTextTiles.length; i++) {

			var texture = new THREE.Texture(TR3cfg.attTextTiles[i].img);
			texture.colorSpace = THREE.SRGBColorSpace;
			texture.minFilter = THREE.LinearFilter;
			texture.flipY = true;

			texture.onUpdate = function () {
				console.log("texture updated");
			};
			var sysTile_ = TR3cfg.tileGroup.getObjectByName("sysTile_" + TR3cfg.attTextTiles[i].name);
			if (sysTile_ && sysTile_.material.map) sysTile_.material.map = texture;
			texture.needsUpdate = true;

			contArrMainTiles++;

			var currentProgess = TR3cfg.myturn.children[1].value++;
			handleMyturnBar(currentProgess);

			if (contArrMainTiles == TR3cfg.attTextTiles.length) {
				ditanceTiles();
				finshingMyTurn(); loadTextOtheriles();
			}
		}
	}, 100);
};

function loadTextOtheriles() {
	/*var rowPatch = 7;
	var colPatch = 12;
	rowPatch++;//+1 because 0 exist!
	colPatch++;//+1 because 0 exist!
	for (var i = 0; i < rowPatch; i++) {
		for (var j = 0; j < colPatch; j++) {
			var tileMapI = TR3cfg.tileGroup.getObjectByName("sysTile_" + i + "-" + j);
			if (tileMapI.material.map == null)
				tileMapI.material.map = new THREE.TextureLoader().load(TR3cfg.pathProjTiles + i + "-" + j + ".png", function (tex) {
					tex.flipY = true;
				});
		}
	}*/
};

function ditanceTiles() {
	//setInterval(function () {
	if (!TR3cfg.tileGroup) { return false; }
	var refernce = TR3.controls.target;

	var raycaster = TR3.getRayCaster(false);
	var inter = TR3.getIntersect(raycaster, [TR3.mesh]);
	if (inter.length > 0 && inter[0][0] && inter[0][0].point) {
		refernce = inter[0][0].point;
	}

	for (var i = 0; i < TR3cfg.tileGroup.children.length; i++) {
		var tileI = TR3cfg.tileGroup.children[i];
		var tilePoint = tileI.position;

		var dist = tilePoint.distanceTo(refernce);
		var visible = false;
		if (dist < TR3cfg.distTiles) {
			visible = true;
			if (tileI.userData.name && tileI.material.map == null) {
				tileI.material.wireframe = true;
				setWFfalse(tileI, TR3cfg.intTexTime || 0.01);
				TR3cfg.starTextTime = performance.now();
				tileI.material.map = new THREE.TextureLoader().load(TR3cfg.pathProjDir + TR3cfg.mode + tileI.userData.name + TR3cfg.imgType, function (tex) {
					tex.flipY = true;
					tex.colorSpace = THREE.SRGBColorSpace;
					TR3cfg.intTexTime = performance.now() - TR3cfg.starTextTime;
				});
			}
		}
		tileI.visible = visible;
		//tileI.material.wireframe = true;
	}
	//}, 1000);
}

function setWFfalse(tile2wfFalse, time) {
	setTimeout(function () {
		tile2wfFalse.material.wireframe = false;
	}, time * 1.1);
}

function finshingMyTurn() {
	clearInterval(TR3cfg.progressTimer);
	var progressTimer2 = setInterval(function () {
		var currentProgess = TR3cfg.myturn.children[1].value += 10;
		handleMyturnBar(currentProgess);
		if (currentProgess > 97) {
			clearInterval(progressTimer2);
		}
	}, 100);
};

function handleMyturnBar(currP) {
	var currentProgess = currP.toFixed(1);
	var textHTML = TR3cfg.myturn.children[0];

	document.documentElement.style.setProperty("--display-progressBar", "block");

	if (currentProgess > 97) {
		textHTML.innerHTML = '<span idiomax="startNow" id="startNow" style="display: contents">' + TR3cfg.idiomax.text.startNow.message[TR3cfg.idiomax.actual] + '</span>';
		setTimeout(function () { TR3cfg.myturn.click(); }, 500);
	} else {
		if (TR3cfg.idiomax.actual)
			textHTML.innerHTML = '<span idiomax="loading" id="loading" style="display: contents">' + TR3cfg.idiomax.text.loading.message[TR3cfg.idiomax.actual] + ' </span>' + currentProgess.toString().replace('.', ',') + '%';
	}
};