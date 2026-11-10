<template>
  <BApp>
    <div class="row">
         <div class="col-lg-12" id="content">
             <h1 class="mt-5">Collections</h1>
             <div class="row">
                 <div class="col-md-12">
                     <ul class="list-group">
                         <li v-for="collection in collections" :key="collection.title" class="list-group-item">
                             <h5 v-cloak>{{ collection.title }}</h5>
                             <div v-cloak>{{ collection.description}}></div>

                             <div class="row mt-2">
                                 <div class="col-sm-2">Links</div>
                                 <div class="col-md-10">
                                   <div v-for="link in collection.links" :key="link.title">
                                       <a v-cloak v-if="link.type == 'text/html' && link.rel != 'alternate' && link.rel != 'describedBy'" v-bind:href="link.href">{{ link.title }}</a>
                                       <a v-cloak v-else-if="link.type == 'application/json' && link.rel == 'enclosure'" v-bind:href="link.href + '&f=json'" v-bind:download="collection.id + '.json'">{{ link.title }}</a>
                                       <a v-cloak v-else-if="link.type == 'application/xml' && link.rel == 'enclosure'" v-bind:href="link.href + '&f=xml'" v-bind:download="collection.id + '.xml'">{{ link.title }}</a>
                                   </div>
                                       <div v-for="link in collection.metadataLinks" :key="link.title">
                                           <a v-cloak v-bind:href="link.href">{{ link.title }}</a>
                                       </div>
                                 </div>
                             </div>
                             <div class="row mt-2" v-if="collection.crs">
                               <div class="col-sm-2">Coordinate Reference Systems</div>
                               <div class="col-md-10">
                                 <div class="row">
                                     <div v-cloak class="col-md-12" v-for="crsitem in collection.crs" :key="crsitem">{{ crsitem }}</div>
                                 </div>
                               </div>
                             </div>
                             <div class="row mt-2" v-if="collection.storageCrs">
                                 <div class="col-sm-2">Storage CRS</div>
                                 <div class="col-md-10">
                                   <div class="row">
                                       <div v-cloak class="col-md-12" >{{ collection.storageCrs }}</div>
                                   </div>
                                 </div>
                             </div>
                         </li>
                     </ul>
                 </div>
             </div>

             <div class="row" v-if="licenseLink != null" >
                 <div class="col-sm-3">License</div>
                 <div class="col-md-9">
                     <a v-cloak v-bind:href="licenseLink.href" >{{ licenseLink.title }}</a>
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
export default {
    name: 'FeatureCollections',

  props: {
    collections: [{
        title: String,
        description: String,
        id: String,
        links: [
        {href: String, rel: String, title: String, type: String }
        ],
        crs: [String],
        storageCrs: String,
        metadataLinks: [ {href: String, title: String} ]
    }],
    licenseLink: {href: String, rel: String, title: String, type: String }
  }
}
</script>
