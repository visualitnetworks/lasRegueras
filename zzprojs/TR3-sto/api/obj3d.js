"use strict";
/**
 * Crea los distintos objetos para ser introducidos en la escena
 * El pbjeto principal (main) y secundarios -> onlyInGoodRender
 * @class obj3d
 */

/**
 * Crea el objeto que será identificado como principal
 * y ajusta los parámetros de la escena para contextualizar tamaños y visuales
 * @public
 * @param {string} obj3d - ruta al objeto a cargar. Ej './obj3d/scene.glb'
 * @param {object} params - define sus características principales
 * @returns {object} - devuelve el objeto creado para la escena
 */
TR3sto.loadMain3d = function async(obj3d, params) {

    if (params === undefined) params = {};
    let autoStart = params.hasOwnProperty("autoStart") ?
        params["autoStart"] : true;

    if (autoStart) {
        //document.getElementById('VRButton').style.display = 'block';
        document.getElementById('progress-bar').style.display = 'block';
        //document.getElementById('gui').style.display = 'block';
        document.getElementById('autoStartBtn').style.display = 'none';
    } else {
        document.getElementById('autoStartBtn').addEventListener('click', (ev) => {
            params.autoStart = true;
            TR3sto.loadMain3d(obj3d, params).then(function () { TR3sto.loadMain3dthen(); });
        });
        /*document.getElementById('VRButton').style.display = 'none';
        setTimeout(function () {
            document.getElementById('VRButton').style.display = 'none';
        }, 100);*/
        document.getElementById('progress-bar').style.display = 'none';
        //document.getElementById('gui').style.display = 'none';
        return new Promise(function () { });
    }

    return new Promise(function (resolve) {
        const loader = new GLTFLoader();

        // Optional: Provide a DRACOLoader instance to decode compressed mesh data
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath(TR3sto.src + 'THREE/libs/draco/');
        loader.setDRACOLoader(dracoLoader);

        loader.load(obj3d, async function (gltf) {

            if (params === undefined) params = {};

            let multypliPosCam = params.hasOwnProperty("multypliPosCam") ?
                params["multypliPosCam"] : 2;

            const rtnLoad = load3dunique(obj3d, gltf, params);

            const objGLTF = rtnLoad[0];
            const mixer = rtnLoad[1];

            const box3 = new THREE.BoxHelper(objGLTF, 0xffff00);
            box3.geometry.computeBoundingBox();
            box3.visible = false;
            scene.add(box3);
            box3.update();
            TR3sto.boxMainObj = box3;

            TR3sto.main3d = objGLTF;
            TR3sto.main3d.gltf = gltf;
            TR3sto.main3d.mixer = mixer;

            /*let boxxx = new THREE.Box3();
            boxxx.setFromObject(objGLTF, true);
            const MeshBoxxx = new THREE.Box3Helper(boxxx, 'crimson');
            scene.add(MeshBoxxx);*/

            let tweenTo = { x: -objGLTF.TR3.hitbox.x * multypliPosCam * .5, y: objGLTF.TR3.hitbox.y * multypliPosCam * .7, z: objGLTF.TR3.hitbox.z * multypliPosCam * .5 };
            if (TR3sto.camaraInit)
                tweenTo = { x: TR3sto.camaraInit.x, y: TR3sto.camaraInit.y, z: TR3sto.camaraInit.z };
            TR3sto.camaraInit = tweenTo;

            let orbitTo = new THREE.Vector3(0, objGLTF.TR3.hitbox.y / 2, 0);
            if (TR3sto.orbitInit)
                orbitTo.set(TR3sto.orbitInit.x, TR3sto.camaraInit.y, TR3sto.camaraInit.z);
            TR3sto.orbitInit = orbitTo;

            new TWEEN.Tween(camera.position) // Create a new tween that modifies 'coords'.
                .to(tweenTo, .5)
                .easing(TWEEN.Easing.Quadratic.InOut) // Use an easing function to make the animation smooth.
                .onUpdate(() => {
                    orbit.target.copy(orbitTo);
                    orbit.update();
                })
                .onComplete(() => {
                    orbit.autoRotate = true;

                    orbit.minDistance = 0;
                    orbit.maxDistance = TR3sto.sizeWrld;

                    camera.near = TR3sto.sizeWrld / (12 * 100);
                    camera.far = TR3sto.sizeWrld * 1.3;

                    const spherical = new THREE.Spherical();
                    spherical.set(TR3sto.sizeWrld / 24/*coinSize*/, Math.PI / 4, Math.PI / 4);
                    TR3sto.coin.position.setFromSpherical(spherical);

                    //loadSprites();
                })
                .start() // Start the tween immediately.

            if (TR3sto.main3d.mixer) {
                const arrAnim = new Array();
                for (let i = 0; i < TR3sto.main3d.gltf.animations.length; i++) {
                    arrAnim.push(TR3sto.main3d.gltf.animations[i].name || i);
                }
                arrAnim.push(' none ');

                TR3sto.panel.addMainObj.add({ Animation: arrAnim[0] }, 'Animation', arrAnim).onChange(function (type) {
                    if (TR3sto.main3d.mixer)
                        TR3sto.main3d.mixer.stopAllAction();

                    let action = new Object;
                    let flagAnim = false;

                    if (type == ' none ') {
                        TR3sto.main3d.mixer = false;
                        return false;
                    }

                    for (let i = 0; i < TR3sto.main3d.gltf.animations.length; i++) {
                        if (type == TR3sto.main3d.gltf.animations[i].name) {
                            action = mixer.clipAction(TR3sto.main3d.gltf.animations[i]);
                            flagAnim = true;
                        }
                    }

                    if (flagAnim == false) {
                        action = mixer.clipAction(TR3sto.main3d.gltf.animations[type]);
                    }

                    TR3sto.main3d.mixer = mixer;

                    if (TR3sto.main3d.AnimLoop) {
                        action.clampWhenFinished = false;
                        action.loop = THREE.LoopRepeat;
                    } else {
                        action.clampWhenFinished = true;
                        action.loop = THREE.LoopOnce;
                    }
                    action.play();
                });

                TR3sto.panel.addMainObj.add({ AnimLoop: false }, 'AnimLoop').onChange(function (loop) {
                    TR3sto.main3d.AnimLoop = loop;
                });
            }


            document.getElementById('progress-bar').style.display = 'none';
            document.getElementById('initImgTR3sro').style.display = 'none';
            //document.getElementById('VRButton').style.display = 'block';
            //document.getElementById('gui').style.display = 'block';

            createWorld(objGLTF.TR3.radius);
            resolve(objGLTF);
        },
            // called while loading is progressing
            function (xhr) {
                var progressBar = document.getElementById('progress-bar');
                var val = xhr.loaded / xhr.total * 100

                progressBar.value = val;
                progressBar.dataset.label = (val).toFixed(0) + '% Complete';

            },
            // called when loading has errors
            function (error) {

                console.log('An error happened');
                alert('GLTF load fail');

            });
    });
};

/**
 * Crea el objeto que será identificado como secundario -> onlyInGoodRender
 * @public
 * @param {string} obj3d - ruta al objeto a cargar. Ej './obj3d/scene.glb'
 * @param {object} params - define sus características principales
 * @returns {object} - devuelve el objeto creado para la escena
 */
TR3sto.loadObj3d = function (obj3d, params) {
    return new Promise(function (resolve) {
        const loader = new GLTFLoader();

        // Optional: Provide a DRACOLoader instance to decode compressed mesh data
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('./libs/draco/');
        loader.setDRACOLoader(dracoLoader);

        loader.load(obj3d, async function (gltf) {

            if (params === undefined) params = {};

            const rtnLoad = load3dunique(obj3d, gltf, params);

            const objGLTF = rtnLoad[0];
            objGLTF.TR3.onlyInGoodRender = true;
            objGLTF.visible = false;
            const mixer = rtnLoad[1];

            if (objGLTF.name == '') { objGLTF.name = 'name'; }
            for (let i = 0; i < TR3sto.obj3d.length; i++) {
                if (objGLTF.name == TR3sto.obj3d[i].name) {
                    objGLTF.name = objGLTF.name + i;
                }
            }

            let pnls = TR3sto.panel.addEnviroment.children;
            TR3sto.arrTransf.push(objGLTF.name);
            pnls[pnls.length - 1].$select.options[pnls[pnls.length - 1].$select.options.length] = new Option(objGLTF.name, objGLTF.name);

            if (mixer) {
                TR3sto.mixer.push(mixer);
            }

            TR3sto.obj3d.push(objGLTF);
            resolve(objGLTF);
        },

            // called while loading is progressing
            function (xhr) {
            },
            // called when loading has errors
            function (error) {
                console.log('An error happened');
                alert('GLTF load fail');
            });
    });
};

/**
 * Aplica los parámetros dados para acomodar el objeto a la escena
 * @param {string} obj3d - ruta al objeto a cargar. Ej './obj3d/scene.glb'
 * @param {object} gltf - objeto creado para la escena
 * @param {object} params - define sus características principales
 * @returns {Array} - devuelve el objeto y sus animaciones disponibles
 */
function load3dunique(obj3d, gltf, params) {
    if (params === undefined) params = {};

    let animation = params.hasOwnProperty("animation") ?
        params["animation"] : true;

    let pos = params.hasOwnProperty("pos") ?
        params["pos"] : new THREE.Vector3(0, 0, 0);

    let scale = params.hasOwnProperty("scale") ?
        params["scale"] : '';

    let quaternion = params.hasOwnProperty("quaternion") ?
        params["quaternion"] : '';

    let offsetY = params.hasOwnProperty("offsetY") ?
        params["offsetY"] : 0;

    let transform = params.hasOwnProperty("transform") ?
        params["transform"] : false;

    let multypliPosCam = params.hasOwnProperty("multypliPosCam") ?
        params["multypliPosCam"] : 2;

    let receiveShadow = params.hasOwnProperty("receiveShadow") ?
        params["receiveShadow"] : false;

    let castShadow = params.hasOwnProperty("castShadow") ?
        params["castShadow"] : false;

    let aRotate = params.hasOwnProperty("aRotate") ?
        params["aRotate"] : false;

    let slctItem = params.hasOwnProperty("slctItem") ?
        params["slctItem"] : false;

    let emissive = params.hasOwnProperty("emissive") ?
        params["emissive"] : false;

    let srcLoad = obj3d || false;

    let animateAction = params.hasOwnProperty("animateAction") ?
        params["animateAction"] : 0;

    let objGLTF = gltf.scene || gltf;

    if (scale.isVector3 == true) {
        objGLTF.scale.copy(scale);
    }

    if (quaternion.isQuaternion == true) {
        objGLTF.quaternion.copy(quaternion);
    }

    let box = getSizeObj(objGLTF);
    objGLTF.TR3 = new Object();
    objGLTF.TR3.box = box[0];
    objGLTF.TR3.hitbox = box[1];
    objGLTF.TR3.radius = box[2];
    objGLTF.TR3.center = box[3];

    objGLTF.TR3.srcLoad = srcLoad;
    objGLTF.TR3.aRotate = aRotate;
    objGLTF.TR3.animateAction = animateAction;

    if (scale == '' && (objGLTF.TR3.radius * objGLTF.scale.y > 100000
        || objGLTF.TR3.radius * objGLTF.scale.y < 3)) {
        let plusScale = 10;
        let rad = objGLTF.TR3.radius;
        while (rad * objGLTF.scale.y > 100000) {
            let sle = objGLTF.scale;
            objGLTF.scale.set(sle.x / plusScale, sle.y / plusScale, sle.z / plusScale);
        }
        while (rad * objGLTF.scale.y < 3) {
            let sle = objGLTF.scale;
            objGLTF.scale.set(sle.x * plusScale, sle.y * plusScale, sle.z * plusScale);
        }

        let box2 = getSizeObj(objGLTF);
        objGLTF.TR3.box = box2[0];
        objGLTF.TR3.hitbox = box2[1];
        objGLTF.TR3.radius = box2[2];
        objGLTF.TR3.center = box2[3];
    }

    if (Array.isArray(slctItem)) {
        objGLTF.TR3.slctItem = slctItem[0];
    } else if (slctItem) {
        objGLTF.TR3.slctItem = slctItem;
    }

    objGLTF.TR3.source = JSON.parse(JSON.stringify(params));

    // wait until the model can be added to the scene without blocking due to shader compilations
    //await renderer.compileAsync(model, camera, scene);

    scene.add(objGLTF);
    if (transform) {
        control.attach(objGLTF);
        const gizmo = control.getHelper();
        scene.add(gizmo);
    }

    objGLTF.traverse(function (child) {

        if (child.material && child.material.envMap)
            child.material.envMap = TR3sto.reflectionCube;

        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = false;
        }

    });

    if (emissive)
        objGLTF.traverse(function (child) {

            if (child.isMesh && child.material.emissive) {
                var val = emissive;
                child.material.emissive.r = val;
                child.material.emissive.g = val;
                child.material.emissive.b = val;
            }

        });

    if (pos == 'center') {
        objGLTF.position.x += - objGLTF.TR3.center.x;
        objGLTF.position.y += - objGLTF.TR3.center.y + objGLTF.TR3.hitbox.y / 2 - offsetY;
        objGLTF.position.z += - objGLTF.TR3.center.z;
    } else if (pos.isVector3 == true) {
        objGLTF.position.copy(pos);
    }

    let mixer = false;
    if (gltf.animations && gltf.animations.length > 0 && animation) {
        mixer = new THREE.AnimationMixer(objGLTF);
        mixer.clipAction(gltf.animations[animateAction]).play();
    }

    return [objGLTF, mixer];

};

/**
 * Devielve el tamaño del objeto
 * @param {object} objGeom - devuelve el objeto creado para la escena
 * @returns {Array} - diferentes formas de comprender su tamaño
 */
function getSizeObj(objGeom) {
    var hitbox = new THREE.Vector3();

    var box = new THREE.Box3().setFromObject(objGeom/*,true*/);
    box.getSize(hitbox);
    var sphere = box.getBoundingSphere(new THREE.Sphere());

    var center = box.getCenter(new THREE.Vector3());

    return [box, hitbox, sphere.radius, center];
};
//fin obj3d.js