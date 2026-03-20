'use strict';
//It is the result of javascript function selectedItem
var listenerEvent = {
	//It is the function to invoke this plugin, search the results and respresent these results in the map
	selectedItem: function (event, geoJSONfeatureCollection) {
		//It is included a "resultados" layer in the map
		//var capaResultados = map.getLayersByName('resultados')[0];
		//It is used to represent the geoJSONFeatureCollection in the resultados layer
		//var geojson_format = new OpenLayers.Format.GeoJSON();
		//capaResultados.addFeatures(geojson_format.read(geoJSONfeatureCollection));
		//the next code print in log console the WKT format corresponding to each geoJOSN Feature from geoJSONfeatureCollection

		/**
		* Obtiene el valor maximo de un vector
		* @return valor maximo
		*/
		function maximo(maxi) {
			var num = maxi[0];
			for (var i = 0; i < maxi.length; i++) {
				if (maxi[i] > num) {
					num = maxi[i];
				}
			}
			return (num);
		};

		/**
		 * Obtiene el valor minimo de un vector
		 * @return valor minimo
		 */

		function minimo(mini) {
			var num = mini[0];
			for (var i = 0; i < mini.length; i++) {
				if (mini[i] < num) {
					num = mini[i];
				}
			}
			return (num);
		};
		var Xcoords = new Array();
		var Ycoords = new Array();

		if (geoJSONfeatureCollection.features && geoJSONfeatureCollection.features[0].geometry.coordinates) {

			for (var i = 0; i < geoJSONfeatureCollection.features.length; i++) {
				var coords = geoJSONfeatureCollection.features[i].geometry.coordinates;
				if (coords[i][0] && coords[i][0][0] && coords[i][0][0][0] && typeof (coords[i][0][0][0]) != "string") {
					for (var j = 0; j < coords.length; j++) {
						for (var k = 0; k < coords[j].length; k++) {
							for (var l = 0; l < coords[j][k].length; l++) {
								Xcoords.push(coords[j][k][l][0]);
								Ycoords.push(coords[j][k][l][1]);
							}
						}
					}
				} else if (coords[i][0] && coords[i][0][0] && typeof (coords[i][0][0]) != "string") {
					for (var j = 0; j < coords.length; j++) {
						for (var k = 0; k < coords[j].length; k++) {
							Xcoords.push(coords[j][k][0]);
							Ycoords.push(coords[j][k][1]);
						}
					}
				} else if (coords[i][0] && typeof (coords[i][0]) != "string") {
					for (var j = 0; j < coords.length; j++) {
						Xcoords.push(coords[j][0]);
						Ycoords.push(coords[j][1]);
					}
				}
				else {
					Xcoords.push(coords[0]);
					Ycoords.push(coords[1]);
				}
			}

			var Xmax = maximo(Xcoords);
			var Xmin = minimo(Xcoords);
			var Ymax = maximo(Ycoords);
			var Ymin = minimo(Ycoords);

			if (Xmax == Xmin && Ymax == Ymin) {
				var Xmed = Xmax;
				var Ymed = Ymax;
			} else {
				var Xmed = (Xmax + Xmin) / 2;
				var Ymed = (Ymax + Ymin) / 2;
			}

			var projection = TR3cfg.map.getView().getProjection().getCode();
			var point = ol.proj.transform([Xmed, Ymed], 'EPSG:4326', projection);
			TR3cfg.map.getView().setCenter(point);
			TR3cfg.map.getView().setZoom(TR3cfg.loc.pos.z);
			TR3.setOpts({ autoRotate: true });
		}
	}
};

//The following code is used to call the IGN_search plugin
$(function () {
	//The "searching" div is referenced to call the "search" widget, it is mandatory to use this name for the widget.
	$('#searching').search({
		selected: listenerEvent.selectedItem,
		//geographicNameType collects the types of included geographic names as candidates in the search
		geographicNameType: [
			'Comunidad autónoma',
			'Ciudad con estatuto de autonomía',
			'Provincia',
			'Municipio',
			'EATIM',
			'Isla administrativa',
			'Comarca administrativa',
			'Capital de municipio',
			'Capital de EATIM',
			'Núcleos de población',
			'Entidad colectiva',
			'Entidad menor de población',
			'Entidad singular',
			'Alineación montañosa',
			'Montaña',
			'Paso de montaña',
			'Llanura',
			'Depresión',
			'Vertientes',
			'Comarca geográfica',
			'Paraje',
			'Elemento puntual del paisaje',
			'Saliente costero',
			'Playa',
			'Isla',
			'Otro relieve costero',
			'Parque Nacional y Natural',
			'Espacio protegido restante',
			'Aeropuerto',
			'Aeródromo',
			'Pista de aviación y helipuerto',
			'Puerto de Estado',
			'Instalación portuaria',
			'Carretera',
			'Camino y vía pecuaria',
			'Vía urbana',
			'Ferrocarril',
			'Curso natural de agua',
			'Masa de agua',
			'Curso artificial de agua',
			'Embalse',
			'Hidrónimo puntual',
			'Glaciares',
			'Mar',
			'Entrante costero y estrecho marítimo'],
		// title to include in the drop down menu
		titleBox: 'Places'
	})
});