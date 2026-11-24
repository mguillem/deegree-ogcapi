<template>
    <div id="map" class="map">
        <div id="info"></div>
    </div>
</template>

<script>
import * as api from '../backendApi.js';
import Attribution from 'ol/control/Attribution.js';
import CircleStyle from 'ol/style/Circle.js';
import {defaults} from 'ol/control/defaults';
import Fill from 'ol/style/Fill.js';
import {fromExtent} from 'ol/geom/Polygon';
import GeoJSON from 'ol/format/GeoJSON.js';
import Map from 'ol/Map.js';
import * as olLoadingstrategy from 'ol/loadingstrategy';
import * as olProj from 'ol/proj';
import proj4 from 'proj4';
import {register} from 'ol/proj/proj4.js';
import Stroke from 'ol/style/Stroke.js';
import Style from 'ol/style/Style.js';
import TileLayer from 'ol/layer/Tile.js'
import TileWMS from 'ol/source/TileWMS.js';
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';
import View from 'ol/View.js';


async function fetchConfigAndSetFeature(features) {
    var configUrl = api.getMapConfigUrl();

    const response = await fetch(configUrl, { headers: { 'Accept': 'application/json' } });
    if (response.status == 200) {
        const json = await response.json();
        setMapBackgroundAndExtent(json.wmsUrl, json.wmsVersion, json.wmsLayers, json.crsCode, json.crsProj4Definition, json.source, features);
    } else {
        setMapBackgroundAndExtent('http://sg.geodatenzentrum.de/wms_dtk250', '1.1.1', 'dtk250', null, null, null, features);
    }
}

var map
var info
function setMapBackgroundAndExtent(wmsUrl, wmsVersion, wmsLayers, crsCode, projDef, source, data){
    info = document.getElementById('info');
    map = new Map({
          target: 'map',
          controls: defaults({attribution: false}).extend([attribution]),
          layers: [
            featureLayer
          ],
          view: new View({
            projection: 'EPSG:4326',
            center: [10.0143, 53.5537],
            zoom: 14,
            constrainResolution: true
          })
        });

    var crsCodeRegistered = registerCrs(crsCode, projDef);
    if( crsCodeRegistered ){
        var userConfig = olProj.get(crsCode);
        map.setView(
            new View({
                projection: userConfig,
                constrainResolution: true
            })
        );
    }

    var wmsLayer = new TileLayer({
      source: new TileWMS({
        url: wmsUrl,
        params: {'VERSION': wmsVersion, 'LAYERS': wmsLayers},
        attributions: source
      })
    });
    map.getLayers().insertAt(0, wmsLayer);
    setFeatures(data, crsCode);

    map.on('pointermove', function(evt) {
      if (evt.dragging) {
        info.style.visibility = 'hidden';
        currentFeature = undefined;
      }
        displayFeatureInfo(evt.pixel, evt.originalEvent.target);
    });

    map.on('click', function (evt) {
        displayFeatureInfo(evt.pixel, evt.originalEvent.target);
    });

    map.getTargetElement().addEventListener('pointerleave', function () {
      currentFeature = undefined;
      info.style.visibility = 'hidden';
    });
}

function registerCrs(crsCode, projDef){
   if( crsCode != null &&  projDef != null ) {
       proj4.defs(crsCode, projDef);
       register(proj4);
       return true;
   }
   return false;
}

function setFeatures(featuresJson, crsCode){
  featureSource.clear();
  featureSource.addFeatures(featureSource.getFormat().readFeatures(featuresJson, {
                    "dataProjection" : "EPSG:4326",
                    "featureProjection" : crsCode
             }));

  var extentGeom = fromExtent(featureSource.getExtent())
  extentGeom.scale(1.2);
  map.getView().fit(extentGeom.getExtent(), {'maxZoom':20, 'nearest': true } );
}

var featureSource = new VectorSource({
  format: new GeoJSON(),
  strategy: olLoadingstrategy.all
});

var styles = [
  new Style({
    image: new CircleStyle({
      radius: 6,
      fill: new Fill({
        color: 'rgba(0,0,255, 0.1)'
      }),
      stroke: new Stroke({
        color: 'rgba(0,0,255, 1)',
        width: 2
      })
    }),
    stroke: new Stroke({
      color: 'rgba(0,0,255, 1)',
      width: 3
    }),
    fill: new Fill({
      color: 'rgba(0, 0, 255, 0.1)'
    })
  })
];
var featureLayer = new VectorLayer({
  source: featureSource,
  style: styles
});

var attribution = new Attribution({
  collapsible: false,
});


let currentFeature;
function displayFeatureInfo(pixel, target) {
  const feature = target.closest('.ol-control')
    ? undefined
    : map.forEachFeatureAtPixel(pixel, function (feature) {
        return feature;
      });
  if (feature) {
    info.style.left = (pixel[0] + 15) + 'px';
    info.style.top = (pixel[1] - 15) + 'px';
    if (feature !== currentFeature) {
      info.style.visibility = 'visible';
      info.innerText = feature.getId();
    }
  } else {
    info.style.visibility = 'hidden';
  }
  currentFeature = feature;
}

export default {
    name: 'FeatureMap',
    props: {
        geoData: [Array, Object]
    },
    beforeMount() {
        // proxied data are not recognized as GeoData, "restore". A better way?
        var geoData = this.geoData
        if (!geoData.type) {
            console.log("No geoData type, Skipping")
            return
        }
        var rawData = {
            type: geoData.type
        }
        if (geoData.geometry) {
            rawData.geometry = geoData.geometry 
        }
        if (geoData.id) {
            rawData.id = geoData.id 
        }
        if (geoData.features) {
            rawData.features = []
            geoData.features.forEach((feature) =>
                rawData.features.push(feature)
            )
        }
        
        fetchConfigAndSetFeature(rawData)
    }
}
</script>