<template>
    Not yet ready :-(
        <div class="container" id="content">
            <div>
                <div class="row">
                    <div class="col" v-if="status == 0">
                        <h3 v-cloak class="mt-5">Loading feature with ID {{ id }}</h3>
                    </div>
                    <div class="col" v-else-if="status == 404">
                        <h3 v-cloak class="mt-5">Feature with ID {{ id }} is not known</h3>
                    </div>
                    <div class="col" v-else-if="status == 200">
                        <h3 v-cloak class="mt-5">{{ id }}</h3>
                    </div>
                    <div class="col" v-else>
                        <h3 v-cloak class="mt-5">Error retrieving feature with ID {{ id }}</h3>
                    </div>
                </div>
                <hr/>
                <div class="row justify-content-between">
                    <div class="col-md">
                        <div class="row mt-2">
                            <div class="col">
                                <table class="table table-striped" style="overflow-wrap: anywhere;">
                                    <thead>
                                    <tr>
                                        <th scope="col">Attribute</th>
                                        <th scope="col">Value</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr v-for="(attribute, property) in properties" :key="property">
                                        <td v-cloak>{{ property }}</td>
                                        <TdAttributeValue :value="attribute" jsonLink="?f=json"></TdAttributeValue>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="col-md">
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

                <div class="row" v-if="status == 200">
                        <div class="col-sm-2">Links</div>
                        <div class="col-md-10">
                            <div v-for="link in links" :key="link.title">
                                <a v-cloak v-if="link.type == 'text/html' && link.rel != 'alternate'" v-bind:href="link.href" >{{ link.title }}</a>
                            </div>
                        </div>
                </div>
            </div>
        </div>
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
import TdAttributeValue from './TdAttributeValue.vue'
</script>

<script>
/*
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
*/


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
            value: (typeof value == "string") ? ellipsis(value) : value 
        })
    }
    console.log(cleanProperties, list)
    return list
}


function truncate(s, maxSize) {
    if (s.length > maxSize) {
        return s.substring(0, maxSize) + "..."
    }
    return s
}
console.log("truncate", truncate)

export default {
  name: 'FeatureItem',
  props: {
    status: Number,
    crs: String,
    id: String,
    geometry: Object,
    properties: [{
        id: String,
        boreholePath:String  
    }],
    links: [{
        href: String,
        rel: String,
        title: String,
        type: String
    }],
    srsName: String,
    type: String
  },
  computed: {
    cleanedProperties() {
        return cleanProperties(this.properties)
      }
    },
    methods: {
//      setMapBackgroundAndExtent: setMapBackgroundAndExtent
    }
}
</script>