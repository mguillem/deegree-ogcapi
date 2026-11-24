<template>
        <div class="container" id="content">
            <div>
                <div class="row">
                    <div class="col">
                        <h3 v-cloak class="mt-5">{{ id }}</h3>
                    </div>
                </div>
                <hr/>
                <div class="row justify-content-between">
                    <div class="col-md">
                        <div class="row mt-2">
                            <div class="col">
                                <table class="table table-striped" style="overflow-wrap: anywhere;">
                                    <thead>
                                    <tr>
                                        <th scope="col">Attribute</th>
                                        <th scope="col">Value</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr v-for="(attribute, property) in properties" :key="property">
                                        <td v-cloak>{{ property }}</td>
                                        <TdAttributeValue :value="attribute" jsonLink="?f=json"></TdAttributeValue>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="col-md">
                        <FeatureMap v-if="type" :geoData="this"/>
                    </div>
                </div>

                <div class="row">
                        <div class="col-sm-2">Links</div>
                        <div class="col-md-10">
                            <div v-for="link in links" :key="link.title">
                                <a v-cloak v-if="link.type == 'text/html' && link.rel != 'alternate'" v-bind:href="link.href" >{{ link.title }}</a>
                            </div>
                        </div>
                </div>
            </div>
        </div>
</template>


<script setup>
import FeatureMap from './FeatureMap.vue'
import TdAttributeValue from './TdAttributeValue.vue'
</script>

<script>
import * as api from '../backendApi.js';

async function fetchData(comp) {
    const data = await api.fetchData()
    for (var prop in data) {
        comp[prop] = data[prop]
    }
}
export default {
  name: 'FeatureItem',
  data() {
      return {
    crs: '',
    id: '',
    geometry: {},
    links: [],
    properties: [],
    srsName: '',
    type: ''
  }
  },
  beforeMount() {
      fetchData(this)
  }
}
</script>