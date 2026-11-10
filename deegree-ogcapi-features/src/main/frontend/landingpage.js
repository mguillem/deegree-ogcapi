import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';

const $ = require("jquery");
/*
<!-- jQuery first, then Popper.js, then Bootstrap JS -->
<script src="./node_modules/jquery/dist/jquery.min.js"></script>
<script src="./node_modules/popper.js/dist/popper.min.js"></script>
<script src="./node_modules/bootstrap/dist/js/bootstrap.min.js"></script>
<script src="./node_modules/vue/dist/vue.min.js"></script>
<script src="./node_modules/vue-meta/dist/vue-meta.min.js"></script>
*/

var App = new Vue({
  el: '#content',
  metaInfo() {
    const title = this.title
    return {
      title: title,
      titleTemplate: '%s',
    }
  },
  data: {
    title: '',
    description: '',
    apilink: '',
    collectionlink: '',
    conformanceLink: '',
    metadataLink: '',
    licenseLink: '',
    contact: ''
  },

  created() {
    this.fetchData().catch(error => {
      console.error(error)
    })
  },
  methods: {
    async fetchData() {
      var baseUrl = retrieveBaseUrl();
      const response = await fetch( baseUrl, {headers: {'Accept': 'application/json' } } );
      const json = await response.json();

      this.title = json.title;
      this.description = json.description;
      this.apilink = firstByRel(json, 'service-doc');
      this.collectionlink = firstByRel(json, 'data');
      this.conformanceLink = firstByRel(json, 'conformance');
      this.metadataLink = firstByRel(json, 'describedBy', true);
      this.licenseLink = firstByRel(json, 'license');
      this.contact = json.contact;
    }
  }
})

var AppBreadcrump = new Vue({
  el: '#breadcrump',
  data: {
    datasetLink: '',
    datasetName: '',
    datasetsLink: ''
  },

  created() {
    var self = this;
    var thisLink = window.location.href.endsWith("/") ? window.location.href.substring(0, window.location.href.length -1) : window.location.href;
    self.datasetsLink = thisLink.substring(0, thisLink.lastIndexOf("/"));
    self.datasetLink = thisLink;
    self.datasetName = self.datasetLink.substring(self.datasetLink.lastIndexOf("/") + 1);
  }
})

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
})

function firstByRel(data, rel, otherThanHtmlOrTest){
  var links = $( data.links ).filter(
    function( n, i ) {
      return i.rel===rel && (i.type==='text/html' || i.type==='text/plain');
    });
    if ( links.length > 0 )
      return links[0];
    else if (otherThanHtmlOrTest){
      var allRelLinks = $( data.links ).filter(
        function( n, i ) {
          return i.rel===rel;
        });
      if ( allRelLinks.length > 0 )
        return allRelLinks[0];
    }
}

function createHtmlConfigUrl(){
  return retrieveThisDatasetUrl() + "/config/html";
}

function createDocumentationUrl(){
  var baseUrl = retrieveThisDatasetUrl();
  var indexOfDataset = (baseUrl.lastIndexOf("dataset"))
  return baseUrl.substring ( 0, indexOfDataset ) + "documentation/index.html#_usage";
}

function retrieveThisDatasetUrl(){
  var baseUrl = retrieveBaseUrl();
  if( !baseUrl.endsWith('/') )
     baseUrl = baseUrl + "/";
  var indexIncludeDataset = (baseUrl.lastIndexOf("datasets") + 9)
  var indexOfDatasetId = baseUrl.substring(indexIncludeDataset, baseUrl.length ).indexOf( "/" ) + indexIncludeDataset;
  return baseUrl.substring ( 0, indexOfDatasetId );
}

function retrieveBaseUrl() {
  var featuresRefWithoutQuery = window.location.href;
  if ( featuresRefWithoutQuery.indexOf('?') >= 0 ) {
    featuresRefWithoutQuery = featuresRefWithoutQuery.substr(0, featuresRefWithoutQuery.indexOf('?'));
  }
  if ( featuresRefWithoutQuery.endsWith("/") ) {
    featuresRefWithoutQuery = featuresRefWithoutQuery.substr(0, featuresRefWithoutQuery.length - 1);
  }
  if ( featuresRefWithoutQuery.endsWith(".html") ) {
    featuresRefWithoutQuery = featuresRefWithoutQuery.substr(0, featuresRefWithoutQuery.length - 5);
  }
  return featuresRefWithoutQuery;
}