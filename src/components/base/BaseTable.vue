<template>
  <v-table fixed-header density="compact">
    <table-header :columns="columns" />
    <table-body :columns="columns" :data="data" />
  </v-table>
</template>

<script lang="js">
import TableBody from './TableBody.vue';
import TableHeader from './TableHeader.vue';

export default {
  props: ["data", "columns"],
  components: { TableBody, TableHeader }
};
</script>
