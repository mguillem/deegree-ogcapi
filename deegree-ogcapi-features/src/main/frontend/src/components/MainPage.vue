<template>
  <BApp>
    <header>
        <nav class="navbar navbar-default">
            <div class="container-fluid">
                <a class="navbar-brand" href="#"></a>
                <ul class="nav" id="breadcrump">
                    <li class="breadcrumb-item">
                        <a v-bind:href="datasetsLink">Datasets</a>
                    </li>
                    <li class="breadcrumb-item" v-if="datasetName">
                        <a v-cloak v-bind:href="datasetLink">{{ datasetName }}</a>
                    </li>
                    <li class="breadcrumb-item" v-if="collectionsLink">
                        <a v-bind:href="collectionsLink">Collections</a>
                    </li>
                    <li v-cloak class="breadcrumb-item" v-if="collectionLink">
                        <a v-bind:href="collectionLink">{{ collectionId }}</a>
                    </li>
                    <li class="breadcrumb-item active" v-if="conformanceClasses" aria-current="page">Conformance Classes</li>

                    <li class="breadcrumb-item" v-if="itemsLink">
                        <a v-bind:href="itemsLink">Features</a>
                    </li>
                    <li v-cloak class="breadcrumb-item active" v-if="featureId" aria-current="page">{{ featureId }}</li>
                </ul>
                <ul class="nav justify-content-end">
                    <li class="nav-item">
                        <a class="nav-link" href="?f=json" target="_blank">JSON</a>
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

    <div id='appContent'></div>
    <div id='footerWrapper'></div>
  </BApp>
</template>

<script setup>
import {BApp} from 'bootstrap-vue-next'
import '../main.css'
</script>

<script>
export default {
  name: 'MainPage',
  props: {
    datasetsLink: String,
    datasetName: String,
    datasetLink: String,
    conformanceClasses: Boolean,
    collectionsLink: String,
    collectionId: String,
    collectionLink: String,
    itemsLink: String,
    featureId: String,
    xmlLinkLabel: String
  }
}
</script>
