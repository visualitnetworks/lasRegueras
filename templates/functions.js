function doOnOrientationChange() {
	setTimeout(function () {
		if (!isMobile()) {

		} else {

		}
	}, 500);
}

/*if (screen && screen.orientation && screen.orientation.type) {
	screen.orientation.addEventListener("change", doOnOrientationChange);
} else {
window.addEventListener('orientationchange', doOnOrientationChange);
}
window.addEventListener('resize', () => { doOnOrientationChange(); });
doOnOrientationChange();*/

$.widget("ui.dialog", $.extend({}, $.ui.dialog.prototype, {
	_title: function (title) {
		if (!this.options.title) {
			title.html("&#160;");
		} else {
			title.html(this.options.title);
		}
	}
}));

$("#tools").dialog({ position: { my: "right top", at: "right top", of: window }, title: '<span idiomax="herras" id="herras">Herramientas</span>', width: 300, autoOpen: false });
$("#info").dialog({ position: { my: "center center", at: "center center", of: window }, title: 'Info', width: 350, autoOpen: false });
$('#info').bind('dialogclose', function (event, ui) {
	var idLayer = "fa-regular fa-copyright";
	document.getElementsByClassName(idLayer)[0].className = document.getElementsByClassName(idLayer)[0].className.replace('ItemActive', 'ItemInactive');
});
setTimeout(() => {
	$("#info").siblings('div.ui-dialog-titlebar').remove();
	//$("#info").parents('div').css("border-radius", "10px");
}, 100);

$('#map').dialog({ position: { my: "left top", at: "left top", of: window }, title: '<span idiomax="mapa" id="mapa">Mapa</span>', width: TR3cfg.mapSize, height: TR3cfg.mapSize, autoOpen: false });

// find the titlebar
var dlgtb = $("#map").dialog("instance").uiDialogTitlebar;
// add the button to titlebar    
dlgtb.append("<button id='btnExtMap' style='/*right:6px;*/position:absolute' class='ui-dialog-titlebar-close'></button>");
// make it an button    
$("#btnExtMap").button({
	icon: " ui-icon-caret-1-n",
	showLabel: false,
});
// add click handler
$("#btnExtMap").click(function () {
	if ($('#map')[0].style.display == 'block' || $('#map')[0].style.display == '') {
		$('#map')[0].style.display = 'none';
		//setTR3();
	} else {
		$('#map')[0].style.display = 'block';
	}
});

// find the titlebar
var dlgtb2 = $("#map").dialog("instance").uiDialogTitlebar;
// add the button to titlebar    
dlgtb2.append("<button id='btnExtMap2' style='/*right:6px;*/position:absolute' class='ui-dialog-titlebar-close'></button>");
// make it an button    
$("#btnExtMap2").button({
	icon: "ui-icon-arrow-4-diag",
	showLabel: false,
});
// add click handler
$("#btnExtMap2").click(function () {
	TR3cfg.switch2d3d();
});

$("#info").dblclick(function () {
	$("#tools").dialog("open");
	TR3.controls.maxPolarAngle = Infinity;
	TR3.controls.maxDistance = Infinity;
});

// find the titlebar
var dlgtb = $("#tools").dialog("instance").uiDialogTitlebar;
// add the button to titlebar    
dlgtb.append("<button id='btnExtTools' style='/*right:6px;*/position:absolute' class='ui-dialog-titlebar-close'></button>");
// make it an button    
$("#btnExtTools").button({
	icon: " ui-icon-caret-1-n",
	showLabel: false,
});
// add click handler
$("#btnExtTools").click(function () {
	if ($('#tools')[0].style.display == 'block' || $('#tools')[0].style.display == '') { $('#tools')[0].style.display = 'none' } else { $('#tools')[0].style.display = 'block' }
});

TR3cfg.switch2d3d = function () {
	if (TR3cfg.pause3d == false) {
		$("#map").dialog('option', 'position', { my: "left top", at: "left top", of: window });
		$("#map").dialog("option", "height", window.innerHeight);
		$("#map").dialog("option", "width", window.innerWidth);
		/*var mapCanvas = $('#map canvas');
		for (var i = 0; i < mapCanvas.length; i++) {
			var mapCanvasI = mapCanvas[i];
			mapCanvasI.style.top = '0px';
			mapCanvasI.style.left = '0px';
		}
		TR3.clearMeshMap();
		TR3cfg.map.updateSize();*/
		TR3cfg.pause3d = true;
	} else {
		$("#map").dialog("option", "height", TR3cfg.mapSize);
		$("#map").dialog("option", "width", TR3cfg.mapSize);
		$('#map')[0].style.display = 'none';
		TR3cfg.pause3d = false;
		//setTR3();
	}
}

$('#map')[0].style.display = 'none';

var constIn = 0;
var constOut = 0;

document.addEventListener('mousedown', function (e) {
	Ev_Start_Down(e);
});

document.addEventListener('touchstart', function (e) {
	Ev_Start_Down(e);
});

function Ev_Start_Down(e) {
	if (e.target.className == 'idiomaxLI') {
		return false;
	} 

	var targetUP = e.target;
	var idiom = false;
	while (targetUP.tagName !== "BODY") {
		targetUP = targetUP.parentNode;
		if (targetUP.id == 'idiomBtn') {
			idiom = true;
		}
	}
	if (!idiom) {
		document.getElementById('idiomMenu').style.display = 'none';
		var idiomBtn = document.getElementById('idiomBtn');
		idiomBtn.style.borderRadius = '20px';
		idiomBtn.setAttribute('aria-expanded', 'false');
	}
};

document.getElementById("geoloc").addEventListener('click', function () {
	openContModalWin(this);
	card__body.innerHTML = '\
	<h2 class="popup-title" idiomax="TtlGPS" id="TtlGPS">Tu experiencia mejora con la ubicación activada</h2>\
	<p idiomax="bdyGPS" id="bdyGPS">Activa el GPS para desbloquear todas las funcionalidades del recorrido y no perderte nada.</p>\
	<div class="popup-actions">\
		<button type="button" class="dlgButton" title="Activar ubicación" aria-label="Activar ubicación" onclick="geoLocation(); closeContModalWin();">\
			<span idiomax="activeLoc" id="activeLoc">Activar ubicación</span>\
		</button>\
	</div>';
	sanitizeCardBodyInlineStyles();
	TR3cfg.idiomax.set(TR3cfg.idiomax.get());
});

TR3cfg.downTrack = function (name) {
	var link = document.createElement("a");
	// If you don't know the name or want to use
	// the webserver default set name = ''
	link.setAttribute('download', name + '.gpx');
	link.href = TR3cfg.pathProjDir + 'data/' + name + '.gpx';
	document.body.appendChild(link);
	link.click();
	link.remove();
}

TR3cfg.selectTrack = function () {
	var select = document.getElementById("selectTrack");
	var selectedOption = select.options[select.selectedIndex];

	TR3cfg.setVisibleTrail(selectedOption.id);
};

document.getElementById("downTrack").addEventListener('click', function () {
	openContModalWin(this);
	card__body.innerHTML = '<h2><span idiomax="downloaddddd" id="download">Artículos, documentos y referencias</span></h2>\
	<div id="dlgDownTracksForm"><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vestibulum ullamcorper felis sed ultrices. Integer rhoncus euismod vulputate. Ut a mauris consequat, imperdiet justo nec, sagittis sapien. Nulla facilisi. Integer laoreet mattis metus et mattis. Maecenas eleifend tincidunt tincidunt. Cras interdum mauris id ligula pretium, in egestas purus efficitur. Duis vehicula, massa sed eleifend tempor, ipsum nisi pharetra mi, vel egestas leo justo vel augue. Proin elementum accumsan dui. Etiam lobortis, augue eget rhoncus imperdiet, justo neque blandit felis, at efficitur nisl mauris a urna.<br><br>\
Maecenas a risus sed est elementum consequat. Phasellus in sodales enim. Ut sed velit feugiat, pulvinar tortor egestas, sagittis eros. In vulputate, ipsum fermentum pulvinar consequat, erat nulla vestibulum urna, ac porttitor velit mauris quis massa. In non diam lacinia, cursus mauris id, maximus ligula. Phasellus non hendrerit arcu. Aliquam lobortis ante ex, at bibendum arcu consectetur nec. Ut dictum, mi convallis mollis pharetra, dui turpis ultricies magna, a accumsan leo neque vitae leo. Etiam eu lorem arcu. Praesent lorem lacus, ornare non neque eget, placerat fringilla massa. Ut id fermentum felis, ac posuere enim. Aenean nec mauris eget nibh blandit elementum. Curabitur imperdiet, augue id interdum mollis, neque dui efficitur odio, eget aliquam lectus justo a felis. Nunc purus enim, molestie non tortor sit amet, maximus aliquet eros. Quisque bibendum, arcu ultricies maximus consequat, libero turpis tincidunt massa, vel suscipit quam nibh sit amet massa.<br><br>\
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vestibulum ullamcorper felis sed ultrices. Integer rhoncus euismod vulputate. Ut a mauris consequat, imperdiet justo nec, sagittis sapien. Nulla facilisi. Integer laoreet mattis metus et mattis. Maecenas eleifend tincidunt tincidunt. Cras interdum mauris id ligula pretium, in egestas purus efficitur. Duis vehicula, massa sed eleifend tempor, ipsum nisi pharetra mi, vel egestas leo justo vel augue. Proin elementum accumsan dui. Etiam lobortis, augue eget rhoncus imperdiet, justo neque blandit felis, at efficitur nisl mauris a urna.</p></div>\
<div class="popup-actions">\
<button type="button" class="dlgButton" title="Cerrar ventana" aria-label="Cerrar ventana" onclick="closeContModalWin();">\
		<span idiomax="detailBtn" id="activeLoc">Cerrar</span>\
</button>\
</div>';

	sanitizeCardBodyInlineStyles();

});

TR3cfg.loadimageMesh = function loadimageMesh(src) {
	var img = new Image();
	img.crossOrigin = 'Anonymous';
	img.onload = function () {
		var canvas = document.createElement('CANVAS'),
			ctx = canvas.getContext('2d');
		canvas.id = 'IGNBaseTodo';
		canvas.height = img.height;
		canvas.width = img.width;
		ctx.drawImage(img, 0, 0);

		TR3.setImageMesh(canvas);
		//document.getElementById('waitMaplbl').style.display = 'none';

		TR3.loadingDiv.innerHTML = TR3.loadingDiv.innerHTML.replace("Loading ...", "");
		setTimeout(function () { TR3.loadingDiv.style.display = "none" }, 1000);

	};
	img.src = TR3cfg.pathProjDir + 'data/' + src + '.jpeg';
}

document.addEventListener('DOMContentLoaded', function () {
	var contModalWinEl = document.getElementById('contModalWin');
	var groundModalWinEl = document.getElementById('groundModalWin');
	if (contModalWinEl) {
		contModalWinEl.classList.remove('is-open');
		contModalWinEl.style.display = 'none';
	}
	if (groundModalWinEl) {
		groundModalWinEl.classList.remove('is-open');
		groundModalWinEl.style.display = 'none';
	}
});

var lastContModalOpenerEl = null;

function openContModalWin(openerEl) {
	lastContModalOpenerEl = openerEl || document.activeElement || null;
	if (typeof contModalWin !== 'undefined' && contModalWin) {
		contModalWin.style.display = 'block';
		contModalWin.setAttribute('aria-hidden', 'false');
		requestAnimationFrame(function () { contModalWin.classList.add('is-open'); });
	}
	if (typeof groundModalWin !== 'undefined' && groundModalWin) {
		groundModalWin.style.display = 'block';
		groundModalWin.setAttribute('aria-hidden', 'false');
		requestAnimationFrame(function () { groundModalWin.classList.add('is-open'); });
	}
}

function closeContModalWin() {
	try {
		var active = document.activeElement;
		if (active && typeof contModalWin !== 'undefined' && contModalWin && contModalWin.contains(active)) {
			active.blur();
		}
	} catch (e) { }

	if (typeof contModalWin !== 'undefined' && contModalWin) {
		contModalWin.setAttribute('aria-hidden', 'true');
		contModalWin.classList.remove('is-open');
		setTimeout(function () { if (contModalWin) contModalWin.style.display = 'none'; }, 170);
	}
	if (typeof groundModalWin !== 'undefined' && groundModalWin) {
		groundModalWin.setAttribute('aria-hidden', 'true');
		groundModalWin.classList.remove('is-open');
		setTimeout(function () { if (groundModalWin) groundModalWin.style.display = 'none'; }, 170);
	}

	try {
		if (lastContModalOpenerEl && lastContModalOpenerEl.focus) lastContModalOpenerEl.focus();
	} catch (e2) { }
}

function buttonCrightFn(elem) {
	openContModalWin(elem);
	card__body.innerHTML = '\
	<h2 class="popup-title" idiomax="legalInfo" id="legalInfo">Información Legal</h2>\
	<hr><div class="legal-info-block">\
		<img src="skin/ign.png" alt="Mapas ofrecidos por SCNE" title="Mapas ofrecidos por SCNE">\
		<p><span idiomax="mapsBy">Mapas ofrecidos por </span>«CC BY 4.0 <a target="_blank"\
				rel="noopener noreferrer" href="http://www.scne.es" title="Abrir web de SCNE (se abre en nueva pestaña)">SCNE</a>».</p>\
	</div>\
	<div class="legal-info-block">\
		<img src="skin/osm.png" alt="Datos de OpenStreetMap" title="Datos de OpenStreetMap">\
		<p>Contain data from <a target="_blank" rel="noopener noreferrer" href="https://www.openstreetmap.org" title="Abrir OpenStreetMap (se abre en nueva pestaña)">@OpenStreetMaps</a> contributors.\
		</p>\
	</div>\
	<div class="legal-info-block">\
		<img src="skin/terre3.png" alt="Desarrollado por Terre3" title="Desarrollado por Terre3">\
		<p><span idiomax="devBy">Desarrollado por</span> ©<a target="_blank" rel="noopener noreferrer" href="https://Terre3.es" title="Abrir Terre3 (se abre en nueva pestaña)">Terre3 by\
				Visualit</a>, product TerreMap.</p>\
	</div>\
	<div class="popup-actions"><button type="button" class="dlgButton" title="Cerrar ventana" aria-label="Cerrar ventana" onclick="closeContModalWin();">\
		<span idiomax="detailBtn" id="activeLoc">Cerrar</span>\
	</button></div>';

	sanitizeCardBodyInlineStyles();
};

function toggleDLG(dlg, idButton) {
	var isOpen = dlg.dialog("isOpen");
	var className = document.getElementById(idButton).className;

	if (isOpen) {
		document.getElementById(idButton).className = className.replace('ItemActive', 'ItemInactive');
		dlg.dialog("close");
	} else {
		document.getElementById(idButton).className = className.replace('ItemInactive', 'ItemActive');
		dlg.dialog("open");
	}
	TR3cfg.idiomax.set(TR3cfg.idiomax.get());

	return dlg.dialog("isOpen");
}

function RRSS(className) {

	var POSxy = TR3cfg.map.getView().getCenter();
	var POSz = TR3cfg.map.getView().getZoom();
	POS = (POSxy[0]).toFixed(2) + ',' + (POSxy[1]).toFixed(2) + ',' + POSz;

	var HREF = window.location.href.split("?");

	var URLSHARE = HREF[0] + '?&POS=' + POS;

	var URLSHAREuri = encodeURIComponent(URLSHARE);

	var RRSSshare;

	if (className.indexOf('twitter') > -1)
		RRSSshare = 'https://twitter.com/intent/tweet?summary=&url=' + URLSHAREuri;
	if (className.indexOf('instagram') > -1)
		RRSSshare = 'https://www.instagram.com/?url=' + URLSHAREuri;
	if (className.indexOf('facebook') > -1)
		RRSSshare = 'https://www.facebook.com/sharer.php?u=' + URLSHAREuri;
	if (className.indexOf('whatsapp') > -1)
		RRSSshare = 'whatsapp://send?text=' + URLSHAREuri;

	var textShare = document.getElementById("textShare");
	textShare.style.display = 'block';
	textShare.value = URLSHARE;

	var openW = window.open(RRSSshare, '_blank');
	if (openW == null || typeof (openW) == 'undefined') {
		$('#rrss').html('<p style="font-size: medium;">El enlace para mostrar el contenido ha sido bloqueado en la siguiente dirección:<br><a target="_blank" href="' + RRSSshare + '">' + RRSSshare +
			'</a><br>Para habilitar la configuración puede consultar aquí:\
				<br><a target="_blank" href="https://support.google.com/chrome/answer/95472">Chrome</a>\
				<br><a target="_blank" href="https://www.soydemac.com/como-permitir-ventanas-emergentes-en-safari/">Safari</a>\
				<br><a target="_blank" href="https://support.mozilla.org/es/kb/configuracion-y-preferencias-de-las-pestanas">Firefox</a></p>');
		$('#rrss').dialog('open');
	}

};

function setBuildings(feat) {
	for (var i = 0; i < feat.length; i++) {
		//var extent = feat[i].getGeometry().getExtent();
		//var bbox = TR3cfg.map.getView().calculateExtent(TR3cfg.map.getSize());
		//var bbox = TR3cfg.loc.bbox;
		var prop = feat[i].getProperties();
		var center = feat[i].getGeometry().getInteriorPoint().getCoordinates();

		var coords = feat[i].getGeometry().getCoordinates();

		if (prop.fAboveG > 0) {

			var center = TR3.translate2DbyXYmod(center[0], center[1], true)
			var vertex = coords[0];
			var vertex2D = [];
			for (var j = 0; j < vertex.length; j++) {
				vertex2D.push(TR3.translate2DbyXYmod(vertex[j][0], vertex[j][1], true));
			}
			var groupBuild = TR3.extrude2Dfeature(vertex2D, prop.fAboveG * 3, [center[0], center[1]], true);
			var Y = TR3.getCoordsByXYmod(center[0], center[1])[4]

			for (var j = 0; j < groupBuild.length; j++) {
				groupBuild[j].position.y += Y;
				//TR3.scene.add(groupBuild[j]);
			}
			groupBuild[0].material.color.set(new THREE.Color(0xFFFFFF));
			TR3.scene.add(groupBuild[0]);
			TR3.vGeom.build.push(groupBuild[1]);
		}
	}
}

function setTR3() {
}

// https://openlayers.org/en/latest/examples/tile-load-events.html
/**
 * Renders a progress bar.
 * @param {HTMLElement} el The target element.
 * @constructor
 */
function Progress(el) {
	this.el = el;
	this.loading = 0;
	this.loaded = 0;
}

/**
 * Increment the count of loading tiles.
 */
Progress.prototype.addLoading = function () {
	if (this.loading === 0) {
		this.show();
	}
	++this.loading;
	this.update();
};

/**
 * Increment the count of loaded tiles.
 */
Progress.prototype.addLoaded = function () {
	var this_ = this;
	setTimeout(function () {
		++this_.loaded;
		this_.update();
	}, 100);
};

/**
 * Update the progress bar.
 */
Progress.prototype.update = function () {
	var width = ((this.loaded / this.loading) * 100).toFixed(1) + '%';
	this.el.style.width = width;
	if (this.loading === this.loaded) {
		this.loading = 0;
		this.loaded = 0;
		var this_ = this;
		setTimeout(function () {
			this_.hide();
		}, 500);
	}
};

/**
 * Show the progress bar.
 */
Progress.prototype.show = function () {
	this.el.style.visibility = 'visible';
};

/**
 * Hide the progress bar.
 */
Progress.prototype.hide = function () {
	if (this.loading === this.loaded) {
		this.el.style.visibility = 'hidden';
		this.el.style.width = 0;
	}
};

/**
 * Update the progress bar.
 */
Progress.prototype.update = function () {
	var width = ((this.loaded / this.loading) * 100).toFixed(1) + '%';
	this.el.style.width = width;
	if (this.loading === this.loaded) {
		this.loading = 0;
		this.loaded = 0;
		var this_ = this;
		setTimeout(function () {
			//setTR3();
		}, 500);
	}
};

var progress = new Progress(document.getElementById('progress'));
var countLoad = 0;
for (i = 0; i < TR3cfg.checkeableLyrs.length; i++) {
	TR3cfg.checkeableLyrs[i].getSource().on('tileloadstart', function () {
		progress.addLoading();
		//delMarkers();
	});

	TR3cfg.checkeableLyrs[i].getSource().on('tileloadend', function () {
		progress.addLoaded();
		//setTR3();
	});

	TR3cfg.checkeableLyrs[i].getSource().on('tileloaderror', function (event) {
		progress.addLoaded();
		if (countLoad < 30) {
			event.tile.load();
			countLoad++;
		}
	});
};

document.getElementById("myturn").addEventListener('click', function (e) {
	//if (e.target.innerHTML.indexOf( TR3cfg.idiomax.text[TR3cfg.idiomax.actual].startNow) > -1) {
	if (!e.pointerType) {//no se ha hecho click
		document.getElementById('contIntro').style.display = 'none';
		document.getElementById('loading').style.display = 'none';
		//document.getElementById('dataTrack').style.display = 'none';

		//document.getElementById('logo-terre3-right-bottom').style.display = 'block';

		/*var auxMesh = TR3.mesh.clone();
		auxMesh.name = 'auxMesh';
		auxMesh.position.y = -105;
		TR3.scene.add(auxMesh);*/
		TR3.mesh.material.depthTest = false;
		//TR3.mesh.position.y = -2;
		TR3.mesh.material.wireframe = true;

		//Review positions pinGroupe (defensive CODE)
		for (i = 0; i < TR3cfg.trails.length; i++) {
			var pinGoupeReview = TR3cfg.trails[i].lerp.getObjectByName("pinGroup");//.children[34].position.y
			for (j = 0; j < pinGoupeReview.children.length; j++) {
				var object = pinGoupeReview.children[j];
				object.position.y += TR3.zMax * 3;
				var raycaster = TR3.getRayCaster([object.position, new THREE.Vector3(0, -1, 0)], 'point-vector');
				var intersect = raycaster.intersectObject(TR3cfg.tileGroup, true)[0];
				if (intersect) {
					object.position.copy(intersect.point);
				}
			}
		}

		setTimeout(() => {
			/*var Ghills = TR3.scene.getObjectByName('G-hills');
			if (Ghills) {
				Ghills.scale.x *= 1.5;
				Ghills.scale.z *= 1.5;
			}*/
			TR3.setOpts({ autoRotate: true }); TR3cfg.rabbitLight.visible = false;
		}, 200);
		/*setTimeout(function () {
			if (formURL.autostart) {
				togglePlay = true;
				document.getElementById('buttonPlay').click();
			}// true
		}, 1000);*/
	}
});
TR3cfg.myturn = document.getElementById('myturn');
TR3cfg.myturn.children[1].value = 12;

function toggleViewUI() {
	var btnCircular = document.getElementsByClassName('btn-circular');
	var nav = document.getElementById("contNavIdiom")
	for (let index = 0; index < btnCircular.length; index++) {
		const btnCircularI = btnCircular[index];
		if (btnCircularI.id != 'toggleViewUI')
			if (btnCircularI.style.visibility != 'hidden') {
				btnCircularI.style.visibility = 'hidden';
				nav.style.visibility = 'hidden';
			} else {
				btnCircularI.style.visibility = 'visible';
				nav.style.visibility = 'visible';
			}
	}
}

function moveForward(go) {
	var dist25pct = TR3.camera.position.distanceTo(TR3.controls.target) * 25 / 100;
	var dir = new THREE.Vector3();
	var speed = go * dist25pct;
	TR3.camera.getWorldDirection(dir);
	TR3.camera.position.addScaledVector(dir, speed);
}

function toggleContNavIdidm(elem) {
	var nav = elem.lastElementChild;
	var btn = elem.firstElementChild;

	var isOpen = window.getComputedStyle(nav).display !== 'none';
	var nextOpen = !isOpen;

	nav.style.display = nextOpen ? 'block' : 'none';
	btn.style.borderRadius = nextOpen ? '20px 20px 0px 0px' : '20px';
	btn.setAttribute('aria-expanded', nextOpen ? 'true' : 'false');

	if (nextOpen) {
		elem.dataset.pinned = '1';
	} else {
		elem.dataset.pinned = '';
		elem.removeAttribute('data-pinned');
	}
}

function showContNavIdiom(elem) {
	if (('ontouchstart' in window) || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0)) return;
	var nav = elem.lastElementChild;
	var btn = elem.firstElementChild;
	nav.style.display = 'block';
	btn.style.borderRadius = '20px 20px 0px 0px';
	btn.setAttribute('aria-expanded', 'true');
}

function hideContNavIdiom(elem) {
	if (('ontouchstart' in window) || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0)) return;
	if (elem.dataset.pinned === '1') return;
	var nav = elem.lastElementChild;
	var btn = elem.firstElementChild;
	nav.style.display = 'none';
	btn.style.borderRadius = '20px';
	btn.setAttribute('aria-expanded', 'false');
}

window.addEventListener('load', function () {
	var contModalWinEl = document.getElementById('contModalWin');
	var groundModalWinEl = document.getElementById('groundModalWin');
	if (contModalWinEl) contModalWinEl.style.display = 'none';
	if (groundModalWinEl) groundModalWinEl.style.display = 'none';
});

document.addEventListener('DOMContentLoaded', function () {
	var cont = document.getElementById('contNavIdiom');
	var nav = document.getElementById('idiomMenu');
	var btn = document.getElementById('idiomBtn');
	if (!cont || !nav) return;
	nav.addEventListener('mouseenter', function () { cont.classList.add('is-over-menu'); });
	nav.addEventListener('mouseleave', function () { cont.classList.remove('is-over-menu'); });

	if (btn) {
		btn.addEventListener('click', function (e) {
			e.stopPropagation();
			toggleContNavIdidm(cont);
		});
	}

	nav.addEventListener('click', function (e) { e.stopPropagation(); });

	document.addEventListener('click', function (e) {
		if (!cont.contains(e.target) && window.getComputedStyle(nav).display !== 'none') {
			nav.style.display = 'none';
			if (btn) {
				btn.style.borderRadius = '20px';
				btn.setAttribute('aria-expanded', 'false');
			}
			cont.classList.remove('is-over-menu');
			cont.dataset.pinned = '';
			cont.removeAttribute('data-pinned');
		}
	});
});

function sanitizeCardBodyInlineStyles() {
	var cardBody = document.getElementById('card__body');
	if (!cardBody) return;
	var styled = cardBody.querySelectorAll('[style]');
	for (var i = 0; i < styled.length; i++) styled[i].removeAttribute('style');

	var centers = cardBody.getElementsByTagName('center');
	while (centers.length) {
		var c = centers[0];
		var parent = c.parentNode;
		while (c.firstChild) parent.insertBefore(c.firstChild, c);
		parent.removeChild(c);
	}

	var titles = cardBody.getElementsByTagName('h2');
	for (var j = 0; j < titles.length; j++) {
		if (titles[j].className.indexOf('popup-title') === -1) {
			titles[j].className = (titles[j].className ? (titles[j].className + ' ') : '') + 'popup-title';
		}
	}

	var h2Text = '';
	if (titles && titles.length) h2Text = (titles[0].textContent || '').trim();
	if (h2Text) {
		var imgs = cardBody.getElementsByTagName('img');
		for (var k = 0; k < imgs.length; k++) {
			imgs[k].setAttribute('alt', h2Text);
			imgs[k].setAttribute('title', h2Text);
		}
	}
}