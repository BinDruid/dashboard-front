<template>
  <apexchart class="pivot-chart" :endpoint="endpoint" type="area" :pivot="pivot" :aggregate="aggregate"
    :options="chartOptions" :series="series" @beforeZoom="zoomHandler" @beforeResetZoom="resetZoomHandler"></apexchart>
</template>

<script setup>
import { onMounted } from 'vue'
import useDateChart from "../../hooks/useDateChart";
const props = defineProps(["endpoint", "pivot", "queryFilters", "aggregate", "maxCategory", "category"])

const { chartLoaded,
  fetchChart,
  chartOptions,
  series,
  zoomHandler,
  resetZoomHandler, } = useDateChart(props)

onMounted(() => fetchChart())

</script>