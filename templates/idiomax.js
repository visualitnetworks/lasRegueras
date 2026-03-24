"use strict";
/**
 * Clase que se encarga de los textos de idioma,
 * y la lógica del intercambio de los textos
 * @class idiomax
 */

/**
 * Objeto de la clase
 * @public
 */
TR3cfg.idiomax = {
    text: {}, actual: "", enable: !TR3cfg.idiomaxEnable, includes: ['ES', 'EN', 'FR', 'PT'], default: 'ES'
};

/**
 * Función de carga de textos de idioma en objeto
 */
function loadIdiomax() {
    TR3cfg.idiomax.text = {
        "idiomBtnES": {
            "message": {
                "ES": "Español",
                "EN": "Spanish",
                "FR": "Espagnol",
                "PT": "Espanhol"
            },
            "description": "indica que el idioma está en español"
        },

        "idiomBtnEN": {
            "message": {
                "ES": "Inglés",
                "EN": "English",
                "FR": "Anglais",
                "PT": "Inglês"
            },
            "description": "indica que el idioma está en inglés"
        },

        "idiomBtnFR": {
            "message": {
                "ES": "Francés",
                "EN": "French",
                "FR": "Français",
                "PT": "Francês"
            },
            "description": "indica que el idioma está en francés"
        },

        "idiomBtnPT": {
            "message": {
                "ES": "Portugués",
                "EN": "Portuguese",
                "FR": "Portugais",
                "PT": "Português"
            },
            "description": "indica que el idioma está en portugués"
        },

        "idiomBtn": {
            "message": {
                "ES": "Idioma",
                "EN": "Language",
                "FR": "Langue",
                "PT": "Idioma"
            },
            "description": "botón que permite acceder a los diferentes idiomas"
        },

        "globalView": {
            "message": {
                "ES": "Centrar",
                "EN": "Initial",
                "FR": "Centrer",
                "PT": "Centrar"
            },
            "description": "botón que ubica al usuario en la posición inicial"
        },

        "downTrack": {
            "message": {
                "ES": "Información",
                "EN": "Information",
                "FR": "Informations",
                "PT": "Informação"
            },
            "description": "botón que muestra información general del visor"
        },

        "saberM": {
            "message": {
                "ES": "saber más",
                "EN": "Learn more",
                "FR": "en savoir plus",
                "PT": "saiba mais"
            },
            "description": "Aplicado a enlaces que abren en ventana nueva para documentar al usuario"
        },

        "legalInfo": {
            "message": {
                "ES": "Información Legal",
                "EN": "Legal Information",
                "FR": "Informations légales",
                "PT": "Informações legais"
            },
            "description": "Indica el título del diálogo para las atribuciones y copyright"
        },

        "download": {
            "message": {
                "ES": "Descargar",
                "EN": "Download",
                "FR": "Télécharger",
                "PT": "Baixar"
            },
            "description": "Texto de cada botón que permite descargar el recorrido que indica de la carrera"
        },

        "loading": {
            "message": {
                "ES": "Cargando",
                "EN": "Loading",
                "FR": "Chargement",
                "PT": "Carregando"
            },
            "description": "Texto de la barra de carga antes de entrar en la app"
        },

        "introTtl": {
            "message": {
                "ES": "Villa Romana de La Estaca",
                "EN": "Roman Villa (3rd–4th Century)",
                "FR": "Villa Romaine (IIIe–IVe siècle)",
                "PT": "Villa Romana (séculos III–IV)"
            },
            "description": "Título de diálogo de portada que invita al usuario a ver la información del espacio"
        },

        "devBy": {
            "message": {
                "ES": "Desarrollado por",
                "EN": "Developed by",
                "FR": "Développé par",
                "PT": "Desenvolvido por"
            },
            "description": "Indica que la app ha sido desarrollada por (terre3)"
        },

        "mapsBy": {
            "message": {
                "ES": "Mapas ofrecidos por ",
                "EN": "Maps offered by ",
                "FR": "Cartes proposées par ",
                "PT": "Mapas oferecidos por "
            },
            "description": "Indica la entidad que ofrece los mapas"
        },

        "startNow": {
            "message": {
                "ES": "Comenzar ahora",
                "EN": "Start now",
                "FR": "Commencer maintenant",
                "PT": "Começar agora"
            },
            "description": "Texto de la barra de carga justo al entrar en la app (500ms)"
        },




        "globals_text": {
            "message": {
                "ES": "Data de finales del siglo II d.C. En ella se encontraron dos importantes mosaicos. Además, los investigadores creen que esta gran villa no era la única construcción de la zona, sino que a su alrededor se erigía todo un núcleo poblacional.",
                "EN": "The main building has a floor plan of approximately 700 square meters, arranged around two courtyards that structure the distribution of its rooms, some of which feature mosaic flooring and mural paintings.",
                "FR": "Le bâtiment principal couvre une superficie d’environ 700 mètres carrés et s'organise autour de deux cours qui structurent la répartition des pièces, dont certaines sont décorées de mosaïques et de peintures murales.",
                "PT": "O edifício principal possui uma planta de cerca de 700 metros quadrados, organizada em torno de dois pátios que estruturam a distribuição dos espaços, alguns deles decorados com pavimentos de mosaico e pinturas murais."
            },
            "description": "Texto descriptivo general del espacio patrimonial"
        },

        "TtlGPS": {
            "message": {
                "ES": "Tu experiencia mejora con la ubicación activada",
                "EN": "Your experience improves with location enabled",
                "FR": "Votre expérience est meilleure avec la localisation activée",
                "PT": "Sua experiência melhora com a localização ativada"
            },
            "description": "Mensaje del título del diálogo que avisa al usuario que debe habilitar la función GPS del móvil"
        },
        "bdyGPS": {
            "message": {
                "ES": "Para poder disfrutar de todas las funcionalidades del recorrido debes activar tu ubicación.",
                "EN": "Enable your phone’s GPS to enjoy all track features.",
                "FR": "Pour profiter de toutes les fonctionnalités du parcours, activez la localisation de votre téléphone.",
                "PT": "Para aproveitar todos os recursos do percurso, ative a localização do seu telefone."
            },
            "description": "Mensaje del cuerpo del diálogo que avisa al usuario que debe habilitar la función GPS del móvil"
        },
        "activeLoc": {
            "message": {
                "ES": "Activar ubicación",
                "EN": "Enable location",
                "FR": "Activer la localisation",
                "PT": "Ativar localização"
            },
            "description": "texto en el botón para activar la geolocalización del usuario"
        },
        "state": {
            "message": {
                "ES": "Estado",
                "EN": "Status",
                "FR": "État",
                "PT": "Estado"
            },
            "description": "Estado de permisos del GPS del usuario"
        },
        "bdyStateGPS": {
            "message": {
                "ES": "Ha de habilitar la Geolocalización en el dispositivo y permitir acceso al navegador.<br><br>Consulte cómo aquí:",
                "EN": "Please enable geolocation on your device and allow access in your browser.<br><br>Learn how here:",
                "FR": "Veuillez activer la géolocalisation sur votre appareil et autoriser l'accès dans votre navigateur.<br><br>Découvrez comment ici :",
                "PT": "Ative a geolocalização no seu dispositivo e permita o acesso no navegador.<br><br>Saiba como aqui:"
            },
            "description": "Indica al usuario que ha de habilitar la geolocalización GPS y le ofrece enlaces de consulta"
        },
        "tryAgain": {
            "message": {
                "ES": "Reintentar",
                "EN": "Try Again",
                "FR": "Réessayer",
                "PT": "Tentar novamente"
            },
            "description": "texto del botón que permite averiguar el permiso para acceder a la función GPS del dispositivo"
        },
        "cancelGPS": {
            "message": {
                "ES": "Deshabilitar Geolocalización",
                "EN": "Disable geolocation",
                "FR": "Désactiver la géolocalisation",
                "PT": "Desativar geolocalização"
            },
            "description": "texto de botón que permite dejar de usar la geolocalización del dispositivo"
        },
        "next2placeTtl": {
            "message": {
                "ES": "Parece que estás alejado del recorrido",
                "EN": "Looks like you're currently away from the track.",
                "FR": "Il semble que vous soyez éloigné du parcours",
                "PT": "Parece que você está afastado do percurso"
            },
            "description": "título del diálogo que indica al usuario que probablemente no esté en la zona de uso prevista para el GPS"
        },
        "next2placePrf": {
            "message": {
                "ES": "Revisa tu ubicación y activa la geolocalización cuando te encuentres por los alrededores de la zona.",
                "EN": "Make sure to check your location and turn on geolocation when you're nearby.",
                "FR": "Vérifiez votre position et activez la géolocalisation lorsque vous êtes à proximité.",
                "PT": "Verifique sua localização e ative a geolocalização quando estiver próximo da área."
            },
            "description": "cuerpo del diálogo que indica al usuario que probablemente no esté en la zona de uso prevista para el GPS"
        }
    }

};

/**
 * Creación e inicialización del sistema de idioma
 * 
 * @public
 * @param {string} idi - Idioma principal, para carga inicial
 * @param {boolean} insert - Si se crea el interfaz para cambio de idioma
 * @param {Array} includes - Idiomas que se incluyen para estar disponibles
 */
TR3cfg.idiomax.make = function (idi, insert, includes) {
    loadIdiomax();

    if (insert) {
        var addIdiom = '';
        var lang2include = includes || TR3cfg.idiomax.includes;
        TR3cfg.idiomax.includes = lang2include;
        for (let i = 0; i < lang2include.length; i++) {
            var key = lang2include[i];
            if (!i % 2) {
                addIdiom += '<span onclick="TR3cfg.idiomax.set(\'' + key + '\')"\
                    style="float: left">'+ key + '\
                </span>'
            } else {
                addIdiom += '<span style="float: left;color: ' + TR3cfg.mineColor + '">&nbsp;|&nbsp;</span>\
                <span onclick="TR3cfg.idiomax.set(\''+ key + '\')"\
                    style="float: left">'+ key + '\
                 </span>'
            }
        };
        var insertHtml = '\
        <span title="languages" id="idio" style="z-index:10000001 !important;position:absolute;bottom:2px;right:45px;color: #ccc; font-size: small; cursor: pointer">\
        '+ addIdiom + '\
        </span >';

        document.body.insertAdjacentHTML('afterbegin', insertHtml);
    } else {
        TR3cfg.idiomax.includes = [idi];
    }

    TR3cfg.loadIdiomClassExt = setInterval(function () {
        if (TR3cfg.loadIdiomaxExtClass) {
            clearInterval(TR3cfg.loadIdiomClassExt);

            loadIdiomaxExt();
            TR3cfg.idiomax.set(idi || TR3cfg.idiomax.get());
            document.getElementById("seccIntro").style.display = 'flex';
        }
    }, 100);
};

/**
 * Aplica el idioma al entorno web, cambiando los textos 
 * asociados al objeto de textos de idioma
 * 
 * @public
 * @param {string} idiom texto de idioma según el estandat, Ej: "ES" para español
 * @example
 * TR3cfg.idiomax.set('ES');
 * TR3cfg.idiomax.set(TR3cfg.idiomax.get());
 */
TR3cfg.idiomax.set = function (idiom) {

    var idi = idiom || TR3cfg.idiomax.get();
    var thisIdioma = TR3cfg.idiomax.text;
    document.querySelectorAll('[idiomax]').forEach(function (el) {
        var idEleI = el.getAttribute('idiomax');
        if (thisIdioma[idEleI] && thisIdioma[idEleI].message) el.innerHTML = thisIdioma[idEleI].message[idi];
    });
    if (thisIdioma.globals_title && thisIdioma.globals_title.message) {
        document.title = thisIdioma.globals_title.message[idi];
    }

    var idiomaxLI = document.getElementsByClassName("idiomaxLI");
    for (let i = 0; i < idiomaxLI.length; i++) {
        idiomaxLI[i].style.textDecoration = 'none';
    }
    document.querySelector('[idiomax=idiomBtn'+idiom+']').style.textDecoration = 'underline';

    /*for (let i = 0; i < TR3cfg.Text2map3d.length; i++) {
        TR3.scene.remove(TR3cfg.Text2map3d[i]);
    }
    TR3cfg.Text2map3d = [];

    TR3cfg.loadMap3d = setInterval(function () {
        if (TR3.mesh && TR3cfg.tileGroup) {
            clearInterval(TR3cfg.loadMap3d);
            for (let i = 0; i < TR3cfg.objText2map.length; i++) {
                var txti = TR3cfg.objText2map[i];
                var txt2Mi = TR3cfg.objText2map[i];
                let textMap = TR3.makeTextMap(thisIdioma[txt2Mi.txt].message[idi],
                    {
                        pos: txti.pos,
                        font: '28px Arial',
                        bgColor: 'rgba(0, 0, 0, 0)',
                        textColor: '#fff',
                        height: 90,
                        rotate: false,
                        stroke: { color: 'rgb(0, 0, 0)', width: 5 }
                    });
                //textMap.name = 'textMap';
                textMap.renderOrder = 999;
                textMap.scale.multiplyScalar(txt2Mi.scale);
                if (txt2Mi.lookAtXY) {
                    textMap.geometry.rotateX(-Math.PI / 2 + .25);
                    TR3.lookAtXY.push(textMap);
                }
                TR3cfg.Text2map3d.push(textMap);
                TR3.scene.add(textMap);
            }
        }
    }, 100);*/

    TR3cfg.idiomax.actual = idi;
};

/**
 * Devielve el texto de designación de idioma según el standart
 * a través de las funciones de idioma propias del navegador, tomando los 2 primeros caracteres
 * 
 * @public
 * @returns - Texto de idioma según el estandar de designación de idioma, Ej: "ES" español
 */
TR3cfg.idiomax.get = function () {
    //url or user preference
    var userLang = TR3cfg.idiomax.actual || formURL.lang;
    var idi, thisIdioma;
    if (userLang) {
        idi = userLang.split("-")[0].toUpperCase();//Código ISO-639 https://www.localeplanet.com/icu/
        thisIdioma = false;
        for (let i = 0; i < TR3cfg.idiomax.includes.length; i++) {
            if (TR3cfg.idiomax.includes[i] == idi) { thisIdioma = true; }
        }
    }
    //attending to the navigator languaje
    if (!thisIdioma) {
        userLang = navigator.language || navigator.userLanguage;
        idi = userLang.split("-")[0].toUpperCase();//Código ISO-639 https://www.localeplanet.com/icu/
        for (let i = 0; i < TR3cfg.idiomax.includes.length; i++) {
            if (TR3cfg.idiomax.includes[i] == idi) { thisIdioma = true; }
        }
    }

    //default
    if (!thisIdioma) { idi = TR3cfg.idiomax.default } // idioma por defecto
    return idi;
};
/*fin idiomax.js*/