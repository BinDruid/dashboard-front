<template>
  <div
    class="spinner-border text-primary spin-on"
    role="status"
    v-if="!chartLoaded"
  >
    <span class="visually-hidden">Loading...</span>
  </div>
  <p v-if="selfFilters">
    {{ selfFilters }}
    <button
      class="btn btn-outline-secondary btn-small"
      :disabled="selfFilters === ''"
      @click="resetFilter"
    >
      بازنشانی
    </button>
  </p>
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
      chartLoaded: false,
      chartOptions: {
          chart: {
            id: `bar-chart-${this.pivot}`,
            zoom: {
              enabled: true,
            },
            locales: [fa],
            defaultLocale: 'fa',

          },
          title: {
            text: `متوسط تاخیر به تفکیک ${this.verboosePivot()}`,
            align: 'center',
            margin: 10,
            offsetX: 0,
            offsetY: 0,
            floating: true,
            style: {
              fontSize: '14px',
              fontWeight: 'bold',
              fontFamily: 'Sahel FD',
              color: '#263238'
            },
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
      replaceData(data){
        this.chartOptions.xaxis.categories.length = 0
        this.series[0].data.length = 0
        data.results.slice(0,this.maximumRows).forEach((dataPoint) => {
          this.chartOptions.xaxis.categories.push(dataPoint[this.pivot]);
          this.series[0].data.push(dataPoint[this.aggregate]);
        });
      },
      verboosePivot(){
      switch (this.pivot){
        case "train":
          return "قطار"
        case "path":
          return "مسیر"
        case "region":
          return "ناحیه"
        case "year":
          return "سال"
        case "month":
          return "ماه"
      }
    },
    async fetchChart(){
      this.chartLoaded = false
      const { data } = await axios.get(this.baseUrl+this.ignoreSelfUrl);
      this.replaceData(data)
      this.chartLoaded = true
    }
  },
  created() {
    this.fetchChart()
  },
};
</script>

<style scoped>
.spin-on {
  position: relative;
}
</style>
