<template>
  <v-row no-gutters class="pa-1" align="center">
    <v-col cols="2">
      <v-btn variant="flat" prepend-icon="mdi-refresh" color="info" @click="resetAll">
        بازنشانی فیلترها </v-btn> </v-col>
    <v-col cols="10">
      <detail-modal :filtersAsUrl="filtersAsUrl" />
    </v-col>
  </v-row>
  <v-row no-gutters>
    <v-col cols="4">
      <line-chart endpoint="delays/charts" pivot="year" aggregate="avg_delay" :query-filters="queryFilters"
        max-category="5" category="year" />
    </v-col>
    <v-col cols="4">
      <line-chart endpoint="delays/charts" pivot="month" aggregate="avg_delay" :query-filters="queryFilters"
        max-category="12" category="month" />
    </v-col>
    <v-col cols="4">
      <pie-chart endpoint="stops/charts" pivot="reason" aggregate="avg_stop" max-category="5"
        :query-filters="queryFilters" />
    </v-col>
    <v-col cols="4">
      <bar-chart endpoint="delays/charts" pivot="region" aggregate="avg_delay" max-category="10"
        :query-filters="queryFilters" />
    </v-col>
    <v-col cols="4">
      <bar-chart endpoint="delays/charts" pivot="path" aggregate="avg_delay" max-category="5"
        :query-filters="queryFilters" />
    </v-col>
    <v-col cols="4">
      <bar-chart endpoint="delays/charts" pivot="train" aggregate="avg_delay" max-category="10"
        :query-filters="queryFilters" />
    </v-col>
  </v-row>
</template>


<script setup>
import { ref, computed, provide } from 'vue'
import BarChart from "../components/charts/BarChart.vue";
import LineChart from "../components/charts/LineChart.vue";
import PieChart from "../components/charts/PieChart.vue";
import DetailModal from '../components/base/DetailModal.vue';


import fa from 'apexcharts/dist/locales/fa.json';
const { VITE_API_URL: API_URL } = import.meta.env

const api = API_URL
const queryFilters = ref({})

const filtersAsUrl = computed(() => {
  let filters = ""
  for (const filter in queryFilters.value) {
    let baseFilter = `&${filter}=`
    baseFilter += queryFilters.value[filter].join(",")
    filters += baseFilter
  }
  return filters
})


const filterReset = (pivot) => {
  delete queryFilters.value[pivot]
}

const resetAll = () => {
  for (const filter in queryFilters.value) {
    delete queryFilters.value[filter]
  }
}


const filterChange = (filterValue, pivot) => {
  if (pivot === "from-to") {
    queryFilters.value["from"] = [filterValue.from]
    queryFilters.value["to"] = [filterValue.to]
    return null
  }
  if (pivot === "year" || pivot === "month") {
    queryFilters.value[pivot] = [filterValue]
    return null
  }
  queryFilters.value[pivot] ??= []
  if (!queryFilters.value[pivot].includes(filterValue)) queryFilters.value[pivot].push(filterValue)
}

provide('filterChange', filterChange)
provide('filterReset', filterReset)
provide('yearCategory', [1400, 1399, 1398, 1397, 1396])
provide('monthCategory', fa.options.months)
provide('api', api)
</script>