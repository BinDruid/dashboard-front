<template>
  <v-progress-circular class="text-end" color="teal" indeterminate :size="20" :width="5"
    v-if="!chartLoaded"></v-progress-circular>
  <apexchart class="pivot-chart" type="pie" :endpoint="endpoint" :pivot="pivot" :aggregate="aggregate"
    :query-filters="queryFilters" :options="chartOptions" :series="series" :max-category="maxCategory"></apexchart>
</template>


<script setup>
import { watch, onMounted } from 'vue'

import usePieChart from "../../hooks/usePieChart";
const props = defineProps(["endpoint", "pivot", "queryFilters", "aggregate", "maxCategory"])

const {
  chartLoaded,
  fetchChart,
  chartOptions,
  series,
} = usePieChart(props)

watch((props.queryFilters), () => { fetchChart() })

onMounted(() => fetchChart())

</script>