import { createApp } from 'vue'
import ConformanceClasses from './components/ConformanceClasses.vue'
import DataSets from './components/DataSets.vue'
import DataSet from './components/DataSet.vue'
import App from './App.vue'
import FeatureCollections from './components/FeatureCollections.vue'
import FeatureCollection from './components/FeatureCollection.vue'
import FeatureItem from './components/FeatureItem.vue'
import FeatureItems from './components/FeatureItems.vue'
import { createWebHistory, createRouter } from 'vue-router'


import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
import 'ol/ol.css'
import './main.css'

console.log('Running')

const routes = [
  { path: '/', component: DataSets },
  { path: '/:context/datasets', component: DataSets },
  { path: '/:context/datasets/', component: DataSets },
  { path: '/:context/datasets/:dataset', component: DataSet },
  { path: '/:context/datasets/:dataset/conformance', component: ConformanceClasses },
  { path: '/:context/datasets/:dataset/collections', component: FeatureCollections },
  { path: '/:context/datasets/:dataset/collections/:collection', component: FeatureCollection },
  { path: '/:context/datasets/:dataset/collections/:collection/items', component: FeatureItems },
  { path: '/:context/datasets/:dataset/collections/:collection/items/:item', component: FeatureItem },
]
export const router = createRouter({
  history: createWebHistory(),
  routes,
})

createApp(App).use(router).mount('#app')
