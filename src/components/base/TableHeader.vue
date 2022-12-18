<template>
  <thead>
    <tr>
      <th v-for="(column, index) in columns" :key="column.path ?? column.key" role="button">
        {{ column.lable }}
      </th>
    </tr>
  </thead>
</template>

<script setup>
const props = defineProps(['columns'])
</script>