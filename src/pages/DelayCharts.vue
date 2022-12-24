<template>
  <detail-modal :filtersAsUrl="filtersAsUrl" />
  <v-row no-gutters>
    <v-col cols="4">
      <line-chart endpoint="delays/charts" pivot="year" aggregate="avg_delay" :filtersAsDict="filtersAsDict"
        :filtersAsUrl="filtersAsUrl" maximumRows="5" category="year" />
    </v-col>
    <v-col cols="4">
      <line-chart endpoint="delays/charts" pivot="month" aggregate="avg_delay" :filtersAsDict="filtersAsDict"
        :filtersAsUrl="filtersAsUrl" maximumRows="12" category="month" />
    </v-col>
    <v-col cols="4">
      <pie-chart endpoint="stops/charts" pivot="reason" aggregate="avg_stop" maximumRows="5"
        :filtersAsDict="filtersAsDict" :filtersAsUrl="filtersAsUrl" />
    </v-col>
    <v-col cols="4">
      <bar-chart endpoint="delays/charts" pivot="region" aggregate="avg_delay" maximumRows="20"
        :filtersAsDict="filtersAsDict" :filtersAsUrl="filtersAsUrl" />
    </v-col>
    <v-col cols="4">
      <bar-chart endpoint="delays/charts" pivot="path" aggregate="avg_delay" maximumRows="5"
        :filtersAsDict="filtersAsDict" :filtersAsUrl="filtersAsUrl" />
    </v-col>
    <v-col cols="4">
      <bar-chart endpoint="delays/charts" pivot="train" aggregate="avg_delay" maximumRows="10"
        :filtersAsDict="filtersAsDict" :filtersAsUrl="filtersAsUrl" />
    </v-col>
  </v-row>
</template>


<script setup>
import BarChart from "../components/charts/BarChart.vue";
import LineChart from "../components/charts/LineChart.vue";
import PieChart from "../components/charts/PieChart.vue";
import DetailModal from '../components/base/DetailModal.vue';
import { ref, computed, provide } from 'vue'


import fa from 'apexcharts/dist/locales/fa.json';
const { VITE_API_URL: API_URL } = import.meta.env

const api = API_URL
const filtersAsDict = ref({})

const filtersAsUrl = computed(() => {
  let filters = ""
  for (const filter in filtersAsDict.value) {
    let baseFilter = `&${filter}=`
    baseFilter += filtersAsDict.value[filter].join(",")
    filters += baseFilter
  }
  return filters
})


const filterReset = (pivot) => {
  delete filtersAsDict.value[pivot]
}

const filterChange = (filterValue, pivot) => {
  if (pivot === "from-to") {
    filtersAsDict.value["from"] = [filterValue.from]
    filtersAsDict.value["to"] = [filterValue.to]
    return null
  }
  if (pivot === "year" || pivot === "month") {
    filtersAsDict.value[pivot] = [filterValue]
    return null
  }
  filtersAsDict.value[pivot] ??= []
  if (!filtersAsDict.value[pivot].includes(filterValue)) filtersAsDict.value[pivot].push(filterValue)
}

provide('filterChange', filterChange)
provide('filterReset', filterReset)
provide('yearCategory', [1400, 1399, 1398, 1397, 1396])
provide('monthCategory', fa.options.months)
provide('api', api)
</script>