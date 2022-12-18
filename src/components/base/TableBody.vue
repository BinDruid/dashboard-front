<template>
  <tbody>
    <tr v-for="(item, dataIndex) in data" :key="dataIndex">
      <td v-for="(column, colIndex) in columns" :key="colIndex">
        {{ renderCell(item, column) }}</td>
    </tr>
  </tbody>
</template>

<script setup>
import _ from "lodash";
const props = defineProps(["data", "columns"])

const renderCell = (item, column) => {
  if (column.content) return column.content(item);
  return _.get(item, column.path);
}
</script>
