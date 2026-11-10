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
                                            <p class="card-text">
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
                                                            <a v-bind:href="property" target="_blank" v-tooltip v-bind:title="property" >{{ truncate(property, 50) }}</a>
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
                                            </p>
                                        </div>
                                        </div>
                                        </td>
                                </tr>
                            </tbody>
                                </table>
                        
                        
                        <b-table class="table-borderless"
                                 thead-class="hidden_header"
                                 small :items="items" :fields="fields" :current-page="currentPage" :per-page="0">
                            <template v-slot:cell()="data">
                                <b-card>
                                    <template v-slot:header>
                                        <b-link v-cloak :href="data.item.link">{{ data.value }}</b-link>
                                    </template>
                                    <b-card-text>
                                        <table class="table table-striped" style="overflow-wrap: anywhere;">
                                            <thead>
                                            <tr>
                                                <th scope="col">Attribute</th>
                                                <th scope="col">Value</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr v-for="(property, attribute) in data.item.properties" :key="property">
                                                <td v-cloak>{{ attribute }}</td>
                                                <td v-cloak v-if="(typeof property) == 'string' && property.startsWith('http')" >
                                                    <a v-bind:href="property" target="_blank" v-tooltip v-bind:title="property" >{{ property }}
                                                        <!-- TODO_ was: {{ property | truncate(50) }} -->
                                                    </a>
                                                </td>
                                                <td v-cloak v-else-if="Array.isArray(property) && property.length > 0 && typeof(property[0]) !== 'object'" >
                                                    <ul class="propertylist">
                                                        <li v-for="item in property" :key="item">
                                                            {{ item }}
                                                        </li>
                                                    </ul>
                                                </td>
                                                <td v-cloak v-else-if="(Array.isArray(property) && property.length > 0) || typeof(property) === 'object'" >
                                                    <a v-bind:href="data.item.jsonLink" target="_blank">Complex object, view as json</a>
                                                </td>
                                                <td v-cloak v-else v-tooltip v-bind:title="property" >{{ property }}</td>
                                            <!-- TODO_ was: {{ property | truncate(50) }} -->
                                            </tr>
                                            </tbody>
                                        </table>
                                    </b-card-text>
                                </b-card>
                            </template>
                        </b-table>
                    </div>
                </div>
                <div class="row">
                    <div class="col d-flex justify-content-center">
                        <!--
                        <b-pagination-nav :kex="paging" :link-gen="linkGen" v-model="currentPage" :number-of-pages="numberOfPages" use-router></b-pagination-nav>
                        -->
                    </div>
                </div>
                <router-view name="router" />
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

<script setup>
import {BApp} from 'bootstrap-vue-next'
</script>

<script>
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
    }
}
</script>