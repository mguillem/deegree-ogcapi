<template>
  <BApp>
    <footer class="page-footer" id="footer">
        <div class="footer-brand-left"></div>
        <div class="d-flex row justify-content-between">
            <div class="px-md-5">
                <a v-cloak v-bind:href="helpUrl" target="_blank" class="help"> Help</a>
            </div>
            <div class="px-md-5">
                <span v-if="legalNoticeUrl && legalNoticeUrl.length > 0">
                    <a v-cloak v-bind:href="legalNoticeUrl" target="_blank" class="legalNotice"> Legal Notice</a>
                </span>
                <span v-else>
                    <a href="https://www.deegree.org" target="_blank" class="legalNotice"> deegree</a>
                </span>
                <span v-if="privacyUrl && privacyUrl.length > 0">
                   <span> | </span>
                   <a v-cloak v-bind:href="privacyUrl" target="_blank" class="privacy"> Privacy Policy</a>
                </span>
                <span class="footer-brand-right"></span>
            </div>
        </div>
    </footer>
  </BApp>
</template>

<script setup>
import {BApp} from 'bootstrap-vue-next'
</script>

<script>
export default {
  name: 'CustomFooter',
  props: {
	documentationUrl: String,
    helpUrl: String,
    legalNoticeUrl: String,
    privacyUrl: String
  }
}
</script>
