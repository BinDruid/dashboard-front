<template>
  <v-progress-circular color="teal" indeterminate :size="20" :width="5" v-if="!chartLoaded"></v-progress-circular>
  <apexchart class="pivot-chart" :pivot="pivot" :aggregate="aggregate" :category="category"
    :query-filters="queryFilters" :options="chartOptions" :series="series" :max-category="maxCategory"></apexchart>
</template>


<script setup>
import { onMounted } from 'vue'
import useCompareChart from "../../hooks/useCompareChart";
const props = defineProps(["endpoint", "pivot", "queryFilters", "aggregate", "maxCategory", "category"])

const { chartLoaded, fetchChart, chartOptions, series } = useCompareChart(props)

onMounted(() => fetchChart())

</script>