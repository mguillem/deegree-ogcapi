<template>
    <td v-cloak v-if="(typeof value) == 'string' && value.startsWith('http')" >
        <a v-bind:href="value" v-bind:title="value" target="_blank">{{ truncate(value, 50) }}</a>
    </td>
    <td v-cloak v-else-if="Array.isArray(value) && value.length > 0 && typeof(value[0]) !== 'object'" >
        <ul class="propertylist">
            <li v-for="item in value" :key="item">
                {{ item }}
            </li>
        </ul>
    </td>
    <td v-cloak v-else-if="(Array.isArray(value) && value.length > 0) || typeof(value) === 'object'" >
        <a v-bind:href="jsonLink" target="_blank">Complex object, view as json</a>
    </td>
    <td v-cloak v-else v-bind:title="value">{{ truncate(value, 50) }}</td>
</template>

<script setup>
function truncate(s, maxSize) {
    if (s.length > maxSize) {
        return s.substring(0, maxSize) + "..."
    }
    return s
}
</script>

<script>

export default {
  name: 'TdAttributeValue',
  props: {
    value: [Array, Boolean, Number, Object, String],
    jsonLink: String
  }
}
</script>