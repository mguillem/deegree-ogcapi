<template>
  <BApp>
    <div class="row">
        <div class="col-lg-12" id="content">
            <h1 v-cloak class="mt-5">{{ title }}</h1>
            <p v-cloak class="lead">{{ description }}</p>
            <div class="row">
                <div class="col-sm-3">Collections</div>
                <div class="col-md-9">
                    <a v-cloak v-bind:href="collectionlink.href" >{{ collectionlink.title }}</a>
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
                    <a v-cloak v-bind:href="conformanceLink.href" >{{ conformanceLink.title }}</a>
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
</script>

<script>
export default {
  props: {
    description: String,
    title: String,
    apilink: {href: String, rel: String, title: String, type: String }, 
    collectionlink: {href: String, rel: String, title: String, type: String },
    conformanceLink: {href: String, rel: String, title: String, type: String },
    metadataLink: {href: String, rel: String, title: String, type: String },
    licenseLink: {href: String, rel: String, title: String, type: String },
    contact: {
      name: String,
      email: String
    } 
  }
}
</script>
