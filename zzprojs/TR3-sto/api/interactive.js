'use strict';
/**
 * Zona que maneja la interactividad vía Raycast,
 * lanzando el rayo que puede golpear distintos elementos de la escena
 * y devolver infromación al respecto
 * @class interactive
 */

/**
 * devuelve la información si el objeto dado es gopeado por el rayo
 * @param {object} raycaster - objeto Raycast de THREEjs
 * @param {object} objSlct - objeto 3d que se propone
 * @returns {Array} - resultado de la intersección
 */
function getIntersect (raycaster, objSlct) {
    //if(TR3.vGeom.build.length>0){objSlct = TR3.vGeom.build};
    var intersects = false;
    var intsct = new Array();

    for (var i = 0; i < objSlct.length; i++) {
        var oSlcti = objSlct[i];

        if (oSlcti)
            intsct = raycaster.intersectObject(oSlcti, true);

        if( intsct[0] && intsct[0].point ){
            if (!intersects) { intersects = intsct; }
            if (intersects[0].point.y < intsct[0].point.y) {
                intersects = intsct;
            }

        }else{ console.log('click out!'); }
    }
    return [intersects];
};

/**
 * Crea el rayo generado según los parámetros de entrada
 * @param {Array} event - evento o conjunto de datos para obtener el vector de dirección
 * @param {string} mode - indica cuál de los diferentes modos de obtener la dirección se usa
 * @param {number} near - indica la proximidad al origen que comienza
 * @param {number} far - indica lo lejano que puede llegar
 * @returns {object} - retorna el propio rayo generado
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

        directionVector.subVectors( start, end );
    } else if (mode == 'point-camera') {
        start = event[0];

        camera.getWorldDirection(directionVector);
    } else if (mode == 'point-vector') {
        start = event[0];
        directionVector.copy(event[1]);
    }

    var raycasterRtrn = new THREE.Raycaster(start, directionVector.normalize(), nearRay, farRay);
    return raycasterRtrn;

    function getRayCaster_EventCam(event) {

        var contDiv = container;
        var contTop = contDiv.offsetTop;
        var contLeft = contDiv.offsetLeft;
        while (contDiv.parentElement) {
            contDiv = contDiv.parentElement;
            contTop += contDiv.offsetTop;
            contLeft += contDiv.offsetLeft;
        }

        var evtX;
        var evtY;
        const cont = {
			w: parseInt(container.style.width),
			h: parseInt(container.style.height)
		}
        if (event && event.touches && event.touches.length > 0) {
            evtX = event.touches[0].clientX;
            evtY = event.touches[0].clientY;
        } else if (event && event.clientX) {
            evtX = event.clientX;
            evtY = event.clientY;
        } else {
            evtX = cont.w * 0.5
            evtY = cont.h * 0.5
            contLeft = 0;
            contTop = 0;
        }

        var mouseX = ((evtX - contLeft) / cont.w) * 2 - 1;
        var mouseY = -((evtY - contTop) / cont.h) * 2 + 1;

        var vector = new THREE.Vector3(mouseX, mouseY, camera.near);
        vector.unproject(camera);

        var cPos = camera.position;

        //var raycaster = new THREE.Raycaster(cPos, vector.sub(cPos).normalize(),0,farRay);
        //raycaster.firstHitOnly = true;

        return [cPos, vector.sub(cPos)];
    };

};

/**
 * genera un array de objetos seleccionables de la escena TR3sto.selectables
 * @param {object} obj - objeto 3d de la escena
 */
TR3sto.setSelectableObj = function (obj) {
    if(obj && obj.TR3){ TR3sto.selectables.push(obj); }
};

/**
 * Comprueba si alguno de los elemntos de la escena
 * susceptible de ser golpeado lo es y dispara su evento
 * @param {event} evt - evento click para obtener el rayo
 */
function click_Obj3d(evt) {
    //var selectables = getSelectableObj();
    if (TR3sto.selectables.length > 0) {
        var raycaster = getRayCaster(evt);
        var inter = getIntersect(raycaster, TR3sto.selectables);
        if (inter[0] && inter[0][0].object.uuid) {
            //inter[0][0].slctItem = inter[1].userData.slctItem;
            var request = { intersect: inter[0]/*, obj3d: inter[1]*/ };
            TR3sto.intersectEvClick(request);
        }
    }
};
//fin interactive.js