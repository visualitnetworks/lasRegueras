document.getElementById("newUserBtn").addEventListener('click', function (e) {

    document.getElementById("userUnLogued").style.display = 'none';
    document.getElementById("userLoged").style.display = 'none';
    document.getElementById("newUser").style.display = 'block';

});

document.getElementById("newUserBtnBack").addEventListener('click', function (e) {

    document.getElementById("userUnLogued").style.display = 'block';
    document.getElementById("userLoged").style.display = 'none';
    document.getElementById("newUser").style.display = 'none';

});

TextAreaFn();

document.getElementById('btnPOIs').onclick = function () {
    setWaypoisOptions(false);
};

document.getElementById('btnTexts').onclick = function () {
    setText2mapOptions();
};

setTimeout(() => {
    TR3.controls.addEventListener('change', function (event) {
        if (!TR3cfg.isDraged) {
            const isDragedTimeout = setTimeout(() => {
                TR3cfg.isDraged = false;
                clearTimeout(isDragedTimeout);
            }, 3000);
        }
        TR3cfg.isDraged = true;
    });
    TR3.map.addEventListener('click', function name(params) {
        if (TR3cfg.setingPOIs && !TR3cfg.isDraged) {
            var thisElem = TR3cfg.setingPOIs;
            var coordClick = TR3.cursor.coordClick;
            var coordT = TR3.coordM2T(coordClick.x, coordClick.y, coordClick.z);
            thisElem.lastChild.value = coordT[0].toFixed(2) + ',' + coordT[1].toFixed(2) + ',' + coordT[2].toFixed(3);
            TR3.setOpts({ cursor3d: false });
            $('#adminLoginPnl').dialog('open');
            $("#adminLoginPnl").css("max-height", window.innerHeight / 1.15);
            TR3cfg.setingPOIs = false;
        } else {
            TR3cfg.isDraged = false;
        }
    }, false);
}, 3000);

function setPOI3d(thisElem) {
    TR3cfg.isDraged = false;
    TR3cfg.setingPOIs = thisElem.parentElement;
    TR3.setOpts({ cursor3d: true });
    $('#adminLoginPnl').dialog('close');
};

function btnPOIsView(thisElem, kk, id) {
    var thisTable = thisElem;
    while (thisTable.nodeName !== 'TABLE') {
        thisTable = thisTable.parentElement;
    }

    var select = document.getElementById("selectTrackPOIs");
    var selectedOption = select.options[select.selectedIndex];

    document.getElementById("selectTrack").value = selectedOption.id;
    TR3cfg.selectTrack();

    var elemID = thisElem.parentElement.parentElement.rowIndex;
    var indexDB = thisTable.rows[elemID].cells[id].lastChild.value;
    var coord = indexDB.split(',');
    $('#adminLoginPnl').dialog('close');

    var tgt = TR3.getCoordsByXYmod(coord[0] * 1, coord[1] * 1, false, true);

    TR3cfg.moveRabbitLight(false, new THREE.Vector3(tgt[3], tgt[4], tgt[5]), 'jump', false, { x: TR3cfg.tweenDist, y: TR3cfg.tweenDist, z: TR3cfg.tweenDist });
}

function btnPOIsSUPR(thisElem) {

    var thisTable = thisElem;
    while (thisTable.nodeName !== 'TABLE') {
        thisTable = thisTable.parentElement;
    }

    var elemID = thisElem.parentElement.parentElement.rowIndex;
    var indexDB = thisTable.rows[elemID].cells[0].innerText;

    var colDB = document.querySelector('#' + thisTable.id + ' th:nth-child(' + (1) + ')').id;

    var tableDB = thisElem;
    while (tableDB.nodeName !== 'SECTION') {
        tableDB = tableDB.parentElement;
    }

    if (!TR3cfg.oridt4DB.DELETE) {
        TR3cfg.oridt4DB.DELETE = [];
    }

    if (indexDB.indexOf('NEW:') == -1) {
        //var obj = {table: tableDB.id};
        //obj[colDB] = indexDB;
        TR3cfg.oridt4DB.DELETE.push({ table: tableDB.id, [colDB]: indexDB });
    }

    thisTable.deleteRow(elemID);
};

function btnPOIsUpdown(thisElem, direction) {
    var index = thisElem.parentElement.parentElement.rowIndex;
    var thisTable = thisElem;
    while (thisTable.nodeName !== 'TABLE') {
        thisTable = thisTable.parentElement;
    }

    var rows = thisTable.rows,
        parent = rows[index].parentNode;

    if (direction === "up") {
        if (index > 1) {
            parent.insertBefore(rows[index], rows[index - 1]);
        }
    }

    if (direction === "down") {
        if (index < rows.length - 1) {
            parent.insertBefore(rows[index + 1], rows[index]);
        }
    }
};

function TextAreaFn() {
    setTimeout(() => {
        var texaClass = document.getElementsByClassName('texaClass');
        for (let index = 0; index < texaClass.length; index++) {
            var taClassI = texaClass[index];
            //taClassI.classList.remove("texaClass");
            taClassI.onkeyup = function (event) {
                var counter;
                if (event.target.nextSibling) {
                    counter = event.target.nextSibling;
                } else {
                    counter = event.target;
                }
                counter.innerHTML = (this.maxLength - this.value.length) + "/" + this.maxLength;
            };
        }

        var newImageDB = document.getElementsByClassName('newImageDB');
        for (let index = 0; index < newImageDB.length; index++) {
            var imgClassI = newImageDB[index];
            //imgClassI.classList.remove("newImageDB");
            imgClassI.onchange = function (event) {
                var thisElem = event.target;
                var thisTable = event.target;
                var tableDB = { id: 'globals' }
                var colDB = '---';
                var indexDB = '---';
                var colIndexDB = 'IDglobals'
                if (thisTable.parentElement.nodeName == 'LI') { //GLOBALS
                    colDB = indexDB = thisElem.nextElementSibling.id.split('___')[1];
                } else {
                    while (thisTable.nodeName !== 'TABLE') {
                        thisTable = thisTable.parentElement;
                    }

                    var colIndex = thisElem.parentElement.cellIndex;
                    rowIndex = thisElem.parentElement.parentElement.sectionRowIndex;
                    indexDB = thisElem.parentElement.parentElement.children[0].innerText;
                    colDB = document.querySelector('#' + thisTable.id + ' th:nth-child(' + (colIndex + 1) + ')').id;
                    colIndexDB = document.querySelector('#' + thisTable.id + ' th:nth-child(' + (1) + ')').id;

                    tableDB = thisElem;
                    while (tableDB.nodeName !== 'SECTION') {
                        tableDB = tableDB.parentElement;
                    }
                }

                var counter;
                if (thisElem.nextSibling.nextSibling) {
                    counter = event.target.nextSibling.nextSibling;
                    counter.innerHTML = this.files[0].name;

                    if (!TR3cfg.oridt4DB.IMAGES) {
                        TR3cfg.oridt4DB.IMAGES = [];
                    }

                    for (let i = 0; i < TR3cfg.oridt4DB.IMAGES.length; i++) {
                        var imagesI = TR3cfg.oridt4DB.IMAGES[i];
                        if (imagesI.table == tableDB.id && imagesI[colIndexDB] == indexDB) {
                            TR3cfg.oridt4DB.IMAGES.splice(i, 1)
                        }
                    }

                    if (this.files[0].name.length > 150) {
                        alert('ERROR: name IMAGE too large!');
                    } else {
                        TR3cfg.oridt4DB.IMAGES.push({ [colIndexDB]: indexDB, [colDB]: this.files[0].name, table: tableDB.id });
                        var fileReader = new FileReader();
                        fileReader.onload = function () {
                            TR3cfg.oridt4DB.IMAGES[TR3cfg.oridt4DB.IMAGES.length - 1].blob = fileReader.result;
                        }
                        fileReader.readAsDataURL(this.files[0]);
                    }
                }
            };

        }
    }, 100);


};

/**
 * DATATABLES
 */
function loginUser() {
    var url = "./php/login.php";
    TR3cfg.user = [$("#name_user").val(), $("#pass_user").val()];//['Agus','rasmuslerdorf'];
    var dataForm = {
        user: TR3cfg.user[0],
        pass: TR3cfg.user[1],
        path: spams.get("zzproj")
    };
    $.ajax({
        type: "POST",
        url: url,
        data: dataForm,
        success: function (data) {
            //console.log(data);
            if (data.indexOf("Find fail:") > -1) {
                console.log(data);
                alert(data);
            } else {
                TR3cfg.user = false;

                document.getElementById("userUnLogued").style.display = 'none';
                document.getElementById("newUser").style.display = 'none';
                document.getElementById("userLoged").style.display = 'block';

                var splitData = data.split('$$$');
                TR3cfg.db = { session: splitData[1], directory: splitData[2] };
                getDataTrail();
            }
        },
        error: function (data) {
            console.log(data);
            alert(data);
        }
    });
};

function getDataTrail(init) {
    var url = "./php/getDataTrail.php";
    var dataForm = {
        proj: formURL.zzProj.split('/')[1]
    };
    $.ajax({
        type: "POST",
        url: url,
        data: dataForm,
        success: function (data) {
            if (data.indexOf("Find fail:") > -1) {
                console.log(data);
                alert(data);
            } else {
                var splitData = data.split('$$$');
                var arrDataJson = [];
                for (let i = 0; i < splitData.length; i++) {
                    arrDataJson.push(JSON.parse(splitData[i]));
                }
                if (!init) {
                    setMineOptions(arrDataJson[0]);
                    setTrackOptions(arrDataJson[1]);
                    setText2mapOptions(arrDataJson[2] || true);
                    setWaypoisOptions(arrDataJson[3] || true, arrDataJson[1]);

                    TR3cfg.oridt4DB = getDaTest4DB();
                } else {
                    fillConfigProj(arrDataJson);
                }
            }
        },
        error: function (data) {
            console.log(data);
            alert(data);
            if (data.indexOf("Find fail:") > -1) {
                alert(data);
            }
        }
    });
};

function setDataTrail(objData, reload) {
    var saveUser2DB = document.getElementById("saveUser2DB");
    if (saveUser2DB.innerHTML.indexOf("Salvando...") > -1) {
        return false;
    }
    var url = "./php/setDataTrail.php";
    var dataForm = {
        delete: objData.DELETE,
        images: objData.IMAGES,
        insert: objData.INSERT,
        update: objData.UPDATE,
        token: TR3cfg.db.session,
        directory: TR3cfg.db.directory
    };
    $.ajax({
        type: "POST",
        url: url,
        data: dataForm,
        success: function (data) {
            console.log(data);
            if (data.indexOf('Done OK!') == -1) {
                alert(data);
            } else {
                var saveUser2DB = document.getElementById("saveUser2DB");
                if (saveUser2DB.innerHTML.indexOf(" ") > -1) {
                    saveUser2DB.innerHTML = "Vale!😀";
                } else {
                    saveUser2DB.innerHTML = "Hecho! 👍";
                }
                if (reload) { location.reload(); }
                setTimeout(() => {
                    saveUser2DB.innerHTML = "Guarde su progreso! 💾";
                }, 15000);

                getDataTrail();
            }
        },
        error: function (data) {
            console.log(data);
            if (data.indexOf("Find fail:") > -1) {
                alert(data);
            }
        }
    });
};

function newUser() {
    var email1_newUser = document.getElementById("email1_newUser").value;
    var email2_newUser = document.getElementById("email2_newUser").value;
    var pass1_newUser = document.getElementById("pass1_newUser").value;
    var pass2_newUser = document.getElementById("pass2_newUser").value;

    if (email1_newUser !== email2_newUser) {
        alert("Error: Emails del formulario no coincide");
        return false;
    }

    if (pass1_newUser !== pass2_newUser) {
        alert("Error: Password de formulario no coincide");
        return false;
    }

    var url = "./php/newUser.php";
    var dataForm = {
        token: document.getElementById("key_newUser").value,
        pass: document.getElementById("pass1_newUser").value,
        email: document.getElementById("email1_newUser").value,
        name: document.getElementById("name_newUser").value
    };
    $.ajax({
        type: "POST",
        url: url,
        data: dataForm,
        success: function (data) {
            console.log(data);
            alert(data);
            if (data.indexOf("Find fail:") == -1) {
                document.getElementById("userUnLogued").style.display = 'block';
                document.getElementById("newUser").style.display = 'none';
                document.getElementById("userLoged").style.display = 'none';
            }

        },
        error: function (data) {
            console.log(data);
            alert(data);
            if (data.indexOf("Find fail:") > -1) {
                alert(data);
            }
        }
    });
};

function logOutUser() {
    var url = "./php/exitLogin.php";

    document.getElementById("userUnLogued").style.display = 'block';
    document.getElementById("newUser").style.display = 'none';
    document.getElementById("userLoged").style.display = 'none';

    $('#adminLoginPnl').dialog('close');

    if (!TR3cfg.db || !TR3cfg.db.session) {
        return false;
    }

    var dataForm = {
        token: TR3cfg.db.session
    };
    $.ajax({
        type: "POST",
        url: url,
        data: dataForm,
        success: function (data) {
            //console.log(data);
            TR3cfg.user = false;
        },
        error: function (data) {
            console.log(data);
            alert(data);
            if (data.indexOf("Find fail:") > -1) {
                alert(data);
            }
        }
    });
};

function setMineOptions(data) {

    var mainOpts = document.getElementById("mainOpts");
    var autoOpenElm = 'checked';
    if (data[0].autoOpen == '0') { autoOpenElm = '' };

    mainOpts.innerHTML = '\
            <div style="float: left;">\
				<ul style="width: 45%; float: left;line-height:200%">\
					<li>\
						<label>Color: </label>\
						<input class="setTest4DB" id="___color___mainTrail" type="text" style="width: 140px;">\
					</li>\
					<li>\
						<label>logo: </label>\
						<input type="file" class="newImageDB" value="Subir Imagen" accept="image/*">(300x100pxPNG)\
						<span id="img___logo___DB" style="font-size:x-small">img:'+ data[0].logo + '</span>\
					</li>\
					<li>\
						<label>Imagen Fondo: </label>\
						<input type="file" class="newImageDB" value="Subir Imagen" accept="image/*">(1920x1080pxJPG)\
						<span id="___image___groundDB" style="font-size:x-small">img:'+ data[0].image + '</span>\
					</li>\
					<li>\
						<label>Imagen patrocinios: </label>\
						<input class="setTest4DB" value="" id="___autoOpen___DB" type="checkbox" '+ autoOpenElm + '>autoOpen\
						<br><input type="file" class="newImageDB" value="Subir Imagen" accept="image/*">(500x500pxJPG)\
						<span id="___patreons___DB" style="font-size:x-small">img:'+ data[0].patreons + '</span>\
					</li>\
                    <li>\
						<label>Título de página: </label><br>\
						<div style="width:28px;float:left">'+ data[0].lang.toLowerCase() + '</div><textarea id="ta___title___' + data[0].lang + '___" class="texaClass setTest4DB" rows="1" cols="30" placeholder="Nombre del trail"\
							maxlength="100" autofocus>'+ data[0].title + '</textarea><span style="font-size: small;"></span><br>\
                        <div style="width:28px;float:left">'+ data[1].lang.toLowerCase() + '</div><textarea id="ta___title___' + data[1].lang + '___" class="texaClass setTest4DB" rows="1" cols="30" placeholder="Nombre del trail"\
							maxlength="100" autofocus>'+ data[1].title + '</textarea><span style="font-size: small;"></span><br>\
                        <div style="width:28px;float:left">'+ data[2].lang.toLowerCase() + '</div><textarea id="ta___title___' + data[2].lang + '___" class="texaClass setTest4DB" rows="1" cols="30" placeholder="Nombre del trail"\
							maxlength="100" autofocus>'+ data[2].title + '</textarea><span style="font-size: small;"></span><br>\
                        <div style="width:28px;float:left">'+ data[3].lang.toLowerCase() + '</div><textarea id="ta___title___' + data[3].lang + '___" class="texaClass setTest4DB" rows="1" cols="30" placeholder="Nombre del trail"\
							maxlength="100" autofocus>'+ data[3].title + '</textarea><span style="font-size: small;"></span><br>\
                        <div style="width:28px;float:left">'+ data[4].lang.toLowerCase() + '</div><textarea id="ta___title___' + data[4].lang + '___" class="texaClass setTest4DB" rows="1" cols="30" placeholder="Nombre del trail"\
							maxlength="100" autofocus>'+ data[4].title + '</textarea><span style="font-size: small;"></span>\
					</li>\
				</ul>\
				<ul style="width: 45%; float: right">\
					<li>\
						<label>Párrafo de inicio:</label><br>\
						<div style="width:28px;float:left">'+ data[0].lang.toLowerCase() + '</div><textarea id="ta___text___' + data[0].lang + '___" class="texaClass setTest4DB" rows="3" cols="40"\
							placeholder="Pequeño texto descriptivo del trail" maxlength="250">'+ data[0].text + '</textarea><span style="font-size: small;"></span></br>\
                        <div style="width:28px;float:left">'+ data[1].lang.toLowerCase() + '</div><textarea id="ta___text___' + data[1].lang + '___" class="texaClass setTest4DB" rows="3" cols="40"\
							placeholder="Pequeño texto descriptivo del trail" maxlength="250">'+ data[1].text + '</textarea><span style="font-size: small;"></span></br>\
                        <div style="width:28px;float:left">'+ data[2].lang.toLowerCase() + '</div><textarea id="ta___text___' + data[2].lang + '___" class="texaClass setTest4DB" rows="3" cols="40"\
							placeholder="Pequeño texto descriptivo del trail" maxlength="250">'+ data[2].text + '</textarea><span style="font-size: small;"></span></br>\
                        <div style="width:28px;float:left">'+ data[3].lang.toLowerCase() + '</div><textarea id="ta___text___' + data[3].lang + '___" class="texaClass setTest4DB" rows="3" cols="40"\
							placeholder="Pequeño texto descriptivo del trail" maxlength="250">'+ data[3].text + '</textarea><span style="font-size: small;"></span></br>\
                        <div style="width:28px;float:left">'+ data[4].lang.toLowerCase() + '</div><textarea id="ta___text___' + data[4].lang + '___" class="texaClass setTest4DB" rows="3" cols="40"\
							placeholder="Pequeño texto descriptivo del trail" maxlength="250">'+ data[4].text + '</textarea><span style="font-size: small;"></span>\
					</li>\
					</li>\
					</li>\
					</li>\
					</li>\
				</ul>\
			</div>';

    var optPick = {
        // animation speed
        animationSpeed: 50,
        // easing function
        animationEasing: 'swing',
        // defers the change event from firing while the user makes a selection
        change: null,
        changeDelay: 0,
        // hue, brightness, saturation, or wheel
        control: 'hue',
        // default color
        defaultValue: data[0].color,
        // hex or rgb
        format: 'rgb',
        // show/hide speed
        //show: null,
        showSpeed: 100,
        //hide: null,
        hideSpeed: 100,
        // is inline mode?
        inline: false,
        // a comma-separated list of keywords that the control should accept (e.g. inherit, transparent, initial). 
        keywords: '',
        // uppercase or lowercase
        letterCase: 'lowercase',
        // enables opacity slider
        opacity: false,
        // custom position
        position: 'bottom left',
        // additional theme class
        theme: 'default',
        // an array of colors that will show up under the main color <a href="https://www.jqueryscript.net/tags.php?/grid/">grid</a>
        swatches: []
    }
    $('#___color___mainTrail').minicolors(optPick);
    $("#adminLoginPnl").css("max-height", window.innerHeight / 1.15);
};

function setTrackOptions(data) {

    var tableTracks = document.getElementById('tableTracks').getElementsByTagName('tbody')[0]
    tableTracks.innerHTML = "";
    var slctTrackPOIs = document.getElementById('selectTrackPOIs');
    slctTrackPOIs.innerHTML = "";

    for (let i = 0; i < data.length; i++) {
        slctTrackPOIs.innerHTML += '<option id=' + data[i].gpx + ' value="' + data[i].IDtracks + '">' + data[i].name + '</option>';

        let row = tableTracks.insertRow();
        let cell0 = row.insertCell();
        let cell1 = row.insertCell();
        let cell2 = row.insertCell();
        let cell3 = row.insertCell();
        let cell4 = row.insertCell();
        let cell5 = row.insertCell();

        cell0.innerHTML = data[i].IDtracks;
        cell0.className = 'hide-column';
        cell1.innerHTML = data[i].gpx;
        cell2.innerHTML = '<textarea id="taNameTrackDB" class="texaClass setTest4DB" rows="1" cols="20" placeholder="Nombre del track"\
	 maxlength="50">'+ data[i].name + '</textarea><span style="font-size: small;"></span>';
        cell3.innerHTML = '<textarea id="taPlaceTrackDB" class="texaClass setTest4DB" rows="1" cols="20" placeholder="Lugar del track"\
	 maxlength="50">'+ data[i].place + '</textarea><span style="font-size: small;"></span>';
        cell4.innerHTML = '<textarea id="taDateTrackDB" class="texaClass setTest4DB" rows="1" cols="20" placeholder="Fecha y hora"\
	 maxlength="50">'+ data[i].date + '</textarea><span style="font-size: small;"></span>';
        cell5.innerHTML = '<textarea id="taInfoTrackDB" class="texaClass setTest4DB" rows="1" cols="20" placeholder="Infomación adicional"\
	 maxlength="50">'+ data[i].info + '</textarea><span style="font-size: small;"></span>';
    }
    TextAreaFn();
};

function setText2mapOptions(thisData) {
    var data = [
        { coords: '', text: '', IDtext2map: 'NEW:' }
    ];
    var tableTexts = document.getElementById('tableTexts').getElementsByTagName('tbody')[0];

    if (thisData) {
        data = JSON.parse(JSON.stringify(thisData));
        tableTexts.innerHTML = "";
    }

    for (let i = 0; i < data.length; i++) {
        let row = tableTexts.insertRow();
        let cell0 = row.insertCell();
        let cell1 = row.insertCell();
        let cell2 = row.insertCell();
        let cell3 = row.insertCell();

        cell0.innerHTML = data[i].IDtext2map;
        cell0.className = 'hide-column';
        cell1.innerHTML = '<input type="button" onclick="setPOI3d(this,\'up\',\'tablePOIs\')"  value="Señala el punto"><br><span style="font-size:x-small">xyz:</span><input id="coordsText2MapDB" style="font-size:x-small" class="setTest4DB" type="text" value="' + data[i].coords + '">';
        cell2.innerHTML = '<textarea id="taText2MapDB" class="texaClass setTest4DB" rows="1" cols="25" placeholder="Texto sobre el mapa" maxlength="100">' + data[i].text + '</textarea><span style="font-size: small;"></span>';
        cell3.innerHTML = '<input type="button" onclick="btnPOIsUpdown(this,\'up\',\'tableTexts\')" value="⬆️"><input type="button" onclick="btnPOIsUpdown(this,\'down\',\'tableTexts\')" value="⬇️"><input type="button" onclick="btnPOIsView(this,\'tableTexts\',1)" value="👁️"><input type="button" onclick="btnPOIsSUPR(this,\'tableTexts\')" value="🗑️">';

    }
    TextAreaFn();
    $("#adminLoginPnl").css("max-height", window.innerHeight / 1.15);
};

function setWaypoisOptions(thisData, tracks) {

    var data = [
        {
            IDwaypois: 'NEW:', coords: '', type: 'start', lang: 'ES',
            image: '', tilt: '0', track: document.getElementById('selectTrackPOIs').value,
            title_ES: '', title_EN: '', title_DE: '', title_FR: '', title_AST: '',
            text_ES: '', text_EN: '', text_DE: '', text_FR: '', text_AST: ''
        }
    ];

    if (thisData) {
        //borra tablas si las hubiera
        var tablePOIs = document.getElementById('waypois');
        tablePOIs.innerHTML = "";

        data = JSON.parse(JSON.stringify(thisData));
    }

    if (tracks && tracks.length) {
        for (let i = 0; i < tracks.length; i++) {
            var node = document.getElementById("tablePOIs");
            var tablePOIsClone = node.cloneNode(true);
            tablePOIsClone.id = 'tablePOIs' + tracks[i].IDtracks;
            tablePOIsClone.style.display = 'block';
            document.getElementById("waypois").appendChild(tablePOIsClone);
        }
    }

    for (let i = 0; i < data.length; i++) {

        var tablePOIs = document.getElementById('tablePOIs' + data[i].track).getElementsByTagName('tbody')[0];
        if (tablePOIs) {
            let row = tablePOIs.insertRow();
            let cell0 = row.insertCell();
            let cell1 = row.insertCell();
            let cell2 = row.insertCell();
            let cell3 = row.insertCell();
            let cell4 = row.insertCell();
            let cell5 = row.insertCell();
            let cell6 = row.insertCell();
            let cell7 = row.insertCell();
            let cell8 = row.insertCell();

            cell0.innerHTML = data[i].IDwaypois;
            cell0.className = 'hide-column';
            cell1.innerHTML = data[i].track;
            cell1.className = 'hide-column';
            cell2.innerHTML = '<input type="button" onclick="setPOI3d(this,\'up\',\'tablePOIs\')" value="Señalar POI"><br><span style="font-size:x-small">xyz:</span><input id="coordsPoiDB" style="font-size:x-small" class="setTest4DB" type="text" value="' + data[i].coords + '">';
            cell3.innerHTML = '<select class="setTest4DB" id="slctTypePoi">\
                        <option value="meta">🏁 Meta</option>\
                        <option value="start">🚩 Salida</option>\
                        <option value="alert">⚠️ Alerta</option>\
                        <option value="danger">❗ Peligro</option>\
                        <option value="cross">🔀 Cruce</option>\
                        <option value="endAlert">🔕 Fin de Alerta</option>\
                        <option value="foodwhater">🍏 Abituallamiento</option>\
                        <option value="whater">💧 Agua</option>\
                        <option value="health">⛑️ Salud</option>\
                        <option value="time">⏱️ Control de tiempo</option>\
                        <option value="view">🌄 Vistas</option>\
                        <option value="fans">🎉 Zona de Público</option>\
                        <option value="Info">ℹ️ Punto Información</option>\
                        <option value="check">✅ Punto control</option>\
                    </select>';
            cell4.innerHTML = '<div style="width:28px;float:left">es</div><textarea id="taTitlePoiDB__ES" class="texaClass setTest4DB" rows="2" cols="10" placeholder="Título del punto - ES" maxlength="100">' + data[i].title_ES + '</textarea><span style="font-size: small;"></span><br/>\
                                <div style="width:28px;float:left">en</div><textarea id="taTitlePoiDB__EN" class="texaClass setTest4DB" rows="2" cols="10" placeholder="Título del punto - EN" maxlength="100">' + data[i].title_EN + '</textarea><span style="font-size: small;"></span><br/>\
                                <div style="width:28px;float:left">de</div><textarea id="taTitlePoiDB__DE" class="texaClass setTest4DB" rows="2" cols="10" placeholder="Título del punto - DE" maxlength="100">' + data[i].title_DE + '</textarea><span style="font-size: small;"></span><br/>\
                                <div style="width:28px;float:left">fr</div><textarea id="taTitlePoiDB__FR" class="texaClass setTest4DB" rows="2" cols="10" placeholder="Título del punto - FR" maxlength="100">' + data[i].title_FR + '</textarea><span style="font-size: small;"></span><br/>\
                                <div style="width:28px;float:left">ast</div><textarea id="taTitlePoiDB__AST" class="texaClass setTest4DB" rows="2" cols="10" placeholder="Título del punto - AST" maxlength="100">' + data[i].title_AST + '</textarea><span style="font-size: small;"></span>';

            cell5.innerHTML = '\
                        <div style="width:28px;float:left">es</div><textarea id="taParagPoiDB__ES" class="texaClass setTest4DB" id="texaIntroUser" rows="2" cols="15"\
							placeholder="Párrafo sobre el punto - ES" maxlength="600">' + data[i].text_ES + '</textarea><span style="font-size: small;"></span><br>\
                        <div style="width:28px;float:left">en</div><textarea id="taParagPoiDB__EN" class="texaClass setTest4DB" id="texaIntroUser" rows="2" cols="15"\
							placeholder="Párrafo sobre el punto - EN" maxlength="600">' + data[i].text_EN + '</textarea><span style="font-size: small;"></span><br>\
                        <div style="width:28px;float:left">de</div><textarea id="taParagPoiDB__DE" class="texaClass setTest4DB" id="texaIntroUser" rows="2" cols="15"\
							placeholder="Párrafo sobre el punto - DE" maxlength="600">' + data[i].text_DE + '</textarea><span style="font-size: small;"></span><br>\
                        <div style="width:28px;float:left">fr</div><textarea id="taParagPoiDB__FR" class="texaClass setTest4DB" id="texaIntroUser" rows="2" cols="15"\
							placeholder="Párrafo sobre el punto - FR" maxlength="600">' + data[i].text_FR + '</textarea><span style="font-size: small;"></span><br>\
                        <div style="width:28px;float:left">ast</div><textarea id="taParagPoiDB__AST" class="texaClass setTest4DB" id="texaIntroUser" rows="2" cols="15"\
							placeholder="Párrafo sobre el punto - AST" maxlength="600">' + data[i].text_AST + '</textarea><span style="font-size: small;"></span>';

            cell6.innerHTML = '<span style="font-size: smaller;">👉 700x400px JPG</span><br><input type="file" class="newImageDB" value="Subir Imagen"  accept="image/*"><br><span id="imgPoiDB"style="font-size:x-small">img:' + data[i].image + '</span>';
            cell7.innerHTML = '<span style="font-size: smaller;">👉 Inclinar señalización<br>(↖️.↗️)</span><br>\
                    <select class="setTest4DB" id="slctTiltPoi">\
                        <option value="0">🙅‍♂️ No</option>\
                        <option value="R">↗️ Right</option>\
                        <option value="L">↖️ Left</option>\
                    </select>';
            cell8.innerHTML = '<input type="button" onclick="btnPOIsUpdown(this,\'up\',\'tablePOIs\')" value="⬆️"><input type="button" onclick="btnPOIsUpdown(this,\'down\',\'tablePOIs\')" value="⬇️"><input type="button" onclick="btnPOIsView(this,\'tablePOIs\',2)" value="👁️"><input type="button" onclick="btnPOIsSUPR(this,\'tablePOIs\')" value="🗑️">';

            cell3.getElementsByTagName('select')[0].value = data[i].type;
            cell7.getElementsByTagName('select')[0].value = data[i].tilt;
        }
    }
    TextAreaFn();
    selectTrackPOIs();
    $("#adminLoginPnl").css("max-height", window.innerHeight / 1.15);
};

function selectTrackPOIs() {
    var tablePOIs = document.getElementById('waypois').children;
    var selectTrackPOIsVal = document.getElementById('selectTrackPOIs').value;

    for (let i = 0; i < tablePOIs.length; i++) {
        const tablePOIsI = tablePOIs[i];
        var display = 'none';
        if (tablePOIsI.id == 'tablePOIs' + selectTrackPOIsVal) {
            display = 'block';
        }
        tablePOIsI.style.display = display;
    }
};

function getDaTest4DB() {
    var dt4DBelem = document.getElementsByClassName('setTest4DB');
    var dt4DB = {};
    for (let i = 0; i < dt4DBelem.length; i++) {
        var rowIndex = '';
        var indexDB = '';
        var dt4DBelemI = dt4DBelem[i];
        var colDB = '';
        var trackID = '';

        if (dt4DBelemI.parentElement.nodeName == 'TD') {
            var tableID = dt4DBelem[i];
            while (tableID.nodeName !== 'TABLE') {
                tableID = tableID.parentElement;
            }

            var colIndex = dt4DBelemI.parentElement.cellIndex;
            rowIndex = dt4DBelemI.parentElement.parentElement.sectionRowIndex;

            if (dt4DBelemI.parentElement.parentElement.children[0].className == 'hide-column')
                indexDB = dt4DBelemI.parentElement.parentElement.children[0].innerText;

            if (dt4DBelemI.parentElement.parentElement.children[1].className == 'hide-column')
                trackID = dt4DBelemI.parentElement.parentElement.children[1].innerText;

            var idSplit = dt4DBelemI.id.split('__');

            var addID = (idSplit[1]) ? ('_' + idSplit[1]) : ('');

            colDB = document.querySelector('#' + tableID.id + ' th:nth-child(' + (colIndex + 1) + ')').id + addID;
        }

        var tableDB = dt4DBelem[i];
        while (tableDB.nodeName !== 'SECTION') {
            tableDB = tableDB.parentElement;
        }

        //if (tableDB.id == 'text2map') { rowIndex = ''; }

        var val2DB = '0';
        if (dt4DBelemI.type && dt4DBelemI.type == 'checkbox' && dt4DBelemI.checked) {
            val2DB = '1';
        } else {
            val2DB = dt4DBelemI.value || dt4DBelemI.innerText;
        }

        dt4DB[dt4DBelemI.id + '_rowTab_' + rowIndex + '_rowTab_' + '_tabDB_' + tableDB.id + '_tabDB_' + '_colDB_' + colDB + '_colDB_' + '_idDB_' + indexDB + '_idDB_' + '_trackID_' + trackID + '_trackID_'] = val2DB;

    }
    return dt4DB;
};

function getNewDaTest4DB() {
    //COMPARE OBJECTS OLD - NEW
    var newdt4DB = getDaTest4DB();
    var data4DB = {};
    Object.keys(newdt4DB).forEach(function (key) {
        if (newdt4DB[key] !== TR3cfg.oridt4DB[key]) {
            data4DB[key] = newdt4DB[key];
        };

    });

    //DELETE
    var data = { DELETE: [], INSERT: [], UPDATE: [], IMAGES: [] };
    if (TR3cfg.oridt4DB && TR3cfg.oridt4DB.DELETE)
        data.DELETE = JSON.parse(JSON.stringify(TR3cfg.oridt4DB.DELETE));

    //ADD IMAGES
    if (TR3cfg.oridt4DB && TR3cfg.oridt4DB.IMAGES)
        data.IMAGES = JSON.parse(JSON.stringify(TR3cfg.oridt4DB.IMAGES));

    //FORMATING OBJECT
    Object.keys(data4DB).forEach(function (key) {
        if (key.split('_idDB_')[1] != '') {
            if (key.split('_idDB_')[1].indexOf('NEW:') !== -1) {
                var obj = {};
                if (key.split('_tabDB_')[1] == 'text2map') {
                    obj = { ID: 'text2map' + key.split('_idDB_')[1], table: 'text2map', [key.split('_colDB_')[1]]: data4DB[key], short: key.split('_rowTab_')[1] };
                } else {
                    obj = {
                        ID: 'waypois' + key.split('_idDB_')[1], table: 'waypois', short: key.split('_rowTab_')[1], [key.split('_colDB_')[1]]: data4DB[key], track: key.split('_trackID_')[1],
                        image: document.getElementById('tablePOIs' + key.split('_trackID_')[1])
                            .getElementsByTagName('tbody')[0].rows[key.split('_rowTab_')[1] * 1].querySelector('#imgPoiDB').lastChild.nodeValue.replace('img:', '')
                    };
                }
                data.INSERT.push(obj);
            } else {
                var obj = {};
                if (key.split('_tabDB_')[1] == 'text2map') {
                    obj = { ID: 'text2map' + key.split('_idDB_')[1], table: 'text2map', IDtext2map: key.split('_idDB_')[1], [key.split('_colDB_')[1]]: data4DB[key] };
                } else if (key.split('_tabDB_')[1] == 'waypois') {
                    obj = { ID: 'waypois' + key.split('_idDB_')[1], table: 'waypois', IDwaypois: key.split('_idDB_')[1], short: key.split('_rowTab_')[1], [key.split('_colDB_')[1]]: data4DB[key] };
                } else {
                    obj = { ID: 'tracks' + key.split('_idDB_')[1], table: 'tracks', IDtracks: key.split('_idDB_')[1], [key.split('_colDB_')[1]]: data4DB[key] };
                }
                data.UPDATE.push(obj);
            }
        } else {
            var globalsUpdate = {};
            var keyCol = key.split('___');
            if (keyCol[1] && (keyCol[1] == 'title' || keyCol[1] == 'text')) {
                globalsUpdate = { table: 'globals_lang', [keyCol[1]]: data4DB[key], lang: keyCol[2] };
            } else {
                globalsUpdate = { table: 'globals', [keyCol[1]]: data4DB[key] };
            }
            data.UPDATE.push(globalsUpdate);
        }
    });

    //COMPRESS 2 SQL ARRAYS
    var dataSQL = { DELETE: [], INSERT: [], UPDATE: [], IMAGES: [] };
    Object.keys(data).forEach(function (key) {
        var dataKey = data[key];
        dataSQL[key].push(data[key][0]);
        for (let i = 1; i < dataKey.length; i++) {
            var dataKeyI = dataKey[i];
            if (dataKeyI.short && dataKeyI.ID == dataSQL[key][dataSQL[key].length - 1].ID && dataKeyI.short == dataSQL[key][dataSQL[key].length - 1].short) {
                jQuery.extend(dataSQL[key][dataSQL[key].length - 1], dataKeyI); //MERGE
            } else {
                dataSQL[key].push(dataKeyI); //PUSH
            }
        }
    });
    return dataSQL;
};

function saveDataTrail(reload) {
    var newData4DB = getNewDaTest4DB();
    //console.log(newData4DB);
    setDataTrail(newData4DB, reload);
    document.getElementById("saveUser2DB").innerHTML = "Salvando...🛠️"
};

function fillConfigProj(data) {

    var idiomaxExt = {};
    var msgsTtl = {};
    var msgsTxt = {};
    var numIDIOMs = data[0].length;

    for (let i = 0; i < numIDIOMs; i++) {
        const dataLangIdx = data[0][i];
        msgsTtl[dataLangIdx.lang] = htmlDecode(dataLangIdx.title);
        msgsTxt[dataLangIdx.lang] = htmlDecode(dataLangIdx.text);
    }

    idiomaxExt['globals_title'] = { message: msgsTtl };
    idiomaxExt['globals_text'] = { message: msgsTxt };

    TR3cfg.mineColor = data[0][0].color;
    document.documentElement.style.setProperty('--mineColor', TR3cfg.mineColor);
    var titleTrail = htmlDecode(data[0][0].title);

    document.title = titleTrail;
    //document.title.setAttribute("idiomax", 'globals_title');
    document.querySelector('meta[name="description"]').setAttribute("content", titleTrail);

    document.querySelector('meta[property="twitter:description"]').setAttribute("content", titleTrail);
    document.querySelector('meta[property="og:description"]').setAttribute("content", titleTrail);
    document.querySelector('meta[property="og:site_name"]').setAttribute("content", titleTrail);
    document.querySelector('meta[property="og:title"]').setAttribute("content", titleTrail);

    document.getElementById('contIntro').setAttribute("style", "background: linear-gradient(180deg, rgba(0, 0, 0, 0) 73.58%, rgba(0, 0, 0, 0.74) 100%), \
        url(" + TR3cfg.pathProjDir + "skin/" + data[0][0].image + ") no-repeat center/cover rgb(0 0 0) !important");
    document.getElementById('logoIntro').src = TR3cfg.pathProjDir + "skin/" + data[0][0].logo;
    document.getElementById('logoIntro').style.content = "url('')";

    document.getElementById('textContIntro').setAttribute("idiomax", 'globals_text');

    document.getElementById('imagePatreon').src = TR3cfg.pathProjDir + "skin/" + data[0][0].patreons;

    if (data[0][0].autoOpen * 1) { $("#dlgImagePatreon").dialog('open'); }

    tracksTrail = data[1] || new Array();
    for (let i = 0; i < tracksTrail.length; i++) {
        tracksTrail[i].arrWayPois = new Array();
    }

    for (let i = 0; i < tracksTrail.length; i++) {
        document.getElementById('selectTrack').innerHTML += '<option id="' + tracksTrail[i].gpx + '">' + tracksTrail[i].name + '</option>';

        document.getElementById('dlgDownTracksForm').innerHTML += '\
		<div style="border-bottom: solid 1px #ccc;">\
			<button class="btnTrack" onclick="TR3cfg.downTrack(\''+ tracksTrail[i].gpx + '\')">\
				<div> <img src="./skin/icon-download.svg"> <span idiomax="download" id="download">Descargar</span> </div>\
			</button>\
			<p style="color:black">'+ htmlDecode(tracksTrail[i].name) + '</p>\
			<p style="font-size: small;color:#aaa">'+ htmlDecode(tracksTrail[i].place) + " | " + htmlDecode(tracksTrail[i].date) + " | " + htmlDecode(tracksTrail[i].info) + '</p>\
		</div>';
    };

    TR3cfg.objText2map = [];
    if (data[2])
        for (let i = 0; i < data[2].length; i++) {
            const txt2mI = data[2][i];
            TR3cfg.objText2map.push({ text: txt2mI.text, pos: txt2mI.coords.split(','), scale: 1, lookAtXY: true });

        }

    const objText2map_Interval = setInterval(function () {
        if (TR3.config.src) {
            objText2map_IntervalStop();

            for (let i = 0; i < TR3cfg.objText2map.length; i++) {
                var txti = TR3cfg.objText2map[i];
                let textMap = TR3.makeTextMap(htmlDecode(txti.text),
                    {
                        pos: txti.pos,
                        font: '28px Arial',
                        bgColor: 'rgba(0, 0, 0, 0)',
                        textColor: '#fff',
                        height: 95,
                        rotate: false,
                        stroke: { color: 'rgb(0, 0, 0)', width: 5 }
                    });
                //textMap.name = 'textMap';
                //textMap.renderOrder = -1;
                textMap.material.depthTest = false;
                textMap.renderOrder = 1;
                textMap.scale.multiplyScalar(txti.scale * .7);
                if (txti.lookAtXY) {
                    textMap.geometry.rotateX(-Math.PI / 2 + .25);
                    TR3.lookAtXY.push(textMap);
                }
                TR3cfg.Text2map3d.push(textMap);
                TR3.scene.add(textMap);
            }
        }
    }, 100);

    function objText2map_IntervalStop() {
        clearInterval(objText2map_Interval);
    }

    var colorPoi = { start: '#00ff00', meta: '#00ffff', alert: '#ffff00', endAlert: '#ffff00', danger: '#ff0000', check: '#000000' };

    if (data[3])
        for (let i = 0; i < data[3].length; i++) {
            for (let j = 0; j < tracksTrail.length; j++) {
                if (tracksTrail[j].IDtracks == data[3][i].track) {
                    const poi2mI = data[3][i];
                    IDwaypois = poi2mI.IDwaypois;

                    idiomaxExt['wayPOIs_title_' + IDwaypois] = { message: {ES: htmlDecode(poi2mI.title_ES), EN: htmlDecode(poi2mI.title_EN), 
                                                                            DE: htmlDecode(poi2mI.title_DE), FR: htmlDecode(poi2mI.title_FR), AST: htmlDecode(poi2mI.title_AST)} };
                    idiomaxExt['wayPOIs_text_' + IDwaypois] = { message: {ES: htmlDecode(poi2mI.text_ES), EN: htmlDecode(poi2mI.text_EN), 
                                                                            DE: htmlDecode(poi2mI.text_DE), FR: htmlDecode(poi2mI.text_FR), AST: htmlDecode(poi2mI.text_AST)} };

                    var thisColorPoi = colorPoi[poi2mI.type];
                    var thisTilt = 0
                    if (poi2mI.tilt == 'L') { thisTilt = 0.35; } else if (poi2mI.tilt == 'R') { thisTilt = -0.35; }
                    if (!thisColorPoi) { thisColorPoi = '#51a6df' }
                    tracksTrail[j].arrWayPois.push({
                        point: poi2mI.coords.split(','),
                        type: poi2mI.type,
                        tilt: thisTilt,
                        color: thisColorPoi,
                        idArrPoi: poi2mI.short * 1,
                        slctItem: '\
            <p onclick="$(\'#dlgIFCdoc\').dialog(\'close\');" class="close-modal-style" ><img src="./skin/icon-close.svg"></p>\
	        <h6 idiomax='+ 'wayPOIs_title_' + IDwaypois + ' ></h6>\
	        <div style="margin:auto;overflow: hidden; border-radius:  10px;">\
	        <img src=' + TR3cfg.pathProjImgs + poi2mI.image + ' alt="Imagen del punto de interés" title="Imagen del punto de interés"></div>\
	        <p idiomax="'+ 'wayPOIs_text_' + IDwaypois + '" style=" font-size:medium;min-height:66px;"></p >'
                    });
                }
            }
        }

    jQuery.extend(TR3cfg.idiomax.text, idiomaxExt);

    idiomaxExt = {};

    /*for (let i = 0; i < tracksTrail.length; i++) {
        if (tracksTrail[i]) {
            var tktliArr = tracksTrail[i].arrWayPois;
            for (let j = 0; j < tktliArr.length; j++) {
                tktliArr[j].idArrPoi = j;
            }
        }
    }*/
    TR3cfg.idiomax.set(TR3cfg.idiomax.actual);
};

//getDataTrail(true);

var beforeActiveElement;
function getFocused() {
    beforeActiveElement = document.activeElement;
}

function setTagAtCursor(tag) {
    var selection = window.getSelection();
    var slct2str = selection.toString();
    if (slct2str && slct2str !== '') {
        var node = beforeActiveElement;
        if (node.tagName !== 'TEXTAREA') { return false; }
        var inpTxt = node.value;
        node.value = inpTxt.replace(slct2str, '#' + tag + '|' + slct2str + '|' + tag + '#');
    }
}

function setSingleTagAtCursor(tag) {
    var el = beforeActiveElement;
    if (el.tagName !== 'TEXTAREA') { return false; }
    const [start, end] = [el.selectionStart, el.selectionEnd];
    el.setRangeText(tag, start, end, 'select');
}

function decodeCustomTags(text) {

    return text.replaceAll('#b|', '<strong>').replaceAll('|b#', '</strong>')
        .replaceAll('#u|', '<u>').replaceAll('|u#', '</u>')
        .replaceAll('#i|', '<i>').replaceAll('|i#', '</i>')
        .replaceAll('#a|', '<a idiomax="saberM" style="color: chocolate" target="_blank" href="').replaceAll('|a#', '">link</a>')
        .replaceAll('#br|', '<br>')

}

function htmlDecode(input) {
    var e = document.createElement('textarea');
    e.innerHTML = input;
    // handle case of empty input
    return decodeCustomTags(e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue);
};