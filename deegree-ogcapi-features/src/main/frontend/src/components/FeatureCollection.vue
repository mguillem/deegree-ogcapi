<template>
    <div class="container">
        <div class="row" id="content">
            <div class="col-lg-12" >
                <h1 v-cloak class="mt-5">{{ title }}</h1>
                <div v-cloak>{{ description }}</div>
                <div class="row mt-2">
                    <div class="col-sm-3">Links</div>
                    <div class="col-md-9">
                        <div v-for="link in links" :key="link.title">
                            <a v-cloak v-if="link.type == 'text/html' && link.rel != 'alternate' && link.rel != 'describedBy'" v-bind:href="link.href" >{{ link.title }}</a>
                            <a v-cloak v-else-if="link.type == 'application/json' && link.rel == 'enclosure'" v-bind:href="link.href + '&f=json'" v-bind:download="id + '.json'">{{ link.title }}</a>
                            <a v-cloak v-else-if="link.type == 'application/xml' && link.rel == 'enclosure'" v-bind:href="link.href + '&f=xml'" v-bind:download="id + '.xml'">{{ link.title }}</a>
                        </div>
                        <div v-for="metadataLink in metadataLinks" :key="metadataLink.title">
                            <a v-cloak v-bind:href="metadataLink.href" >{{ metadataLink.title }}</a>
                        </div>
                    </div>
                </div>
                <div class="row mt-2">
                    <div class="col-md-3">Spatial Extent</div>
                    <div class="col-md-9">
                        <div id="map" style="width: 100; height: 100" class="map"></div>
                    </div>
                </div>
                <div class="row mt-2">
                    <div class="col-md-3">Temporal Extent</div>
                    <div v-if="extent.temporal" class="col-md-9">
                        <div class="row">
                            <div v-cloak class="col-md-12">Begin: {{ extent.temporal.interval[0] }}</div>
                        </div>
                        <div class="row">
                            <div v-cloak class="col-md-12">End: {{ extent.temporal.interval[1] }}</div>
                        </div>
                    </div>
                    <div v-else class="col-md-9">-</div>
                </div>
                <div class="row mt-2" v-if="crs">
                    <div class="col-md-3">Coordinate Reference Systems</div>
                    <div class="col-md-9">
                        <div class="row">
                            <div v-cloak class="col-md-12" v-for="crsitem in crs" :key="crsitem">{{ crsitem }}</div>
                        </div>
                    </div>
                </div>
                <div class="row mt-2" v-if="storageCrs">
                    <div class="col-md-3">Storage CRS</div>
                    <div class="col-md-9">
                      <div class="row">
                        <div v-cloak class="col-md-12" >{{ storageCrs }}</div>
                      </div>
                    </div>
                </div>
                <div class="row mt-2" v-if="itemType">
                    <div class="col-md-3">Item type</div>
                    <div class="col-md-9">
                        <div class="row">
                            <div v-cloak class="col-md-12" >{{ itemType }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.map {
  height: 400px;
  width: 100%;
}
</style>

<script>
import Map from 'ol/Map.js';
import TileLayer from 'ol/layer/Tile.js'
import View from 'ol/View.js';
import TileWMS from 'ol/source/TileWMS.js';
import {fromExtent} from 'ol/geom/Polygon';
import GeoJSON from 'ol/format/GeoJSON.js';
import VectorLayer from 'ol/layer/Vector.js';
import Style from 'ol/style/Style.js';
import Fill from 'ol/style/Fill.js';
import Stroke from 'ol/style/Stroke.js';
import * as olProj from 'ol/proj';
import {register} from 'ol/proj/proj4.js';
import * as olExtent from 'ol/extent';
import Feature from 'ol/Feature.js';
import * as olLoadingstrategy from 'ol/loadingstrategy';
import Attribution from 'ol/control/Attribution.js';
import {defaults} from 'ol/control/defaults';
import proj4 from 'proj4';
import VectorSource from 'ol/source/Vector.js';

var map
function setMapBackgroundAndExtent(wmsUrl, wmsVersion, wmsLayers, crsCode, projDef, source, bbox){
    map = new Map({
      target: 'map',
      controls: defaults({attribution: false}).extend([attribution]),
      layers: [
        extentLayer
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
    setExtent(bbox, crsCodeRegistered, crsCode);
}


var attribution = new Attribution({
  collapsible: false,
});
var extentSource = new VectorSource({
  format: new GeoJSON(),
   strategy: olLoadingstrategy.all
});
var extentLayer = new VectorLayer({
   source: extentSource,
   style: new Style({
    stroke: new Stroke({
      color: 'blue',
      width: 1
    }),
    fill: new Fill({
      color: 'rgba(0, 0, 255, 0.1)'
    })
  })
});


function setExtent(bbox, crsCodeRegistered, crsCode){
    var boundingExtent = olExtent.boundingExtent([[bbox[0], bbox[1]], [bbox[2], bbox[3]]]);
    if( crsCodeRegistered ) {
        boundingExtent = olProj.transformExtent(boundingExtent, 'EPSG:4326', crsCode);
    }

    var extentFeature = new Feature({
        geometry: fromExtent(boundingExtent),
        name: 'Extent'
    })
    extentSource.addFeature(extentFeature);

    var extentGeom = fromExtent(boundingExtent)
    extentGeom.scale(1.2);
    map.getView().fit(extentGeom.getExtent(), {'maxZoom':20, 'nearest': true} );
}

function registerCrs(crsCode, projDef){
   if( crsCode != null && projDef != null ) {
       proj4.defs(crsCode, projDef);
       register(proj4);
       return true;
   }
   return false;
}

export default {
    name: 'FeatureCollection',

  props: {
    id: String,
    title: String,
    description: String,
    links: [ {href: String, title: String} ],
    metadataLinks: [ {href: String, title: String} ],
    itemType: String,
    crs: [String],
    storageCrs: String,
    extent: { temporal: { interval: [String] }}
  },
  methods: {
    setMapBackgroundAndExtent: setMapBackgroundAndExtent
  }
}
</script>
