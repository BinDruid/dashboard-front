<template>
  <v-table fixed-header density="compact">
    <table-header :columns="columns" />
    <table-body :columns="columns" :data="data" />
  </v-table>
</template>

<script setup>
import TableBody from './TableBody.vue';
import TableHeader from './TableHeader.vue';
const props = defineProps(["data", "columns"])
</script>