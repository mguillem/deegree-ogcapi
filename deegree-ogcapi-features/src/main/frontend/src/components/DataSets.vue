<template>
    <div class="container">

        <div class="row">
            <div class="col-lg-12" id="content">
                <h1 v-cloak class="mt-5" v-if="title" >{{ title }}</h1>
                <h1 class="mt-5" v-else >Datasets</h1>
                <p v-cloak class="lead">{{ description }}</p>
                <div class="row">
                    <div class="col-md-12">
                        <ul class="list-group">
                            <li v-for="dataset in datasets" :key="dataset.name" class="list-group-item">
                                <h5 v-if="dataset.title" v-cloak>{{dataset.title}}</h5>
                                <h5 v-else v-cloak>{{dataset.name}}</h5>
                                <div class="row mt-2">
                                    <div class="col-sm-2">Links</div>
                                    <div class="col-md-10">
                                        <div v-for="link in dataset.links" :key="link.title">
                                            <SmartLink v-if="link.type == 'text/html' && link.rel != 'alternate'" :href="link.href">{{ link.title }}</SmartLink>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="row" v-if="contact && contact.name">
                    <h3 class="mt-5" >Contact</h3>
                    <div class="col-md-12">
                        <a v-cloak v-bind:href="contact.url" >{{ contact.name }}</a> (<a v-cloak v-bind:href="'mailto:' + contact.email" >E-Mail</a>)
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import * as api from '../backendApi.js';
import SmartLink from './SmartLink.vue'
</script>

<script>
async function fetchData(comp) {
    const data = await api.fetchData() 
    data.datasets.sort(function compare(a, b) {
        return a.title.localeCompare(b.title);
    })
    for (var prop in data) {
        comp[prop] = data[prop]
    }
}
    

export default {
  name: 'DataSets',
  data() {
    return {
      contact: {}, 
      description: '',
      datasets: [],
      links: [],
      title: ''
    }
  },
  beforeMount() {
      fetchData(this)
  }
}
</script>
