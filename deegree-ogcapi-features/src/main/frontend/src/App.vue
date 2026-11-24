<template>
  <BApp>
    <header>
        <nav class="navbar navbar-default">
            <div class="container-fluid">
                <ul class="nav" id="breadcrump">
                    <li v-for="link in links" :key="link.label" class="breadcrumb-item">
                        <SmartLink :href="link.path">{{ link.label }}</SmartLink>
                    </li>
                    <li class="breadcrumb-item active" aria-current="page">{{ lastLink.label }}</li>
                </ul>
                <ul class="nav justify-content-end">
                    <li class="nav-item">
                        <a class="nav-link" href="?f=json" target="_blank">{{ jsonLinkLabel }}</a>
                    </li>
                    <li class="nav-item" v-if="xmlLinkLabel">
                        <a class="nav-link" href="?f=xml" target="_blank">{{ xmlLinkLabel }}</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link disabled" href="?f=html" tabindex="-1" aria-disabled="true"
                           target="_blank">HTML</a>
                    </li>
                </ul>
            </div>
        </nav>
    </header>

    <RouterView />
    <CustomFooter></CustomFooter>
  </BApp>
</template>

<script setup>
import {BApp} from 'bootstrap-vue-next'
import CustomFooter from './components/CustomFooter.vue'
import SmartLink from './components/SmartLink.vue'
import './main.css'
</script>

<script>
import * as api from './backendApi.js';

function getPageType() {
    var appPath = window.location.href.replace(new RegExp("http?://[^/]+/"), "").replace("?.*", "").replace("#.*", "").replace(/.*datasets\/?/, "");

    console.log("appPath", appPath)
    var parts = appPath.split("/")
    console.log("parts", parts)
    /*  
    http://localhost:8182/deegree-ogcapi-pg/datasets/ -> landingpage.html
    http://localhost:8182/deegree-ogcapi-pg/datasets/BoreholeML_3.2.0 -> datasets.html
    http://localhost:8182/deegree-ogcapi-pg/datasets/BoreholeML_3.2.0/conformance > conformance.html
    http://localhost:8182/deegree-ogcapi-pg/datasets/BoreholeML_3.2.0/collections -> collection.html
    http://localhost:8182/deegree-ogcapi-pg/datasets/BoreholeML_3.2.0/collections/Borehole -> collections.html
    http://localhost:8182/deegree-ogcapi-pg/datasets/BoreholeML_3.2.0/collections/Borehole/items -> features.html
    http://localhost:8182/deegree-ogcapi-pg/datasets/BoreholeML_3.2.0/collections/Borehole/items/B10001 -> feature.html
    */
   var response = {
    dataset: (parts.length >= 1) ? parts[0] : '',
    collection: (parts.length >= 3) ? parts[2] : '',
    item: (parts.length >= 5) ? parts[4] : '',
   }

      switch (parts.length) {
        case 1:
            response.dataset = parts[0]
            response.type = parts[0] ? "dataset" : "datasets"
            break
        case 2:
            response.type = parts[1] // conformance or collections
            break
        case 3:
            response.type = "collection"
            break
        case 4:
            response.type = "features"
            break
        case 5:
            response.type = "feature"
            break
    }
        
    console.log("pagetType", response)
    return response
}

function extracLinks(pageType) {
    var link = api.getAppBaseUrl() + "datasets"
    var data = {
        links: [ { label: "Datasets", path: link } ]
    }
    if (pageType.type == "datasets") {
        console.log("datasets")
        return data
    }
    data.xmlLinkLabel = "XML"
    data.jsonLinkLabel = "JSON"
    
    if (pageType.type == "datasets") {
        return data
    }

    link += "/" + pageType.dataset
    data.links.push({label: pageType.dataset, path: link})
    if (pageType.type == "dataset") {
        console.log("dataset", data)
        return data
    }
    link += "/" + (pageType.type == "conformance" ? "cnformance" : "collections")
    data.links.push({label: pageType.type == "conformance" ? "Conformance" : "Collections", path: link})
    if (pageType.type == "conformance" || pageType.type == "collections") {
        return data
    }
    link += "/" + pageType.collection
    data.links.push({label: pageType.collection, path: link})
    if (pageType.type == "collection") {
        return data
    }
    link += "/items"
    data.jsonLinkLabel = 'GeoJSON'
    data.xmlLinkLabel = 'GML'
    data.links.push({label: "Features", path: link})
    if (pageType.type == "features") {
        return data
    }
    
    link += "/" + pageType.item
    data.links.push({label: pageType.item, path: link})
    
    console.log("breadcrumb data", data)
    return data
}

export default {
  name: 'MainPage',
  data() { return {
    links: [],
    lastLink: {},
    jsonLinkLabel: '',
    xmlLinkLabel: ''
  }
  },
  watch:{
      $route(){
        var pageType = getPageType()
        var linksData = extracLinks(pageType)
        console.log("linksData", linksData)

        this.lastLink = linksData.links.pop()
        this.jsonLinkLabel = linksData.jsonLinkLabel
        this.xmlLinkLabel = linksData.xmlLinkLabel
        this.links = linksData.links
      }
  } 
}
</script>
