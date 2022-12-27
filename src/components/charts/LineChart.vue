<template>
  <v-progress-circular class="text-end" color="teal" indeterminate :size="20" :width="5"
    v-if="!chartLoaded"></v-progress-circular>
  <v-chip closable v-if="selfFilters" @click:close="resetFilter">
    {{ selfFilters }}
  </v-chip>
  <apexchart class="pivot-chart" :endpoint="endpoint" type="area" :pivot="pivot" :aggregate="aggregate"
    :category="category" :query-filters="queryFilters" :options="chartOptions" :series="series"
    :max-category="maxCategory" @markerClick="selectionHandler"></apexchart>
</template>

<script setup>
import { watch, onMounted } from 'vue'
import useLineChart from "../../hooks/useLineChart";
const props = defineProps(["endpoint", "pivot", "queryFilters", "aggregate", "maxCategory", "category"])


const {
  chartLoaded,
  selfFilters,
  fetchChart, selectionHandler, resetFilter, chartOptions, series
} = useLineChart(props)


watch((props.queryFilters), () => { fetchChart() })
onMounted(() => fetchChart())

</script>