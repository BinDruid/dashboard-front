<template>
  <v-row class="pa-1" align="center" justify="start">
    <v-col cols="3">
      <v-select density="compact" return-object v-model="selectedYears" clearable label="انتخاب دو سال برای مقایسه"
        :items="years" multiple></v-select>
    </v-col>
  </v-row>
  <v-row no-gutters>
    <v-col cols="6" class="pivot-chart">
      <compare-chart endpoint="delay/charts" pivot="month" aggregate="avg_delay" :filtersAsDict="filtersAsDict"
        :filtersAsUrl="filtersAsUrl" maximumRows="12" category="month" />
    </v-col>
    <v-col cols="6" class="pivot-chart">
      <date-chart endpoint="delay/charts" pivot="day" aggregate="avg_delay" :filtersAsDict="filtersAsDict"
        :filtersAsUrl="filtersAsUrl" />
    </v-col>
  </v-row>
</template>

<script lang="js">
import CompareChart from "../components/charts/CompareChart.vue";
import DateChart from "../components/charts/DateChart.vue";
import DetailModal from '../components/base/DetailModal.vue';

import fa from 'apexcharts/dist/locales/fa.json' assert {type: 'json'};
const { VITE_API_URL: API_URL } = import.meta.env


export default {
  components: {
    CompareChart,
    DateChart,
    DetailModal
  },
  provide() {
    return {
      filterChange: this.filterChange,
      filterReset: this.filterReset,
      yearCategory: [1400, 1399, 1398, 1397, 1396],
      monthCategory: fa.options.months,
      api: this.api,
    }
  },
  data() {
    return {
      api: API_URL,
      selectedYears: null,
      filtersAsDict: {},
      years: ['1400', '1399', '1398', '1397', '1396']
    }
  },
  computed: {
    filtersAsUrl() {
      let filters = ""
      for (const filter in this.filtersAsDict) {
        let baseFilter = `&${filter}=`
        baseFilter += this.filtersAsDict[filter].join(",")
        filters += baseFilter
      }
      return filters
    }
  },
  methods: {
    filterChange(filterValue, pivot) {
      if (pivot === "from-to") {
        this.filtersAsDict["from"] = [filterValue.from]
        this.filtersAsDict["to"] = [filterValue.to]
        return null
      }
      this.filtersAsDict[pivot] ??= []
      if (!this.filtersAsDict[pivot].includes(filterValue)) this.filtersAsDict[pivot].push(filterValue)
    },
    filterReset(pivot) {
      delete this.filtersAsDict[pivot]
    },
  }
};
</script>
