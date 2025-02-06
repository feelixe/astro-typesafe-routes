<template>
  <a :href="href" v-bind="anchorProps">
    <slot></slot>
  </a>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { $path } from '../../../path.js';

// Define the props
const props = defineProps({
  to: {
    type: String,
    required: true,
  },
  params: {
    type: Object,
    default: () => ({}),
  },
  search: {
    type: Object,
    default: () => ({}),
  },
  searchParams: {
    type: Object,
    default: () => ({}),
  },
  hash: {
    type: String,
    default: '',
  },
  trailingSlash: {
    type: Boolean,
    default: false,
  },
  // Other anchor props
  anchorProps: {
    type: Object,
    default: () => ({}),
  },
});

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