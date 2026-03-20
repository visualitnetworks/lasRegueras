"use strict";
TR3cfg.trail = async function (trail, pushpin, colorLine, double, minDistanceCone) {
    return new Promise(function (resolve) {
        var lineOl = trail;
        var doubleline = 1;
        var lineLoaded = { path: false, lerp: false };
        if (double) { doubleline = double }
        if (!minDistanceCone) { minDistanceCone = 500 }

        TR3.loadFile(lineOl).then(function (obj) {
            //obj[0].scene.position.set(0, 0, 0);

            var lineOLpath = obj[0].scene.children[0];
            lineOLpath.name = obj[0].scene.TR3.extraData;

            lineLoaded.path = lineOLpath;
            if (lineLoaded.path && lineLoaded.lerp) {
                resolve(lineLoaded);
            }
        });

        var lerpLineOl = JSON.parse(JSON.stringify(lineOl));
        lerpLineOl.extraData += 'Lerp';
        if(formURL.mode == 'tvmode'){lerpLineOl.extraData += 'TV';}

        lerpLineOl.src = TR3cfg.pathProjDir + "data/" + lerpLineOl.extraData + ".glb";
        TR3.loadFile(lerpLineOl).then(function (obj) {
            //obj[0].scene.position.set(0, 0, 0);
            /*obj[0].scene.children[0].material = new THREE.LineBasicMaterial();
            obj[0].scene.children[0].visible = false;
            TR3.scene.add(obj[0].scene);*/
            var dataLine = obj[0].scene.children[0];
            var linePOS = dataLine.geometry.getAttribute('position');

            //let groupColorSegmentsLine = new THREE.Group();

            const points = [];
            for (let i = 0; i < linePOS.count; i++) {
                points.push(linePOS.getX(i), linePOS.getY(i), linePOS.getZ(i));
            }
            const geometry222 = new TR3.LineGeometry();
            geometry222.setPositions(points);

            const matLine222 = new TR3.LineMaterial({
                color: new THREE.Color(colorLine),
                //depthTest: false,
                linewidth: 4,
                dashed: false,
                worldUnits: true
            });

            let lineOLlerp = new TR3.Line2(geometry222, matLine222);
            //lineOLlerp.userData = dataLine;
            //lineOLlerp.renderOrder = 998;
            lineOLlerp.name = obj[0].scene.TR3.extraData;
            //lineOLlerp.computeLineDistances();
            //lineOLlerp.scale.y = TR3.mesh.scale.y;
            TR3.scene.add(lineOLlerp);

            var from; var to; var conePosB4 = new THREE.Vector3(0, 0, 0);
            for (let i = 0; i < linePOS.count / doubleline; i++) {
                if (linePOS.getX(i + 1)) {
                    from = new THREE.Vector3(linePOS.getX(i), linePOS.getY(i), linePOS.getZ(i));
                    to = new THREE.Vector3(linePOS.getX(i + 1), linePOS.getY(i + 1), linePOS.getZ(i + 1));

                    var conePos = new THREE.Vector3().lerpVectors(from, to, .5);
                    if (conePosB4.distanceTo(conePos) > minDistanceCone && from.distanceTo(conePos) > 1) {
                        const geometry = new THREE.ConeGeometry(5, 20, 6);
                        geometry.rotateX(- Math.PI / 2);
                        const material = new THREE.MeshBasicMaterial();
                        const cone = new THREE.Mesh(geometry, material);
                        //cone.userData = { pauseIndex: i, to: to, from: from };
                        //cone.name = "coneLineOL"

                        cone.position.copy(conePos);
                        cone.lookAt(from);

                        //var pend = TR3.getCoordsPend3D(TR3.coordM2T(from.x, from.y, from.z), TR3.coordM2T(to.x, to.y, to.z));
                        //var colorPend = 1 - Math.abs(pend) / 45;

                        let col2Pend = new THREE.Color(0xffffff);
                        /*if (Math.abs(pend) > 5)
                            if (pend > 0) {
                                col2Pend.setHSL(0, 1, colorPend);
                            } else {
                                col2Pend.setHSL(120 / 360, 1, colorPend);
                            }*/
                        cone.material.color = col2Pend;
                        //cone.material.depthTest = false;
                        //cone.renderOrder = 999;

                        /*var TXTpms = {
                            text: '  ' + pend.toFixed(0) + '%',
                            font: { fontFace: "Arial", bold: false, fontsize: 1 },
                            pos: { x: 0, y: 0, z: 0, inv: true },
                            canvas: { borderThickness: 1, borderColor: { r: 0, g: 0, b: 0, a: 1.0 }, backgroundColor: { r: col2Pend.r * 255, g: col2Pend.g * 255, b: col2Pend.b * 255, a: 1.0 } },
                            center: false
                        };
                        var spritey = TR3.makeTextSprite(TXTpms);
                        spritey.position.copy(conePos);
                        spritey.position.y += 2;
                        spritey.scale.multiplyScalar(0.05);
                        spritey.material.depthTest = false;
                        spritey.renderOrder = 999;

                        lineOLlerp.add(spritey)*/

                        lineOLlerp.add(cone);
                        conePosB4 = conePos;
                    }
                }
            }
            //SALIDA!
            var i = 0;
            if (linePOS.getX(i)) {
                from = new THREE.Vector3(linePOS.getX(i), linePOS.getY(i), linePOS.getZ(i));

                const geometry = new THREE.SphereGeometry(5, 7, 7);
                const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
                const startPoint = new THREE.Mesh(geometry, material);

                startPoint.position.copy(from);

                //startPoint.material.depthTest = false;
                //startPoint.renderOrder = 999;

                lineOLlerp.add(startPoint);
            }
            //LLEGADA!
            var i = linePOS.count - 1;
            if (linePOS.getX(i)) {
                from = new THREE.Vector3(linePOS.getX(i), linePOS.getY(i), linePOS.getZ(i));

                const geometry = new THREE.SphereGeometry(5, 7, 7);
                const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
                const endPoint = new THREE.Mesh(geometry, material);

                endPoint.position.copy(from);

                //endPoint.material.depthTest = false;
                //endPoint.renderOrder = 999;

                lineOLlerp.add(endPoint);
            }

            lineOLlerp.startRabit = new THREE.Vector3(linePOS.getX(0), linePOS.getY(0) + 150, linePOS.getZ(0));

            var wPos = new Array();
            var wSle = new Array();
            var wSlct = new Array();
            var wED = new Array();
            var sle = 2.5;
            for (var i = 0; i < pushpin.length; i++) {
                pushpin[i].scaleAux = sle;

                wED.push(pushpin[i]);
                wPos.push(pushpin[i].point);
                wSle.push([sle, sle, sle]);
                wSlct.push(true);
            }

            var pin3d = {
                src: "source/obj3d/pin3d.glb",
                scale: wSle,
                pos: wPos,
                extraData: wED,
                //aRotate: -1.5,
                slctItem: wSlct
            };

            const pinGroup = new THREE.Group();
            pinGroup.name = "pinGroup";
            TR3.loadFile(pin3d).then(function (obj) {
                for (var i = 0; i < obj.length; i++) {
                    var pin3d = obj[i].scene;
                    pin3d.renderOrder = 1000;
                    pinGroup.add(pin3d);

                    if (pin3d.TR3.extraData.tilt) {
                        pin3d.children[0].rotateZ(pin3d.TR3.extraData.tilt);
                    }

                    pin3d.position.y += TR3.zMax * 3;
                    var raycaster = TR3.getRayCaster([pin3d.position, new THREE.Vector3(0, -1, 0)], 'point-vector');
                    var intersect = raycaster.intersectObject(TR3cfg.tileGroup, true)[0];
                    if (intersect) {
                        pin3d.position.copy(intersect.point);
                    }

                    pin3d.traverse(function (child) {
                        if (child.isMesh && child.material) {
                            if (child.name !== 'Cylinder1') {
                                child.material = new THREE.MeshBasicMaterial({ color: new THREE.Color(pin3d.TR3.extraData.color) });
                            } else {
                                //child.material.map = 'source/obj3d/camera.png'
                                const texture = new THREE.TextureLoader().load('source/icons/' + pin3d.TR3.extraData.type + '.jpg');
                                //texture.needsUpdate = true;
                                //texture.minFilter = THREE.LinearFilter;
                                child.material = new THREE.MeshBasicMaterial({ map: texture });
                            }
                        }
                    });
                    TR3.lookAtXY.push(pin3d);
                }
                lineOLlerp.add(pinGroup);

                lineLoaded.lerp = lineOLlerp;
                if (lineLoaded.path && lineLoaded.lerp) {
                    resolve(lineLoaded);
                }
            });
        });

    })
};

TR3cfg.getCloseIndexTrail = function (line, point) {
    var minDist = Infinity;
    var segmentClosePoint = 0;
    var linePOS = line.geometry.attributes.position;

    for (let i = 0; i < linePOS.count - 1; i++) {
        var from = new THREE.Vector3().fromBufferAttribute(linePOS, i);
        var to = new THREE.Vector3().fromBufferAttribute(linePOS, i + 1);

        var segmentPos = new THREE.Vector3().lerpVectors(from, to, .5);
        var distSeg = segmentPos.distanceTo(point);
        if (minDist > distSeg) {
            minDist = distSeg;
            segmentClosePoint = { pauseIndex: i, to: to, from: from };
        }
    }

    return segmentClosePoint;
};

TR3cfg.getVisibleTrail = function (thisTrail) {
    var trls = thisTrail || TR3cfg.trails;
    var tl = new Object();
    for (let i = 0; i < trls.length; i++) {
        if (trls[i].lerp.visible == true) {
            tl = trls[i];
        }
    }

    return tl;
};

TR3cfg.setVisibleTrail = function (id, thisTrail) {
    var trls = thisTrail || TR3cfg.trails;
    for (var i = 0; i < trls.length; i++) {

        var trlsI = trls[i];
        trlsI.lerp.visible = false;
        trlsI.lerp.position.y = 10000;
        if (id == trlsI.path.name) {
            trlsI.lerp.visible = true;
            trlsI.lerp.position.y = TR3cfg.lineLerpOffsetY || 3;
            TR3cfg.LineRabbit = trlsI.path;

            TR3.followCtmPath.pauseIndex = 0;
            TR3cfg.rabbitLight.position.copy(trlsI.lerp.startRabit);
            TR3.followCtmPath.stop = true;
            TR3cfg.rabbitLight.visible = false;

            TR3cfg.idPoi = -1;
            TR3cfg.incDisTrack = 0;
            TR3cfg.incDifTrack = 0;
            var dist = TR3.dataLineAtIndex(TR3cfg.LineRabbit, TR3cfg.LineRabbit.geometry.getAttribute('position').count - 1);
            trackChart.setChart(dist);
        }
    }
};