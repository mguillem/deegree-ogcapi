<template>
  <BApp>
    Not yet ready :-(
    <div class="container" >
        <div class="row" id="collection">
            <div class="col">
                <h1 v-cloak class="mt-5">{{ title }}</h1>
                <div v-cloak>{{ description }}</div>
            </div>
        </div>
        <hr/>
        <div class="row justify-content-between" id="content">
            <div class="col-6" id="app">
                <div class="row">
                    <div class="col d-flex justify-content-center">
                        <!--
                        <b-pagination-nav :kex="paging" :link-gen="linkGen" v-model="currentPage" :number-of-pages="numberOfPages" use-router></b-pagination-nav>
                        -->
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <table role="table" aria-busy="false" aria-colcount="1" class="table b-table table-borderless table-sm">
                            <tbody role="rowgroup">
                                <tr role="row" class="" v-for="feature in features" :key="feature.id">
                                    <td aria-colindex="1" role="cell" class="">
                                        <div class="card"><!---->
                                            <div class="card-header">
                                                <a target="_self" v-bind:href="featureHref(feature)" class="">{{ feature.id }}</a>
                                            </div>
                                        <div class="card-body"><!----><!----> 
                                            <div class="card-text">
                                                <table class="table table-striped" style="overflow-wrap: anywhere;">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col">Attribute</th>
                                                            <th scope="col">Value</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <!--
                                                        <tr v-for="property in feature.properties" :key="property.name">
                                                            <td>{{ property.name }}</td> 
                                                            <td>{{ truncate(property.value) }}
                                                                <a href="http://localhost:8182/deegree-ogcapi-pg/datasets/BoreholeML_3.2.0/collections/Borehole/items/B10001?f=json" target="_blank">Complex object, view as json</a></td>
                                                        </tr>
                                                        -->
                                                    <tr v-for="(property, attribute) in feature.properties" :key="property">
                                                        <td v-cloak>{{ attribute }}</td>
                                                        <td v-cloak v-if="(typeof property) == 'string' && property.startsWith('http')" >
                                                            <a v-bind:href="property" target="_blank" v-bind:title="property" >{{ truncate(property, 50) }}</a>
                                                        </td>
                                                        <td v-cloak v-else-if="Array.isArray(property) && property.length > 0 && typeof(property[0]) !== 'object'" >
                                                            <ul class="propertylist">
                                                                <li v-for="item in property" :key="item">
                                                                    {{ item }}
                                                                </li>
                                                            </ul>
                                                        </td>
                                                        <td v-cloak v-else-if="(Array.isArray(property) && property.length > 0) || typeof(property) === 'object'" >
                                                            <a href="?f=json" target="_blank">Complex object, view as json</a>
                                                            <!-- TODO_ v-bind:href="data.item.jsonLink"-->
                                                        </td>
                                                        <td v-cloak v-else>{{ truncate(property, 50) }}</td>
                                                    <!-- TODO_ was: {{ property | truncate(50) }} -->
                                                    </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        </div>
                                        </td>
                                </tr>
                            </tbody>
                         </table>
                    </div>
                </div>
                <div class="row">
                    <div class="col d-flex justify-content-center">
                        <!--
                        <b-pagination-nav :kex="paging" :link-gen="linkGen" v-model="currentPage" :number-of-pages="numberOfPages" use-router></b-pagination-nav>
                        -->
                    </div>
                </div>
            </div>
            <div class="col-5">
                <div id="map" class="map">
                    <div id="info"></div>
                    <!--
                    <div id="popup" class="ol-popup">
                        <a href="#" id="popup-closer" class="ol-popup-closer"></a>
                        <div id="popup-content"></div>
                    </div>
                    -->
                </div>
            </div>

        </div>
    </div>
  </BApp>
</template>
<style scoped>
.map {
    height: 480px;
    width: 540px;
    position: relative;
}
#info {
  position: absolute;
  display: inline-block;
  height: auto;
  width: auto;
  z-index: 100;
  background-color: #333;
  color: #fff;
  text-align: center;
  border-radius: 4px;
  padding: 5px;
  left: 50%;
  transform: translateX(3%);
  visibility: hidden;
  pointer-events: none;
}
</style>


<script setup>
import {BApp} from 'bootstrap-vue-next'
</script>

<script>
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



function truncate(s, maxSize) {
    if (s.length > maxSize) {
        return s.substring(0, maxSize) + "..."
    }
    return s
}

function featureHref(feature) {
    return "items/" + feature.id
}


function cleanProperties(properties) {
    var list = []
    var ellipsis = function(s) {
        if (s.length > 53) {
            return s.substring(0, 50) + "..."
        }
        return s
    }
    for (var k in properties) {
        var value = properties[k]
        list.push({
            name: k,
            value: (typeof value == "string") ? ellipsis(value) : "Complex object, view as json" 
        })
    }
    return list
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
  name: 'FeatureItems',
  props: {
    title: String,
    description: String,
    features: [{
        id: String,
        properties: [{
            id: String,
            boreholePath:String  
        }]
    }]
  },
  computed: {
    cleanedFeatures() {
        var list = []
        this.features.forEach(function(feature) {
            list.push({
                id: feature.id,
                properties: cleanProperties(feature.properties)
            })
        })
        return list; 
      }
    },
    methods: {
      setMapBackgroundAndExtent: setMapBackgroundAndExtent
    }
}
</script>