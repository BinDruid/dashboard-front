<template>
  <v-row class="pa-1" align="center" justify="start">
    <v-col cols="3">
      <v-select density="compact" return-object v-model="selectedYears" clearable label="انتخاب دو سال برای مقایسه"
        :items="years" multiple></v-select>
    </v-col>
  </v-row>
  <v-row no-gutters>
    <v-col cols="6" class="pivot-chart">
      <compare-chart endpoint="delays/charts" pivot="month" aggregate="avg_delay" :query-filters="queryFilters"
        max-category="12" category="month" />
    </v-col>
    <v-col cols="6" class="pivot-chart">
      <date-chart endpoint="delays/charts" pivot="day" aggregate="avg_delay" :query-filters="queryFilters" />
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, computed, provide } from 'vue'

import DateChart from "../components/charts/DateChart.vue";
import CompareChart from "../components/charts/CompareChart.vue";

import fa from 'apexcharts/dist/locales/fa.json';
const { VITE_API_URL: API_URL } = import.meta.env

const years = ['1400', '1399', '1398', '1397', '1396']
const api = API_URL
const queryFilters = ref({})
const selectedYears = ref(null)

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

const filterChange = (filterValue, pivot) => {
  if (pivot === "from-to") {
    queryFilters.value["from"] = [filterValue.from]
    queryFilters.value["to"] = [filterValue.to]
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