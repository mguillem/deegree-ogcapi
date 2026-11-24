<template>
  <BApp>
    <div class="row">
        <div class="col-lg-12" id="content">
            <h1 v-cloak class="mt-5">{{ title }}</h1>
            <p v-cloak class="lead">{{ description }}</p>
            <div class="row">
                <div class="col-sm-3">Collections</div>
                <div class="col-md-9">
                    <SmartLink :href="collectionlink.href" >{{ collectionlink.title }}</SmartLink>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-3">API Definition</div>
                <div class="col-md-9">
                    <a v-cloak v-bind:href="apilink.href" >{{ apilink.title }}</a>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-3">Conformance Classes</div>
                <div class="col-md-9">
                    <SmartLink :href="conformanceLink.href" >{{ conformanceLink.title }}</SmartLink>
                </div>
            </div>
            <div class="row" v-if="metadataLink">
                <div class="col-sm-3">Metadata</div>
                <div class="col-md-9">
                    <a v-cloak v-bind:href="metadataLink.href" >{{ metadataLink.title }}</a>
                </div>
            </div>
            <div class="row" v-if="contact && contact.name">
                <div class="col-sm-3">Contact</div>
                <div class="col-md-9">
                    <a v-cloak v-bind:href="contact.url" >{{ contact.name }}</a> (<a v-cloak v-bind:href="'mailto:' + contact.email" >E-Mail</a>)
                </div>
            </div>
            <div class="row" v-if="licenseLink">
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
import * as api from '../backendApi.js';
import SmartLink from './SmartLink.vue'
</script>

<script>

function firstByRel(array, rel, otherThanHtmlOrTest) {
    var result = array.find((element) => element.rel === rel && (element.type === 'text/html' || element.type === 'text/plain'));
    if (result == null && otherThanHtmlOrTest) {
        result = array.find((element) => element.rel === rel);
    }
    return result 
}


async function fetchData(comp) {
    const data = await api.fetchData() 
    comp.contact = data.contact
    comp.description = data.description
    comp.title = data.title
    
    comp.apilink = firstByRel(data.links, 'service-doc')
    comp.collectionlink = firstByRel(data.links, 'data')
    console.log("comp.collectionlink", comp.collectionlink)
    comp.conformanceLink = firstByRel(data.links, 'conformance')
    comp.metadataLink = firstByRel(data.links, 'describedBy', true)
    comp.licenseLink = firstByRel(data.links, 'license')
}

export default {
    data() {
      return {
        description: '',
        title: '',
        apilink: {}, 
        collectionlink: {},
        conformanceLink: {},
        metadataLink: {},
        licenseLink: {},
        contact: {}
      }
    },
  beforeMount() {
      fetchData(this)
  }
}
</script>
