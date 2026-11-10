import { createApp } from 'vue'
import ConformanceClasses from './components/ConformanceClasses.vue'
import DataSets from './components/DataSets.vue'
import DataSet from './components/DataSet.vue'
import CustomFooter from './components/CustomFooter.vue'
import MainPage from './components/MainPage.vue'
import FeatureCollections from './components/FeatureCollections.vue'
import FeatureCollection from './components/FeatureCollection.vue'
import FeatureItems from './components/FeatureItems.vue'


import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
import 'ol/ol.css'
import './main.css'

const $ = require("jquery");


console.log('Running')


createApp(MainPage, retrieveBreadcrumbs()).mount('#app')

function getAppBaseUrl() {
    return window.location.href.replace(/\/datasets\/.*/, "");
}

function retrieveBreadcrumbs() {
    var baseUrl = getAppBaseUrl()
    console.log("baseUrl", baseUrl)
    var appPath = window.location.href.replace(new RegExp("http?://[^/]+/"), "").replace("?.*", "").replace("#.*", "").replace(/.*datasets\/?/, "");
    
    var parts = appPath.split("/")
    console.log("parts", parts)
    var xmlLinkLabel = "XML"
    var pageType = getPageType()
    if (pageType == "datasets") {
        xmlLinkLabel = null
    }
    
    var data = {
        datasetsLink: baseUrl + "/datasets",
        datasetName: parts.length > 0 ? parts[0]: null,
        datasetLink: parts.length > 0 ? baseUrl + "/datasets/" + parts[0] : null,
        collectionLink: parts.length > 2 ? parts[2]: null,
        itemsLink: parts.length > 4 ? parts[3]: null,
        featureId: parts.length > 5 ? parts[4]: null,
        xmlLinkLabel: xmlLinkLabel
    }
    if (pageType == "conformance") {
        data.conformanceClasses = true
    }
    else {
        data.collectionsLink = parts.length > 1 ? baseUrl + "/datasets/" + parts[0] + "/collections" : null
        data.collectionId = parts.length > 2 ? parts[2]: null
    }
    
    console.log("Breadcrumbs data", data)
    return data
}

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
    switch (parts.length) {
        case 1:
            return parts[0] ? "dataset" : "datasets"
        case 2:
            return parts[1] // conformance or collections
        case 3:
            return "collection"
        case 4:
            return "features"
        case 5:
            return "feature"
    }
}



var pageType = getPageType()
console.log("pageType", pageType)

var url = retrieveBaseUrl()
if (import.meta.env.DEV) {
    url = toMockDataUrl(url)
}

function toMockDataUrl(url) {
    var originalUrl = url
    url = url.replace("/to-be-replaced-by-context-path", "/to-be-replaced-by-context-path/mockdata") + ".json"
    console.log('DEVELOPMENT! ' + originalUrl + " -> " + url);
    return url    
}

var toDisplay
var transform

switch (pageType) {
    case "datasets":
        toDisplay = DataSets
        transform = function(data) {
            data.datasets.sort(function compare(a, b) {
                return a.title.localeCompare(b.title);
            })
            return data
        }
        break;
    case "dataset":
        toDisplay = DataSet
        transform = transformDataset;
        break;
    case "collections":
        toDisplay = FeatureCollections
        transform = transformCollections;
        break;
    case "collection":
        toDisplay = FeatureCollection
        transform = transformFeatureCollection;
        break;
    case "conformance":
       toDisplay = ConformanceClasses
       break;
    case "features":
        toDisplay = FeatureItems
        
   break;
}

if (!toDisplay) {
    console.error("Nothing to display for", pageType)
}
else {
    console.log('Querying ' + url)
    $.ajax({
        dataType: "json",
        url: url,
        success: function(data) {
            console.log('Got data. Creating', data)
            if (transform) {
                data = transform(data)
                console.log('Transformed to', data)
            }
    
            createApp(toDisplay, data).mount('#appContent')
        }
    })
}

$.ajax({
    dataType: "json",
    url: createHtmlConfigUrl(),
    success: function(data) {
        if (data.documentationUrl) {
            data.helpUrl = data.documentationUrl;
        }
        createApp(CustomFooter, data).mount('#footerWrapper')
        console.log('Got config data. Creating', data)
    }
})
/*
var footerApp = new Vue({
  el: '#footer',
  data: {
    helpUrl: createDocumentationUrl(),
    legalNoticeUrl: '',
    privacyUrl: ''
  },

  created() {
    // create a closure to access component in the callback below
    var self = this;

    $.ajax({
      dataType: "json",
      url: createHtmlConfigUrl(),
      success: function(data) {
        if ( data.documentationUrl ) {
          self.helpUrl = data.documentationUrl;
        }
        self.legalNoticeUrl = data.legalNoticeUrl;
        self.privacyUrl = data.privacyUrl;
      }
    });
  }
})*/

function parseLinks(data, rel, type){
  var links = $(data.links).filter(
    function( n, i ) {
      return i.rel===rel && i.type===type;
    });
    if ( links.length > 0 )
      return links[0];
}

function createHtmlConfigUrl() {
    var baseUrl = retrieveBaseUrl();
    var indexOfDataset = (baseUrl.lastIndexOf("dataset"))
    var url = baseUrl.substring(0, indexOfDataset) + "html";
    if (import.meta.env.DEV) {
        url = toMockDataUrl(url)
    }
    return url
}

function createMapConfigUrl(){
    var url = retrieveThisDatasetUrl() + "/config/map"
    if (import.meta.env.DEV) {
        url = toMockDataUrl(url)
    }
    return url
}

/*
function createDocumentationUrl(){
  var baseUrl = retrieveBaseUrl();
  var indexOfDataset = (baseUrl.lastIndexOf("dataset"))
  return baseUrl.substring ( 0, indexOfDataset ) + "documentation/index.html#_usage";
}
*/

function retrieveBaseUrl() {
    var featuresRefWithoutQuery = window.location.href;
    if (featuresRefWithoutQuery.indexOf('?') >= 0) {
        featuresRefWithoutQuery = featuresRefWithoutQuery.substr(0, featuresRefWithoutQuery.indexOf('?'));
    }
    if (featuresRefWithoutQuery.endsWith("/")) {
        featuresRefWithoutQuery = featuresRefWithoutQuery.substr(0, featuresRefWithoutQuery.length - 1);
    }
    if (featuresRefWithoutQuery.endsWith(".html")) {
        featuresRefWithoutQuery = featuresRefWithoutQuery.substr(0, featuresRefWithoutQuery.length - 5);
    }
    return featuresRefWithoutQuery;
}

function retrieveThisDatasetUrl(){
  var baseUrl = retrieveBaseUrl();
  var indexIncludeDataset = (baseUrl.lastIndexOf("dataset") + 9)
  var indexOfDatasetId = baseUrl.substring(indexIncludeDataset, baseUrl.length ).indexOf( "/" ) + indexIncludeDataset;
  return baseUrl.substring ( 0, indexOfDatasetId );
}



function transformDataset(jsonData) {
    return {
        title: jsonData.title,
        description: jsonData.description,
        apilink: firstByRel(jsonData, 'service-doc'),
        collectionlink: firstByRel(jsonData, 'data'),
        conformanceLink: firstByRel(jsonData, 'conformance'),
        metadataLink: firstByRel(jsonData, 'describedBy', true),
        licenseLink: firstByRel(jsonData, 'license'),
        contact: jsonData.contact
    }
}

function firstByRel(data, rel, otherThanHtmlOrTest) {
    var links = $(data.links).filter(
        function(n, i) {
            return i.rel === rel && (i.type === 'text/html' || i.type === 'text/plain');
        });
    if (links.length > 0)
        return links[0];
    else if (otherThanHtmlOrTest) {
        var allRelLinks = $(data.links).filter(
            function(n, i) {
                return i.rel === rel;
            });
        if (allRelLinks.length > 0)
            return allRelLinks[0];
    }
}

function transformCollections(data) {
    data.collections = data.collections.sort((c1, c2) => {
        const c1Id = c1.id;
        const c2Id = c2.id;
        return c1Id.localeCompare(c2Id);
      });
    data.collectionsMetadata = parseCollectionsMetadataLinks(data.collections);
    data.licenseLink = parseLinks(data, 'license', 'text/plain');

    return data    
}

function parseCollectionsMetadataLinks(collections){
  const metadataLinksPerCollection = {};
  collections.forEach(function(collection){
    collection.metadataLinks = parseMetadataLinks(collection.links);
  });
  return metadataLinksPerCollection;
}

function parseMetadataLinks(links){
  var metadataLinks = $( links ).filter(
    function( n, i ) {
      return i.rel==='describedBy' && (i.type==='text/html' || i.type==='text/plain');
    });
    if (metadataLinks.length > 0)
      return metadataLinks;
    else{
      return $( links ).filter(
        function( n, i ) {
          return i.rel==='describedBy';
        });
    }
}

function transformFeatureCollection(data) {
    data.metadataLinks = parseMetadataLinks(data.links);
    fetchConfigAndSetExtent(data.extent.spatial.bbox[0]);
    return data
}


async function fetchConfigAndSetExtent(bbox) {
  var configUrl = createMapConfigUrl();

  const response = await fetch( configUrl, {headers: {'Accept': 'application/json' } } );
  if( response.status == 200 ){
    const json = await response.json();
    FeatureCollection.methods.setMapBackgroundAndExtent(json.wmsUrl, json.wmsVersion, json.wmsLayers, json.crsCode, json.crsProj4Definition, json.source, bbox);
  } else {
    FeatureCollection.methods.setMapBackgroundAndExtent('http://sg.geodatenzentrum.de/wms_dtk250', '1.1.1', 'dtk250', null, null, null, bbox);
  }
}


