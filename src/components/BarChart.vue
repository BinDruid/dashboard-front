<template>
  <h4 class="d-inline mx-2">Average Delay for {{ pivot }}</h4>
  <span v-if="selfFilters">Selected Filter: {{ selfFilters }}</span>
  <button
    class="btn btn-warning btn-small"
    :disabled="selfFilters === ''"
    @click="resetFilter"
  >
    Reset
  </button>
  <apexchart
    type="bar"
    :pivot="pivot"
    :aggregate="aggregate"
    :filtersAsDict="filtersAsDict"
    :filtersAsUrl="filtersAsUrl"
    :options="chartOptions"
    :series="series"
    :maximumRows="maximumRows"
    @dataPointSelection="selectionHandler"
  ></apexchart>
</template>

<script lang="js">
import axios from "axios";
import fa from 'apexcharts/dist/locales/fa.json' assert {type: 'json'};

export default {
  props: ["pivot", "filtersAsDict", "filtersAsUrl", "aggregate", "maximumRows"],
  inject: ["filterChange", "filterReset"],
  data() {
    return {
      baseUrl: `https://fdaneshmand.ir/v1/delay/charts/?pivot=${this.pivot}`,
      chartOptions: {
          chart: {
            id: `bar-chart-${this.pivot}`,
            zoom: {
              enabled: true,
            },
            locales: [fa],
            defaultLocale: 'fa',

          },
          xaxis: {
            categories: [],
          },
          plotOptions: {
              bar: {
                borderRadius: 4,
                horizontal: true,
              }
            },
            dataLabels: {
              enabled: false
            },
        },
        series: [
          {
            name: this.aggregate,
            data: [],
          },
        ],
    };
  },
  watch: {
    filtersAsUrl(){
      this.fetchChart()
    }
  },
  computed:{
    ignoreSelfUrl(){
    let filters = ""
      for (const filter in this.filtersAsDict)
        if (filter!== this.pivot){
        let baseFilter =`&${filter}=`
        baseFilter += this.filtersAsDict[filter].join(",")
        filters += baseFilter
        }
      return filters
    },
    selfFilters(){
    let filters = ""
      if (this.filtersAsDict[this.pivot]){
        let baseFilter =`${this.pivot}=`
        baseFilter += this.filtersAsDict[this.pivot].join(",")
        filters += baseFilter
        }
      return filters
    }
  },
  methods: {
    selectionHandler(e, chartContext, config) {
      const selected = this.chartOptions.xaxis.categories[config.dataPointIndex]
      this.filterChange (selected, this.pivot)
      },
    resetFilter() {
      this.filterReset(this.pivot)
      },
    async fetchChart(){
      const { data } = await axios.get(this.baseUrl+this.ignoreSelfUrl);
      this.chartOptions.xaxis.categories.length = 0
      this.series[0].data.length = 0
      data.results.slice(0,this.maximumRows).forEach((dataPoint) => {
        this.chartOptions.xaxis.categories.push(dataPoint[this.pivot]);
        this.series[0].data.push(dataPoint[this.aggregate]);
    });
    }
  },
  created() {
    this.fetchChart()
  },
};
</script>
