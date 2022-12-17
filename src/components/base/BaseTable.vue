<template>
  <table className="table table-info table-striped table-hover table-sm">
    <table-header :columns="columns" />
    <table-body :columns="columns" :data="data" />
  </table>
</template>

<script lang="js">
import TableBody from './TableBody.vue';
import TableHeader from './TableHeader.vue';

export default {
  props: ["data", "columns"],
  components: { TableBody, TableHeader }
};
</script>
