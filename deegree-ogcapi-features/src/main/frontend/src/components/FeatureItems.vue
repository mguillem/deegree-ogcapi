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
                                                        <TdAttributeValue :value="property" :jsonLink="feature.id + '?f=json'"></TdAttributeValue>
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
                <FeatureMap :geoData="this"/>
            </div>

        </div>
    </div>
  </BApp>
</template>


<script setup>
import {BApp} from 'bootstrap-vue-next'
import TdAttributeValue from './TdAttributeValue.vue'
import FeatureMap from './FeatureMap.vue'
</script>

<script>
function featureHref(feature) {
    return "items/" + feature.id
}

export default {
  name: 'FeatureItems',
  props: {
    title: String,
    type: String,
    description: String,
    features: [{
        id: String,
        properties: [{
            id: String,
            boreholePath:String  
        }]
    }]
  },
  /*
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
    */
}
</script>