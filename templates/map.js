ol.proj.proj4.register(proj4);//ol v5.0.0
//var projection = ol.proj.get("EPSG:4258");

/*$.ajax(
    'source/addLibs/hojas_mtn50.xml'
).then(function (request, code, response) {
    var requestScape = response.responseText.replace(/\:/g, "_");
    TR3cfg.H50 = xml2json.parser(requestScape);
    //IIIkel.AFs.skinMap.skin.tVectorEdit.aAddTab[2].getCoordsObjMtn(jsonRequest);
    //ol.proj.transform([1, 42], 'EPSG:4326', 'EPSG:3857');//4258
    for (var i = 0; i < TR3cfg.H50.wfs_featurecollection.gml_featuremember.length; i++) {
        var feati = TR3cfg.H50.wfs_featurecollection.gml_featuremember[i].ideewfs_malla50.gml_boundedby.gml_envelope;
        var min = feati.gml_pos[0];
        var max = feati.gml_pos[1];
        feati.gml_pos3857 = [ol.proj.transform(min.split(' '), 'EPSG:4258', 'EPSG:3857'), ol.proj.transform(max.split(' '), 'EPSG:4258', 'EPSG:3857')];
    }
}
);*/
TR3cfg.checkeableLyrs = new Array();

TR3cfg.vectorLayer = new ol.layer.Vector({
    source: new ol.source.Vector({ wrapX: false }),
    style: new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'rgba(0, 0, 255, 1.0)',
            width: 2,
        }),
    }),
    crossOrigin: 'anonymous'
});

var deepIterArray = function (obj, keyO) {
    var newArr = new Array();
    var cont = 0;
    var iterate = function iterate(obj, keyO) {
        if (obj != null)
            Object.keys(obj).forEach(function (key) {
                for (var i = 0; i < keyO.length; i++) {
                    if (key == keyO[i]) {
                        cont++;
                        var nnArr = new Array();
                        nnArr[key] = obj[key];
                        if (cont % 2) {
                            newArr.push(nnArr);
                        } else {
                            var nnnArr = newArr[newArr.length - 1];
                            newArr[newArr.length - 1] = [nnnArr.exterior.LinearRing.posList._content_, nnArr.numberOfFloorsAboveGround];
                        }
                    }
                }

                if (typeof obj[key] === 'object') {
                    iterate(obj[key], keyO);
                }
            });
    };
    iterate(obj, keyO);
    return newArr;
}

var vectorSourceWFS = new ol.source.Vector({
    format: new ol.format.GML32({
        srsName: 'EPSG:3857', featureProjection: 'EPSG:3857'
    }),
    loader: function (extent) {
        if (TR3cfg.refresWFSbuild) {
            var center = new Array();
            center.push((extent[0] + extent[2]) / 2);
            center.push((extent[1] + extent[3]) / 2);
            var extentFix = TR3cfg.extentFix;
            var extFix = new Array();
            extFix[0] = center[0] - extentFix;
            extFix[1] = center[1] - extentFix;
            extFix[2] = center[0] + extentFix;
            extFix[3] = center[1] + extentFix;

            var fixExtent = extFix;
            if (Math.abs(extent[0] - extent[2]) < 2 * extentFix) {
                fixExtent[0] = extent[0];
                fixExtent[2] = extent[2];
            }
            if (Math.abs(extent[1] - extent[3]) < 2 * extentFix) {
                fixExtent[1] = extent[1];
                fixExtent[3] = extent[3];
            }
            //fixExtent = TR3cfg.loc.bbox;
            TR3cfg.countWFScat = 0;
            var storiesInterval = 3 * 1000;
            var fetchNews = function () {
                $.ajax( //'source/BuGML.txt'
                    /*'./php/proxy.php?url=' + encodeURIComponent('http://ovc.catastro.meh.es/INSPIRE/wfsBU.aspx?service=wfs&' +
                        'version=2&request=GetFeature&typenames=BU.BUILDINGPART&' +
                        'srsname=EPSG:3857&' +
                        'bbox=' +
                        fixExtent.join(','))*/
                ).done(function (response, a, b, c) {//https://bl.ocks.org/ThomasG77/5579a8831db6fa0f5641474e56739201
                    var nResp = response.replaceAll('bu-ext2d:geometry', 'bu-ext2d:geometries');
                    var tmp_feature = new ol.format.GML32({
                        srsName: 'EPSG:3857', featureProjection: 'EPSG:3857'
                    }).readFeatures(nResp);
                    var newArr = deepIterArray(tmp_feature, ['exterior', 'numberOfFloorsAboveGround']);
                    var features = new Array();
                    for (var i = 0; i < newArr.length; i++) {
                        var newArrSub = newArr[i][0].substring(1);
                        var coords = newArrSub.split(' ');
                        var coordsPoly = new Array();
                        for (var j = 0; j < coords.length; j += 2) {
                            coordsPoly.push([Number(coords[j]), Number(coords[j + 1])]); //https://gis.stackexchange.com/questions/298193/add-a-polygon-programmatically-in-openlayers-3
                        }
                        features[i] = new ol.Feature({
                            geometry: new ol.geom.Polygon([coordsPoly]),
                            fAboveG: Number(newArr[i][1])
                        });
                    }
                    //if (TR3cfg.refresWFSbuild) {
                    setBuildings(features);
                    TR3cfg.refresWFSbuild = false;
                    //}
                }).always(function (response) {

                });
            }
            fetchNews();
        }
    },
    /*url: function (extent,a,s,d) {
      var center = new Array();
      center.push((extent[0]+extent[2])/2);
      center.push((extent[1]+extent[3])/2);
      extent[0] = center[0]-500;
      extent[1] = center[1]-500;
      extent[2] = center[0]+500;
      extent[3] = center[1]+500;
      return ('TR3-pack64/Buildings.gml'
        /*'TR3-pack64/proxy.php?url='+encodeURIComponent( 'http://ovc.catastro.meh.es/INSPIRE/wfsBU.aspx?service=wfs&' +
        'version=2&request=GetFeature&typenames=BU.BUILDINGPART&' +
        'srsname=EPSG:3857&' +
        'bbox=' +
        extent.join(','))*//*
);
},*/
    strategy: ol.loadingstrategy.bbox
});


TR3cfg.vectorWFS = new ol.layer.Vector({
    source: vectorSourceWFS,
    style: new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'rgba(0, 0, 255, 0.5)',
            width: 2,
        }),
    }),
    crossOrigin: 'anonymous'
});

/*var vectorWFS2 = new ol.layer.Vector({
  source: new ol.source.Vector({wrapX: false}),
  style: new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'rgba(0, 0, 0, 0)'/*,
      width: 2,*//*
}),
}),
crossOrigin: 'anonymous'
});*/


//var projection = ol.proj.get('EPSG:4326');
var projection = ol.proj.get('EPSG:3857');
var projectionExtent = projection.getExtent();
//var size = ol.extent.getWidth(projectionExtent) / 512;
var size = ol.extent.getWidth(projectionExtent) / 256;
var resolutions = new Array(18);
var matrixIds = new Array(18);
for (var z = 0; z < 18; ++z) {
    // generate resolutions and matrixIds arrays for this WMTS
    resolutions[z] = size / Math.pow(2, z);
    // matrixIds[z] = "EPSG:4326:" + z;
    matrixIds[z] = z;
}

var imageBaseLyr = new ol.layer.Tile({
    //source: new ol.source.OSM({crossOrigin: 'anonymous'})
    //  opacity: 0.7,
    extent: projectionExtent,
    source: new ol.source.WMTS({
        url: '//www.ign.es/wmts/pnoa-ma',
        layer: 'OI.OrthoimageCoverage',
        //matrixSet: 'EPSG:4326',
        matrixSet: 'EPSG:3857',
        //format: 'image/png',
        attributions: "Mapa ofrecidos por «CC BY 4.0 <a href='http://www.scne.es' target='_blank'>SCNE</a>» de su autoría y propiedad.",
        projection: projection,
        tileGrid: new ol.tilegrid.WMTS({
            origin: ol.extent.getTopLeft(projectionExtent),
            resolutions: resolutions,
            matrixIds: matrixIds
        }),
        style: 'default',
        crossOrigin: 'anonymous'
    }),
    name: 'OI.OrthoimageCoverage',
    visible: false
});
TR3cfg.checkeableLyrs.push(imageBaseLyr);

var mtnLyr = new ol.layer.Tile({
    //source: new ol.source.OSM({crossOrigin: 'anonymous'})
    //  opacity: 0.7,
    extent: projectionExtent,
    source: new ol.source.WMTS({
        url: '//www.ign.es/wmts/mapa-raster',
        layer: 'MTN',
        //matrixSet: 'EPSG:4326',
        matrixSet: 'EPSG:3857',
        //format: 'image/png',
        attributions: "Mapa ofrecidos por «CC BY 4.0 <a href='http://www.scne.es' target='_blank'>SCNE</a>» de su autoría y propiedad.",
        projection: projection,
        tileGrid: new ol.tilegrid.WMTS({
            origin: ol.extent.getTopLeft(projectionExtent),
            resolutions: resolutions,
            matrixIds: matrixIds
        }),
        style: 'default',
        crossOrigin: 'anonymous'
    }),
    name: 'MTN',
    visible: false
});
TR3cfg.checkeableLyrs.push(mtnLyr);

var streetLyr = new ol.layer.Tile({
    //source: new ol.source.OSM({crossOrigin: 'anonymous'})
    //  opacity: 0.7,
    extent: projectionExtent,
    source: new ol.source.WMTS({
        url: '//www.ign.es/wmts/ign-base',
        layer: 'IGNBaseTodo',
        //matrixSet: 'EPSG:4326',
        matrixSet: 'EPSG:3857',
        //format: 'image/png',
        attributions: "Mapa ofrecidos por «CC BY 4.0 <a href='http://www.scne.es' target='_blank'>SCNE</a>» de su autoría y propiedad.",
        projection: projection,
        tileGrid: new ol.tilegrid.WMTS({
            origin: ol.extent.getTopLeft(projectionExtent),
            resolutions: resolutions,
            matrixIds: matrixIds
        }),
        style: 'default',
        crossOrigin: 'anonymous'
    }),
    name: 'IGNBaseTodo',
    visible: false
});

TR3cfg.checkeableLyrs.push(streetLyr);
var mapBaseLyr = new ol.layer.Tile({
    source: new ol.source.OSM({
        crossOrigin: 'anonymous',
        attributions: "<a href='https://www.openstreetmap.org/copyright' target='_blank'>openstreetmap copyright</a>"
    }),
    name: 'OSM',
    visible: false
})
TR3cfg.checkeableLyrs.push(mapBaseLyr);

/*var mapBaseLyr = new ol.layer.Image({
        source: new ol.source.ImageWMS({
        url: 'https://www.ign.es/wms-inspire/pnoa-ma',
        ratio: 1,
        params: {LAYERS: 'OI.OrthoimageCoverage'},
        crossOrigin: 'anonymous'
    })
});*/

/*TR3cfg.vectorSource = new ol.source.Vector({
    features: new ol.format.GeoJSON().readFeatures(geojsonObject),
})*/

var routeStyle0 = new ol.style.Style({
    stroke: new ol.style.Stroke({
        color: 'rgba(255,0,0,1)',
        width: 2
    })
});

TR3cfg.checkerVectorLyr = new Array();
var vecTrail = TR3cfg.vecTrail = new ol.layer.Vector({
    source: new ol.source.Vector({
        //url: TR3cfg.pathProjDir + "data/" + tracksTrail[0].gpx + ".gpx",
        url: TR3cfg.pathProjDir + "data/000.gpx",
        format: new ol.format.GPX({extractStyles: false})
    }),
    name: 'vuelta',
    visible: true
    /*style: function(feature) {
        return routeStyle0;
    }*/
});
TR3cfg.checkerVectorLyr.push(vecTrail);

/*var vectorSourceV = new ol.layer.Vector({
    source: TR3cfg.vectorSource,
    style: new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'rgba(0, 0, 255, 0.5)',
            width: 2,
        })
    }),

    name: 'vectorSourceV',
    crossOrigin: 'anonymous'
});*/

TR3cfg.map = new ol.Map({
    target: 'map',
    layers: [
        imageBaseLyr, mapBaseLyr, mtnLyr, streetLyr, TR3cfg.vectorLayer,
        vecTrail,
        TR3cfg.vectorWFS/*, vectorSourceV/*, vectorWFS2*/
    ],
    view: new ol.View({
        center: [TR3cfg.loc.pos.h, TR3cfg.loc.pos.v],
        zoom: TR3cfg.loc.pos.z/*,
        minZoom: 14/*,
        maxZoom: 20,*/
    }),
    interactions: ol.interaction.defaults.defaults({
        /*doubleClickZoom: false,
        dragAndDrop: false,
        dragPan: false,
        keyboardPan: false,
        keyboardZoom: false,
        mouseWheelZoom: false,
            pointer: false,
            select: false*/
    }),
    controls: ol.control.defaults.defaults({ attributionOptions: { collapsible: true } })
});