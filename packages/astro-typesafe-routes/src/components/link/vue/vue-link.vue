<template>
  <a :href="href" v-bind="$attrs">
    <slot></slot>
  </a>
</template>

<script setup lang="ts">
import { AnchorHTMLAttributes, computed, defineProps } from 'vue';
import { $path, RouteOptions } from '../../../path.js';

const props = defineProps<AnchorHTMLAttributes & RouteOptions>()

// Compute the href based on the provided props
const href = computed(() => {
  return $path({
    to: props.to,
    params: props.params,
    search: props.search,
    searchParams: props.searchParams,
    hash: props.hash,
    trailingSlash: props.trailingSlash,
  });
});
</script>