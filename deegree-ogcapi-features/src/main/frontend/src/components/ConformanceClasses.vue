<template>
    <div class="container">
        <div class="row">
            <div class="col-lg-12" id="content">
                <h1 class="mt-5">Conformance Classes</h1>
                <div class="row">
                    <div class="col-md-12">
                        <ul class="list-group">
                            <li v-cloak v-for="item in conformsTo" :key="item" class="list-group-item">
                                {{ item }}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import * as api from '../backendApi.js';

async function fetchData(comp) {
    const data = await api.fetchData() 
    comp.conformsTo = data.conformsTo
}

export default {
  name: 'ConformanceClasses',
  data() {
    return {
    conformsTo: []
    }},
  beforeMount() {
      fetchData(this)
  }
}
</script>
