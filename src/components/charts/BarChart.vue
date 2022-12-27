<template>
  <v-progress-circular class="text-end" color="teal" indeterminate :size="20" :width="5"
    v-if="!chartLoaded"></v-progress-circular>
  <v-chip closable v-if="selfFilters" @click:close="resetFilter">
    {{ selfFilters }}
  </v-chip>
  <apexchart class="pivot-chart" type="bar" :endpoint="endpoint" :pivot="pivot" :aggregate="aggregate"
    :query-filters="queryFilters" :options="chartOptions" :series="series" :max-category="maxCategory"
    @dataPointSelection="selectionHandler"></apexchart>
</template>

<script setup>
import { watch, onMounted } from 'vue'
import useBarChart from "../../hooks/useBarChart";
const props = defineProps(["endpoint", "pivot", "queryFilters", "aggregate", "maxCategory"])


const {
  chartLoaded,
  selfFilters,
  fetchChart, selectionHandler, resetFilter, chartOptions, series
} = useBarChart(props)


watch((props.queryFilters), () => { fetchChart() })
onMounted(() => fetchChart())

</script>

