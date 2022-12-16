<template>
  <div class="row p-2">
    <div class="col-6 pivot-chart">
      <line-chart pivot="year" aggregate="avg_delay" :filtersAsDict="filtersAsDict" :filtersAsUrl="filtersAsUrl"
        maximumRows="5" category="year" />
    </div>
    <div class="col-6 pivot-chart">
      <line-chart pivot="month" aggregate="avg_delay" :filtersAsDict="filtersAsDict" :filtersAsUrl="filtersAsUrl"
        maximumRows="12" category="month" />
    </div>
    <div class="col-4 pivot-chart">
      <bar-chart pivot="region" aggregate="avg_delay" maximumRows="10" :filtersAsDict="filtersAsDict"
        :filtersAsUrl="filtersAsUrl" />
    </div>
    <div class="col-4 pivot-chart">
      <bar-chart pivot="path" aggregate="avg_delay" maximumRows="5" :filtersAsDict="filtersAsDict"
        :filtersAsUrl="filtersAsUrl" />
    </div>
    <div class="col-4 pivot-chart">
      <bar-chart pivot="train" aggregate="avg_delay" maximumRows="10" :filtersAsDict="filtersAsDict"
        :filtersAsUrl="filtersAsUrl" />
    </div>
  </div>
</template>

<script lang="js">
import BarChart from "./BarChart.vue";
import LineChart from "./LineChart.vue";
import fa from 'apexcharts/dist/locales/fa.json' assert {type: 'json'};
const { VITE_API_URL: API_URL } = import.meta.env


export default {
  components: {
    BarChart,
    LineChart
  },
  provide() {
    return {
      filterChange: this.filterChange,
      filterReset: this.filterReset,
      yearCategory: [1400, 1399, 1398, 1397, 1396],
      monthCategory: fa.options.months,
      apiEndPoint: this.apiEndPoint
    }
  },
  data() {
    return {
      apiEndPoint: `${API_URL}/delay/charts`,
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
      this.filtersAsDict[pivot] ??= []
      if (!this.filtersAsDict[pivot].includes(filterValue)) this.filtersAsDict[pivot].push(filterValue)
    },
    filterReset(pivot) {
      delete this.filtersAsDict[pivot]
    },
  }
};
</script>
