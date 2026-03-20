"use strict";
/**
 * Clase que se encarga de los textos y elementos HTML que aparecen en el entorno 3d
 * pensé que el sistema CSS3DSprite sería la solución pero actualmente vía CANVAS es más interesante
 * cambiar el nombre de la clase sería una opción a valorar.
 * @class css3d
 */

/**
 * función principal de Iniciación de la escena para crear el entorno 3D base
 * @public
 * @param {HTMLElement} html - elemento HTML
 * @param {boolean} click - Si es clickable el elemento
 * @param {object} params - objeto que define aspectos clave
 * @returns {object} sprite - Rerorna el elemento 3D a representar en la escena
 */
TR3sto.loadSprite = function (html, click, params) {
	if (params === undefined) params = {};

	var posSprite = params.hasOwnProperty("pos") ?
		params["pos"] : new THREE.Vector3(0, 0, 0);

	let scale = params.hasOwnProperty("scale") ?
		params["scale"] : '';

	let transform = params.hasOwnProperty("transform") ?
		params["transform"] : false;

	var extraData = params.hasOwnProperty("extraData") ?
		params["extraData"] : new Array();

	var hover = params.hasOwnProperty("hover") ?
		params["hover"] : 'css3dDEF';

	if (click) {
		html.addEventListener('click', (event) => {
			//alert(event.pointerType);
			if (event.pointerType == 'touch' || Detector.isSafari) {
				evtFunc(event);
			}
		});
		html.addEventListener("pointerdown", function (event) {
			if (event.pointerType == 'mouse') {
				evtFunc(event);
			}
		});

		function evtFunc(event) {
			TR3sto.css3Dover = false;
			click();
		}
	}

	html.addEventListener('mouseover', (event) => {
		if (!TR3sto.css3Dover) {
			event.target.classList.add(hover);
			TR3sto.css3Dover = true;
		}
	});

	html.addEventListener('mouseout', (event) => {
		if (TR3sto.css3Dover) {
			event.target.classList.remove(hover);
			setTimeout(function () { TR3sto.css3Dover = false; }, 100);
		}
	});

	params.html = html;
	params.click = click;

	const sprite = new CSS3DSprite(html);
	sprite.TR3 = new Object();
	sprite.TR3.extraData = extraData;
	sprite.TR3.source = JSON.parse(JSON.stringify(params));

	let box2 = getSizeObj(sprite);
	sprite.TR3.box = box2[0];
	sprite.TR3.hitbox = box2[1];
	sprite.TR3.radius = box2[2];
	sprite.TR3.center = box2[3];

	sprite.position.copy(posSprite);

	if (scale.isVector3 == true) {
		sprite.scale.copy(scale);
	}

	if (transform) {
		control.attach(sprite);
		const gizmo = control.getHelper();
		scene.add(gizmo);
	}

	if (sprite.name == '') { sprite.name = 'CSS'; }
	for (let i = 0; i < TR3sto.sprite.length; i++) {
		if (sprite.name == TR3sto.sprite[i].name) {
			sprite.name = sprite.name + i;
		}
	}

	let pnls = TR3sto.panel.addEnviroment.children;
	TR3sto.arrTransf.push(sprite.name);
	pnls[pnls.length - 1].$select.options[pnls[pnls.length - 1].$select.options.length] = new Option(sprite.name, sprite.name);

	TR3sto.sprite.push(sprite);
	sceneCSS.add(sprite);
	return sprite;
};

/**
 * función principal de Iniciación de la escena para crear el entorno 3D base.
 * @public
 * @param {string} message - Texto a presentar en sl Sprite 3D
 * @param {object} params - objeto que define aspectos clave
 * @returns {object} sprite - Rerorna el elemento 3D a representar en la escena
 * @example
 * TR3sto.makeTextSprite('hola', {
	fontface: 'verdana',
	fontsize: 20,
	width: 550,
	height: 20,
	color: 'rgba(200, 200, 200, 0.8)',
	bgColor: 'rgba(0, 0, 0, 1)'
});*/

TR3sto.makeTextSprite = function (message, opts) {
	let parameters = opts || {};
	let fontface = parameters.fontface || 'verdana';
	let fontsize = parameters.fontsize || 28;
	let font = parameters.font || false;
	let canvas = document.createElement('canvas');
	canvas.width = parameters.width || 550;
	canvas.height = parameters.height || 120;
	let textColor = parameters.color || 'rgba(255, 255, 255, 1)';
	let bgColor = parameters.bgColor || 'rgba(255, 255, 255, 0)';
	let stroke = parameters.stroke || { enable: false, color: 'rgba(0, 255, 255, 1)', round: 10, lineWidth: 2 };
	let transform = parameters.transform || false;
	let typeText = parameters.typeText || 'fillText';

	var ctx = canvas.getContext('2d');
	// Add behind elements.
	if (stroke.enable) {
		ctx.lineWidth = stroke.lineWidth;
		ctx.strokeStyle = stroke.color;
		roundRect(ctx, 0, 0, canvas.width, canvas.height, stroke.round);
	}

	ctx.fillStyle = bgColor;
	//ctx.strokeStyle = textColor;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	if (font) {
		ctx.font = font;
	} else {
		ctx.font = fontsize + "px " + fontface;
	}

	ctx.fillStyle = textColor;
	// save the unaltered context
	ctx.save();

	// approximate the font height
	var approxFontHeight = parseInt(ctx.font);
	if (!isNaN(approxFontHeight)) { fontsize = approxFontHeight; }

	// alter the context to center-align the text
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';

	// Create gradient
	var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
	gradient.addColorStop(0.25, 'red');
    gradient.addColorStop(.5, 'green')
    gradient.addColorStop(0.75, 'blue');

	// Fill with gradient
	ctx.strokeStyle = gradient;
	ctx.lineWidth = 3;

	var x = canvas.width / 2;
	message = message.replace(new RegExp('---', 'g'), ' ');
	var lines = message.split('\n');
	
	for (var i = 0; i < lines.length; i++)
		ctx[typeText](lines[i], x, canvas.height / 2 + (fontsize * 1.2 * i) - (fontsize * 1.2 * (lines.length - 1)) / 2);

	// restore the unaltered context
	ctx.restore();


	// canvas contents will be used for a texture
	var texture = new THREE.Texture(canvas)
	texture.minFilter = THREE.LinearFilter;
	texture.needsUpdate = true;

	const geometry = new THREE.PlaneGeometry(canvas.width, canvas.height);
	const material = new THREE.MeshBasicMaterial({
		map: texture,
		//alphaTest: .5
		transparent: true,
		//sizeAttenuation: false,
		//alphaTest: 0, //https://discourse.threejs.org/t/issue-with-transparent-shadermaterial-and-a-sprite/23443
		//depthTest: false/*, color: 0xcccccc*/
	});
	const sprite = new THREE.Mesh(geometry, material);
	//sprite.renderOrder = 0;

	if (transform) {
		control.attach(sprite);
		const gizmo = control.getHelper();
		scene.add(gizmo);

		const box3 = new THREE.BoxHelper(sprite, 0xffff00);
		box3.geometry.computeBoundingBox();
		sprite.add(box3);
		box3.update();
	}

	//canvas.style.position = 'absolute';
	//document.body.appendChild(canvas);

	return sprite;
};

/**
 * function for drawing rounded rectangles.
 * @param {object} ctx - context del CANVAS
*/
function roundRect(ctx, x, y, w, h, r) {
	ctx.beginPath();
	ctx.moveTo(x + r, y);
	ctx.lineTo(x + w - r, y);
	ctx.quadraticCurveTo(x + w, y, x + w, y + r);
	ctx.lineTo(x + w, y + h - r);
	ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
	ctx.lineTo(x + r, y + h);
	ctx.quadraticCurveTo(x, y + h, x, y + h - r);
	ctx.lineTo(x, y + r);
	ctx.quadraticCurveTo(x, y, x + r, y);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
};
//fin css3d.js