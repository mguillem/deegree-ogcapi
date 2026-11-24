<template>
    <BApp>
        <div class="container">
            <div class="row" id="collection">
                <div class="col">
                    <h1 v-cloak class="mt-5">{{ title }}</h1>
                    <div v-cloak>{{ description }}</div>
                </div>
            </div>
            <hr />
            <div class="row justify-content-between" id="content">
                <div class="col-6" id="app">
                    <div class="row">
                        <div class="col d-flex justify-content-center">
                            <BPagination v-model="currentPage" :total-rows="numberMatched" :per-page="perPage" />
                            <!--
                        <b-pagination-nav :kex="paging" :link-gen="linkGen" v-model="currentPage" :number-of-pages="numberOfPages" use-router></b-pagination-nav>
                        -->
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <table role="table" aria-busy="false" aria-colcount="1"
                                class="table b-table table-borderless table-sm">
                                <tbody role="rowgroup">
                                    <tr role="row" class="" v-for="feature in currentItems" :key="feature.generatedId">
                                        <td aria-colindex="1" role="cell" class="">
                                            <div class="card"><!---->
                                                <div class="card-header">
                                                    <SmartLink :href="featureHref(feature)">{{feature.id }}</SmartLink>
                                                </div>
                                                <div class="card-body"><!----><!---->
                                                    <div class="card-text">
                                                        <table class="table table-striped"
                                                            style="overflow-wrap: anywhere;">
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
                                                                <tr v-for="(property, attribute) in feature.properties"
                                                                    :key="property">
                                                                    <td v-cloak>{{ attribute }}</td>
                                                                    <TdAttributeValue :value="property"
                                                                        :jsonLink="feature.id + '?f=json'">
                                                                    </TdAttributeValue>
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
                            <BPagination v-model="currentPage" :total-rows="numberMatched" :per-page="perPage" />
                            <!--
                        <b-pagination-nav :kex="paging" :link-gen="linkGen" v-model="currentPage" :number-of-pages="numberOfPages" use-router></b-pagination-nav>
                        -->
                        </div>
                    </div>
                </div>
                <div class="col-5">
                    <FeatureMap v-if="geoData.type" :geoData="geoData" />
                </div>

            </div>
        </div>
    </BApp>
</template>


<script setup>
import { BApp, BPagination } from 'bootstrap-vue-next'
import TdAttributeValue from './TdAttributeValue.vue'
import FeatureMap from './FeatureMap.vue'
import SmartLink from './SmartLink.vue'
import * as api from '../backendApi.js';
</script>

<script>
function featureHref(feature) {
    return "items/" + feature.id
}

async function fetchFeatureCollectionItem(comp) {
    var url = api.getCurrentFeatureCollectionUrl()
    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
        }
    })
    const result = await response.json();
    console.log(result);
    comp.updateFromItem(result)
}

async function fetchPage(page, comp) {
    var query = (page == 1) ? "" : ("limit=10&offset=" + ((page - 1) * comp.perPage))
    var url = api.getCurrentPageUrlWithQuery(query)
    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
        }
    })
    if (!response.ok) {
       throw new Error(`Response status: ${response.status}`);
     }
    const result = await response.json();
    console.log("got results", result);
    comp.updateFromResults(result)
}

function addGeneratedIds(list, prefix) {
    list.forEach((elt, index) => elt.generatedId = prefix + "_" + index)
    return list
}

async function fetchData(comp) {
    const data = await api.fetchData()
    
    comp.update(data)
    fetchFeatureCollectionItem(comp)
}

export default {
    name: 'FeatureItems',
    watch: {
        // whenever question changes, this function will run
        currentPage(newCurrentPage, oldCurrentPage) {
            console.log("currentPage changed: ", newCurrentPage, oldCurrentPage)
            fetchPage(newCurrentPage, this)
        }
    },
    data() {
        return {
            currentPage: 1,
            currentItems: [],
            defaultLimit: 10,
            defaultOffset: 0,
            description: '',
            feature: [],
            geoData: {},
            numberOfPages: 1,
            numberMatched: 0,
            paging: 0,
            perPage: 10,
            title: '',
            totalItems: 0,
            type: ''
        }
    },
    methods: {
        updateFromItem(item) {
            this.title = item.title
            this.description = item.description
        },
        updateFromResults(items) {
            this.currentItems = addGeneratedIds(items.features, "page" + this.currentPage)
        },
        update(data) {
            this.numberMatched = data.numberMatched
            this.geoData.type = data.type
            this.geoData.features = data.features
            console.log("data.features", data.features)
            this.currentItems = addGeneratedIds(data.features, "page" + this.currentPage)
        }
    },
    beforeMount() {
        fetchData(this)
    }
}
</script>