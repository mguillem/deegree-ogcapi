<!-- 
renders <a ...> for external links and <RouterLink ...> for app internal links
-->
<template>
    <a v-cloak v-if="!internalRelPath" :href="href">
        <slot />
    </a>
    <RouterLink v-if="internalRelPath" :to="internalRelPath">
        <slot />
    </RouterLink>
</template>

<script setup>
import * as api from '../backendApi.js';
</script>

<script>

export default {
    name: 'SmartLink',
    props: {
        href: String
    },
    computed: {
        internalRelPath() {
            return api.getAppRelativePath(this.href)
        }
    }
}
</script>