<template>
  <detail-modal endpoint="delay/charts" :filtersAsUrl="filtersAsUrl" />
  <v-row no-gutters>
    <v-col cols="4">
      <line-chart endpoint="delay/charts" pivot="year" aggregate="avg_delay" :filtersAsDict="filtersAsDict"
        :filtersAsUrl="filtersAsUrl" maximumRows="5" category="year" />
    </v-col>
    <v-col cols="4">
      <line-chart endpoint="delay/charts" pivot="month" aggregate="avg_delay" :filtersAsDict="filtersAsDict"
        :filtersAsUrl="filtersAsUrl" maximumRows="12" category="month" />
    </v-col>
    <v-col cols="4">
      <pie-chart endpoint="stop/charts" pivot="reason" aggregate="avg_stop" maximumRows="5"
        :filtersAsDict="filtersAsDict" :filtersAsUrl="filtersAsUrl" />
    </v-col>
    <v-col cols="4">
      <bar-chart endpoint="delay/charts" pivot="region" aggregate="avg_delay" maximumRows="10"
        :filtersAsDict="filtersAsDict" :filtersAsUrl="filtersAsUrl" />
    </v-col>
    <v-col cols="4">
      <bar-chart endpoint="delay/charts" pivot="path" aggregate="avg_delay" maximumRows="5"
        :filtersAsDict="filtersAsDict" :filtersAsUrl="filtersAsUrl" />
    </v-col>
    <v-col cols="4">
      <bar-chart endpoint="delay/charts" pivot="train" aggregate="avg_delay" maximumRows="10"
        :filtersAsDict="filtersAsDict" :filtersAsUrl="filtersAsUrl" />
    </v-col>
  </v-row>
</template>

<script lang="js">
import BarChart from "../components/charts/BarChart.vue";
import LineChart from "../components/charts/LineChart.vue";
import PieChart from "../components/charts/PieChart.vue";
import CompareChart from "../components/charts/CompareChart.vue";
import DateChart from "../components/charts/DateChart.vue";
import JalaliDate from "../components/base/JalaliDate.vue";
import DetailModal from '../components/base/DetailModal.vue';

import fa from 'apexcharts/dist/locales/fa.json' assert {type: 'json'};
const { VITE_API_URL: API_URL } = import.meta.env


export default {
  components: {
    BarChart,
    LineChart,
    CompareChart,
    DateChart,
    JalaliDate,
    DetailModal,
    PieChart
  },
  provide() {
    return {
      filterChange: this.filterChange,
      filterReset: this.filterReset,
      yearCategory: [1400, 1399, 1398, 1397, 1396],
      monthCategory: fa.options.months,
      api: this.api
    }
  },
  data() {
    return {
      api: `${API_URL}`,
      filtersAsDict: {}
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
      if (pivot === "year" || pivot === "month") {
        this.filtersAsDict[pivot] = [filterValue]
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
